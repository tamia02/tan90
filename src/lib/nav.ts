import {
  LayoutGrid,
  Gauge,
  ScanLine,
  ClipboardList,
  Truck,
  Warehouse,
  PackageSearch,
  ClipboardCheck,
  ListChecks,
  Wallet,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from './auth';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  role: Role;
}

// Every screen in the app, tagged with the role that owns it. The nav always
// shows the full catalog (all the icons) — RequireRole is what actually
// enforces "no moving between portals without logging out" when an item
// outside the active role gets clicked, not hiding the item.
export const allNavItems: NavItem[] = [
  { to: '/guard', label: 'Guard Dashboard', icon: Gauge, end: true, role: 'guard' },
  { to: '/guard/scan', label: 'Bill Scan', icon: ScanLine, role: 'guard' },
  { to: '/guard/entries', label: 'Guard Entries', icon: ClipboardList, role: 'guard' },
  { to: '/vendor', label: 'Vendor Portal', icon: Truck, role: 'vendor' },
  { to: '/unloading', label: 'Unloading Desk', icon: Warehouse, role: 'storeExec' },
  { to: '/qc', label: 'QC Check', icon: PackageSearch, role: 'qc' },
  { to: '/grn', label: 'GRN Check', icon: ClipboardCheck, role: 'storeManager' },
  { to: '/validation', label: 'Validation Issues', icon: ListChecks, role: 'storeManager' },
  { to: '/finance', label: 'Finance Module', icon: Wallet, role: 'finance' },
  { to: '/command-center', label: 'Command Center', icon: LayoutGrid, role: 'admin' },
  { to: '/admin', label: 'Admin Module', icon: Settings, role: 'admin' },
];

export function navForRole(role: Role | undefined): NavItem[] {
  return role ? allNavItems.filter((n) => n.role === role) : [];
}
