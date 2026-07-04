import {
  ShieldCheck,
  Truck,
  Warehouse,
  PackageSearch,
  ClipboardCheck,
  Wallet,
  Settings,
  type LucideIcon,
} from 'lucide-react';

// Seven roles, kept fully separate per the client — nothing here merges.
// Guard, Vendor, Store Executive, QC, Store Manager, Finance, Admin each get
// their own login and their own screens; Admin is the only one that can see
// everything else.
export type Role = 'guard' | 'vendor' | 'storeExec' | 'qc' | 'storeManager' | 'finance' | 'admin';

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
    demoName: 'Hindustan Chemical Corporation',
    demoId: 'GSTIN-HCC01',
  },
  storeExec: {
    role: 'storeExec',
    label: 'Store Executive',
    moduleName: 'Unloading Desk Module',
    features: ['Unloading queue', 'Box count', 'POD/LR capture', 'Seal / load proof'],
    loginTitle: 'Store Executive Login',
    idLabel: 'Employee ID',
    idPlaceholder: 'EMP-1108',
    icon: Warehouse,
    homePath: '/unloading',
    demoName: 'Vikram Rao',
    demoId: 'EMP-1108',
  },
  qc: {
    role: 'qc',
    label: 'QC User',
    moduleName: 'QC Check Module',
    features: ['QC queue', 'Accept / hold / defective / reject split', 'Reason codes', 'Send to GRN Check'],
    loginTitle: 'QC User Login',
    idLabel: 'Employee ID',
    idPlaceholder: 'EMP-3105',
    icon: PackageSearch,
    homePath: '/qc',
    demoName: 'Arjun Mehta',
    demoId: 'EMP-3105',
  },
  storeManager: {
    role: 'storeManager',
    label: 'Store Manager',
    moduleName: 'GRN Check & Stock Module',
    features: ['GRN Check / posting', 'Put-away', 'Immutable ledger', 'Validation issue oversight'],
    loginTitle: 'Store Manager Login',
    idLabel: 'Employee ID',
    idPlaceholder: 'EMP-2201',
    icon: ClipboardCheck,
    homePath: '/grn',
    demoName: 'Priya Deshmukh',
    demoId: 'EMP-2201',
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

export const roleOrder: Role[] = ['guard', 'vendor', 'storeExec', 'qc', 'storeManager', 'finance', 'admin'];

// Admin is the only role that can see into another module. Every other role
// is walled off — no shared access, no exceptions. Combined with a
// single-active-session store (see store.tsx), this is what makes "you can't
// move from one portal to another without logging out" actually true.
export function roleCanAccess(session: { role: Role } | null, required: Role): boolean {
  if (!session) return false;
  if (session.role === 'admin') return true;
  return session.role === required;
}
