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
  Bell,
  History,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import { roleOrder, type Role } from './auth';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  role: Role;
}

// Screens each role owns operationally — nothing here is shared across
// roles, per the client: a role's sidebar shows its own module only.
const roleScreens: Record<Role, Omit<NavItem, 'role'>[]> = {
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

// Every role also gets the same four utility screens — each one reads the
// active session and adapts its content to that role, so the sidebar has
// real depth without borrowing another module's screens.
const sharedScreens: Omit<NavItem, 'role'>[] = [
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/activity', label: 'Activity Log', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help & Support', icon: HelpCircle },
];

const allNavItems: NavItem[] = roleOrder.flatMap((role) =>
  [...roleScreens[role], ...sharedScreens].map((item) => ({ ...item, role })),
);

export function navForRole(role: Role | undefined): NavItem[] {
  return role ? allNavItems.filter((n) => n.role === role) : [];
}
