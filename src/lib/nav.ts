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
}

// Each role sees only its own screens — this is the sidebar half of "no
// moving between portals without logging out." (Admin is the one
// deliberate exception, per the client's role table.)
const navByRole: Record<Role, NavItem[]> = {
  guard: [
    { to: '/guard', label: 'Guard Dashboard', icon: Gauge, end: true },
    { to: '/guard/scan', label: 'Bill Scan', icon: ScanLine },
    { to: '/guard/entries', label: 'Guard Entries', icon: ClipboardList },
  ],
  vendor: [{ to: '/vendor', label: 'Vendor Portal', icon: Truck }],
  storeExec: [{ to: '/unloading', label: 'Unloading Desk', icon: Warehouse }],
  qc: [{ to: '/qc', label: 'QC Check', icon: PackageSearch }],
  storeManager: [
    { to: '/grn', label: 'GRN Check', icon: ClipboardCheck },
    { to: '/validation', label: 'Validation Issues', icon: ListChecks },
  ],
  finance: [{ to: '/finance', label: 'Finance Module', icon: Wallet }],
  admin: [
    { to: '/command-center', label: 'Command Center', icon: LayoutGrid },
    { to: '/admin', label: 'Admin Module', icon: Settings },
  ],
};

export function navForRole(role: Role | undefined): NavItem[] {
  return role ? navByRole[role] : [];
}
