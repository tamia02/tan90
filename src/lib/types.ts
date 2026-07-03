export type EntryType = 'inward' | 'outward' | 'visitor' | 'loading';

export type IssueSeverity = 'hardFail' | 'redFlag' | 'warning';
export type IssueStatus = 'open' | 'approved' | 'resolved' | 'escalated';

export type GateEntryStatus =
  | 'pending_validation'
  | 'validated'
  | 'unloading'
  | 'grn'
  | 'posted'
  | 'closed';

export interface VendorSubmission {
  id: string;
  poNumber: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceQty: number;
  material: string;
  hasInvoice: boolean;
  hasEwayBill: boolean;
  hasLrPod: boolean;
  status: 'submitted' | 'correction_requested' | 'acknowledged';
  submittedAt: string;
  note?: string;
}

export interface GateEntry {
  id: string;
  gateNo: string;
  entryType: EntryType;
  poNumber?: string;
  vendorName?: string;
  vendorGst?: string;
  invoiceNumber?: string;
  invoiceQty?: number;
  rate?: number;
  material?: string;
  vehicleNumber: string;
  driverName: string;
  transporter?: string;
  location: string;
  gps?: string;
  billScanned: boolean;
  remarks?: string;
  status: GateEntryStatus;
  createdAt: string;
  slaDeadline: string;
}

export interface ValidationIssue {
  id: string;
  gateEntryId: string;
  code: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  owner?: string;
  note?: string;
  raisedAt: string;
}

export interface UnloadingRecord {
  gateEntryId: string;
  boxCount: number;
  stagingArea: string;
  unloadedBy: string;
  podLrRef: string;
  startedAt: string;
  completedAt?: string;
}

export interface QcSplit {
  accepted: number;
  qcHold: number;
  defective: number;
  rejected: number;
}

export interface GrnRecord {
  gateEntryId: string;
  sku: string;
  poQty: number;
  invoiceQty: number;
  physicalReceived: number;
  split: QcSplit;
  missing: number;
  qcReasons?: string;
  suggestedBin: string;
  posted: boolean;
  createdAt: string;
}

export type LedgerBucket = 'available' | 'defective' | 'rejected' | 'qcHold';

export interface LedgerEntry {
  id: string;
  timestamp: string;
  gateEntryId: string;
  sku: string;
  bin: string;
  bucket: LedgerBucket;
  qty: number;
}

export type VendorClosureStatus = 'pending' | 'cleared' | 'hold';

export interface FinanceRecord {
  gateEntryId: string;
  vendorName: string;
  invoiceNumber: string;
  ratePerUnit: number;
  invoiceValue: number;
  acceptedValue: number;
  deductions: {
    defective: number;
    rejected: number;
    missing: number;
  };
  finalPayable: number;
  vendorStatus: VendorClosureStatus;
  notes?: string;
  createdAt: string;
}

export interface StockException {
  id: string;
  gateEntryId: string;
  sku: string;
  bin: string;
  type: 'missing' | 'defective' | 'rejected' | 'adjustment';
  qty: number;
  status: 'open' | 'closed';
}
