import {
  ShieldCheck,
  Truck,
  Warehouse,
  Store,
  Wallet,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type Role = 'guard' | 'vendor' | 'store' | 'qc' | 'finance' | 'admin';

export interface RoleMeta {
  role: Role;
  label: string;
  loginTitle: string;
  idLabel: string;
  idPlaceholder: string;
  icon: LucideIcon;
  homePath: string;
}

export const roleMeta: Record<Role, RoleMeta> = {
  guard: {
    role: 'guard',
    label: 'Guard',
    loginTitle: 'Security Guard Login',
    idLabel: 'Guard ID',
    idPlaceholder: 'GRD-014',
    icon: ShieldCheck,
    homePath: '/guard',
  },
  vendor: {
    role: 'vendor',
    label: 'Vendor',
    loginTitle: 'Vendor Login',
    idLabel: 'Vendor / GST ID',
    idPlaceholder: 'GSTIN or vendor code',
    icon: Truck,
    homePath: '/vendor',
  },
  store: {
    role: 'store',
    label: 'Store Manager',
    loginTitle: 'Store Manager Login',
    idLabel: 'Employee ID',
    idPlaceholder: 'EMP-2201',
    icon: Warehouse,
    homePath: '/store',
  },
  qc: {
    role: 'qc',
    label: 'QC User',
    loginTitle: 'QC User Login',
    idLabel: 'Employee ID',
    idPlaceholder: 'EMP-3105',
    icon: Store,
    homePath: '/qc',
  },
  finance: {
    role: 'finance',
    label: 'Finance',
    loginTitle: 'Finance Login',
    idLabel: 'Employee ID',
    idPlaceholder: 'EMP-4402',
    icon: Wallet,
    homePath: '/finance',
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    loginTitle: 'Admin / Auditor Login',
    idLabel: 'Admin ID',
    idPlaceholder: 'ADM-001',
    icon: Settings,
    homePath: '/admin',
  },
};

// Which pages a role may open in addition to its own — admin sees everything,
// store also owns validation triage (matches the doc's role table).
export function roleCanAccess(sessions: Partial<Record<Role, unknown>>, required: Role): boolean {
  if (sessions.admin) return true;
  if (required === 'store' && sessions.store) return true;
  return Boolean(sessions[required]);
}
