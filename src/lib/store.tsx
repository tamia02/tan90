import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import {
  seedFinanceRecords,
  seedGateEntries,
  seedGrnRecords,
  seedLedgerEntries,
  seedUnloadingRecords,
  seedValidationIssues,
  seedVendorSubmissions,
} from './seed';
import type {
  FinanceRecord,
  GateEntry,
  GrnRecord,
  IssueStatus,
  LedgerEntry,
  QcSplit,
  UnloadingRecord,
  ValidationIssue,
  VendorSubmission,
} from './types';
import type { Role } from './auth';

export interface Session {
  name: string;
  loggedInAt: string;
}

export interface ZohoConnection {
  connected: boolean;
  orgName?: string;
  connectedAt?: string;
  lastSyncedAt?: string;
  syncCount: number;
}

interface State {
  gateEntries: GateEntry[];
  issues: ValidationIssue[];
  vendorSubmissions: VendorSubmission[];
  unloadingRecords: UnloadingRecord[];
  grnRecords: GrnRecord[];
  ledger: LedgerEntry[];
  finance: FinanceRecord[];
  auth: Partial<Record<Role, Session>>;
  zoho: ZohoConnection;
}

const initialState: State = {
  gateEntries: seedGateEntries,
  issues: seedValidationIssues,
  vendorSubmissions: seedVendorSubmissions,
  unloadingRecords: seedUnloadingRecords,
  grnRecords: seedGrnRecords,
  ledger: seedLedgerEntries,
  finance: seedFinanceRecords,
  auth: {},
  zoho: { connected: false, syncCount: 0 },
};

type Action =
  | { type: 'ADD_VENDOR_SUBMISSION'; payload: VendorSubmission }
  | { type: 'ADD_GATE_ENTRY'; payload: GateEntry; issues: ValidationIssue[] }
  | { type: 'UPDATE_ISSUE'; payload: { id: string; status: IssueStatus; owner?: string; note?: string } }
  | { type: 'START_UNLOADING'; payload: UnloadingRecord }
  | { type: 'COMPLETE_UNLOADING'; payload: { gateEntryId: string; completedAt: string } }
  | {
      type: 'SAVE_GRN';
      payload: {
        gateEntryId: string;
        sku: string;
        poQty: number;
        invoiceQty: number;
        split: QcSplit;
        qcReasons?: string;
        suggestedBin: string;
      };
    }
  | { type: 'SET_VENDOR_STATUS'; payload: { gateEntryId: string; vendorStatus: FinanceRecord['vendorStatus']; notes?: string } }
  | { type: 'LOGIN'; payload: { role: Role; name: string } }
  | { type: 'LOGOUT'; payload: { role: Role } }
  | { type: 'ZOHO_CONNECT'; payload: { orgName: string } }
  | { type: 'ZOHO_DISCONNECT' }
  | { type: 'ZOHO_SYNCED' };

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_VENDOR_SUBMISSION':
      return { ...state, vendorSubmissions: [action.payload, ...state.vendorSubmissions] };

    case 'ADD_GATE_ENTRY':
      return {
        ...state,
        gateEntries: [action.payload, ...state.gateEntries],
        issues: [...action.issues, ...state.issues],
      };

    case 'UPDATE_ISSUE': {
      const issues = state.issues.map((issue) =>
        issue.id === action.payload.id
          ? { ...issue, status: action.payload.status, owner: action.payload.owner ?? issue.owner, note: action.payload.note ?? issue.note }
          : issue,
      );
      const issue = issues.find((i) => i.id === action.payload.id);
      let gateEntries = state.gateEntries;
      if (issue) {
        const stillBlocking = issues.some(
          (i) => i.gateEntryId === issue.gateEntryId && i.status === 'open' && (i.severity === 'hardFail' || i.severity === 'redFlag'),
        );
        if (!stillBlocking) {
          gateEntries = gateEntries.map((g) =>
            g.id === issue.gateEntryId && g.status === 'pending_validation' ? { ...g, status: 'validated' } : g,
          );
        }
      }
      return { ...state, issues, gateEntries };
    }

    case 'START_UNLOADING':
      return {
        ...state,
        unloadingRecords: [action.payload, ...state.unloadingRecords],
        gateEntries: state.gateEntries.map((g) => (g.id === action.payload.gateEntryId ? { ...g, status: 'unloading' } : g)),
      };

    case 'COMPLETE_UNLOADING':
      return {
        ...state,
        unloadingRecords: state.unloadingRecords.map((u) =>
          u.gateEntryId === action.payload.gateEntryId ? { ...u, completedAt: action.payload.completedAt } : u,
        ),
        gateEntries: state.gateEntries.map((g) => (g.id === action.payload.gateEntryId ? { ...g, status: 'grn' } : g)),
      };

    case 'SAVE_GRN': {
      const { gateEntryId, sku, poQty, invoiceQty, split, qcReasons, suggestedBin } = action.payload;
      const physicalReceived = split.accepted + split.qcHold + split.defective + split.rejected;
      const missing = Math.max(invoiceQty - physicalReceived, 0);
      const grn: GrnRecord = {
        gateEntryId,
        sku,
        poQty,
        invoiceQty,
        physicalReceived,
        split,
        missing,
        qcReasons,
        suggestedBin,
        posted: true,
        createdAt: new Date().toISOString(),
      };

      const ts = new Date().toISOString();
      const ledgerAdds: LedgerEntry[] = [];
      if (split.accepted > 0) ledgerAdds.push({ id: nextId('LG'), timestamp: ts, gateEntryId, sku, bin: suggestedBin, bucket: 'available', qty: split.accepted });
      if (split.defective > 0) ledgerAdds.push({ id: nextId('LG'), timestamp: ts, gateEntryId, sku, bin: suggestedBin, bucket: 'defective', qty: split.defective });
      if (split.rejected > 0) ledgerAdds.push({ id: nextId('LG'), timestamp: ts, gateEntryId, sku, bin: suggestedBin, bucket: 'rejected', qty: split.rejected });
      if (split.qcHold > 0) ledgerAdds.push({ id: nextId('LG'), timestamp: ts, gateEntryId, sku, bin: suggestedBin, bucket: 'qcHold', qty: split.qcHold });

      const gate = state.gateEntries.find((g) => g.id === gateEntryId);
      const rate = 42;
      const finance: FinanceRecord = {
        gateEntryId,
        vendorName: gate?.vendorName ?? 'Unknown Vendor',
        invoiceNumber: gate?.invoiceNumber ?? '-',
        ratePerUnit: rate,
        invoiceValue: invoiceQty * rate,
        acceptedValue: split.accepted * rate,
        deductions: { defective: split.defective * rate, rejected: split.rejected * rate, missing: missing * rate },
        finalPayable: split.accepted * rate,
        vendorStatus: 'pending',
        createdAt: ts,
      };

      return {
        ...state,
        grnRecords: [grn, ...state.grnRecords],
        ledger: [...ledgerAdds, ...state.ledger],
        finance: [finance, ...state.finance],
        gateEntries: state.gateEntries.map((g) => (g.id === gateEntryId ? { ...g, status: 'closed' } : g)),
      };
    }

    case 'SET_VENDOR_STATUS':
      return {
        ...state,
        finance: state.finance.map((f) =>
          f.gateEntryId === action.payload.gateEntryId
            ? { ...f, vendorStatus: action.payload.vendorStatus, notes: action.payload.notes ?? f.notes }
            : f,
        ),
      };

    case 'LOGIN':
      return {
        ...state,
        auth: { ...state.auth, [action.payload.role]: { name: action.payload.name, loggedInAt: new Date().toISOString() } },
      };

    case 'LOGOUT': {
      const auth = { ...state.auth };
      delete auth[action.payload.role];
      return { ...state, auth };
    }

    case 'ZOHO_CONNECT': {
      const now = new Date().toISOString();
      return { ...state, zoho: { connected: true, orgName: action.payload.orgName, connectedAt: now, lastSyncedAt: now, syncCount: 0 } };
    }

    case 'ZOHO_DISCONNECT':
      return { ...state, zoho: { connected: false, syncCount: 0 } };

    case 'ZOHO_SYNCED':
      return { ...state, zoho: { ...state.zoho, lastSyncedAt: new Date().toISOString(), syncCount: state.zoho.syncCount + 1 } };

    default:
      return state;
  }
}

const STORAGE_KEY = 'tan90-grn-demo-v1';

function loadInitial(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>;
      return {
        ...initialState,
        ...parsed,
        auth: { ...initialState.auth, ...parsed.auth },
        zoho: { ...initialState.zoho, ...parsed.zoho },
      };
    }
  } catch {
    // ignore corrupt storage, fall back to seed
  }
  return initialState;
}

interface StoreContextValue extends State {
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function resetDemo() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
