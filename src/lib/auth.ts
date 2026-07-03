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
  moduleName: string;
  features: string[];
  loginTitle: string;
  idLabel: string;
  idPlaceholder: string;
  icon: LucideIcon;
  homePath: string;
  demoName: string;
  demoId: string;
}

export const roleMeta: Record<Role, RoleMeta> = {
  guard: {
    role: 'guard',
    label: 'Security Guard',
    moduleName: 'Guard Gate Module',
    features: ['Camera bill scan', 'Vehicle entry', 'Document checks', 'Unloading handoff'],
    loginTitle: 'Security Guard Login',
    idLabel: 'Guard ID',
    idPlaceholder: 'GRD-014',
    icon: ShieldCheck,
    homePath: '/guard',
    demoName: 'Ramesh Singh',
    demoId: 'GRD-014',
  },
  vendor: {
    role: 'vendor',
    label: 'Vendor User',
    moduleName: 'Vendor Submission Module',
    features: ['PO document upload', 'Invoice correction', 'Issue tracking', 'GST readiness'],
    loginTitle: 'Vendor Login',
    idLabel: 'Vendor / GST ID',
    idPlaceholder: 'GSTIN or vendor code',
    icon: Truck,
    homePath: '/vendor',
    demoName: 'Hindustan Chemical Corp',
    demoId: 'GSTIN-HCC01',
  },
  store: {
    role: 'store',
    label: 'Store Manager',
    moduleName: 'Store Manager Module',
    features: ['Unloading desk', 'GRN register', 'Stock posting', 'Bin readiness'],
    loginTitle: 'Store Manager Login',
    idLabel: 'Employee ID',
    idPlaceholder: 'EMP-2201',
    icon: Warehouse,
    homePath: '/store',
    demoName: 'Priya Deshmukh',
    demoId: 'EMP-2201',
  },
  qc: {
    role: 'qc',
    label: 'QC User',
    moduleName: 'QC Inspection Module',
    features: ['QC queue', 'Hold split', 'Defect reason', 'Inspection posting'],
    loginTitle: 'QC User Login',
    idLabel: 'Employee ID',
    idPlaceholder: 'EMP-3105',
    icon: Store,
    homePath: '/qc',
    demoName: 'Arjun Mehta',
    demoId: 'EMP-3105',
  },
  finance: {
    role: 'finance',
    label: 'Finance User',
    moduleName: 'Finance Review Module',
    features: ['Payable review', 'Deduction tracking', 'Hold reason', 'Approval status'],
    loginTitle: 'Finance Login',
    idLabel: 'Employee ID',
    idPlaceholder: 'EMP-4402',
    icon: Wallet,
    homePath: '/finance',
    demoName: 'Farhan Ali',
    demoId: 'EMP-4402',
  },
  admin: {
    role: 'admin',
    label: 'Administrator',
    moduleName: 'Admin Control Module',
    features: ['Module settings', 'Roles', 'Reports', 'Master data'],
    loginTitle: 'Admin / Auditor Login',
    idLabel: 'Admin ID',
    idPlaceholder: 'ADM-001',
    icon: Settings,
    homePath: '/admin',
    demoName: 'Priya Admin',
    demoId: 'ADM-001',
  },
};

// Which pages a role may open in addition to its own — admin sees everything,
// store also owns validation triage (matches the doc's role table).
export function roleCanAccess(sessions: Partial<Record<Role, unknown>>, required: Role): boolean {
  if (sessions.admin) return true;
  if (required === 'store' && sessions.store) return true;
  return Boolean(sessions[required]);
}
