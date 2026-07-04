import {
  Gauge,
  ScanLine,
  ClipboardList,
  Clock,
  FilePlus2,
  Search,
  AlertTriangle,
  Warehouse,
  History,
  MapPinned,
  Boxes,
  PackageSearch,
  ShieldAlert,
  BookOpen,
  ClipboardCheck,
  LayoutList,
  ListChecks,
  FileText,
  Receipt,
  TrendingUp,
  LayoutGrid,
  UserCog,
  Link2,
  Package,
  Users,
  Settings,
  Bell,
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
    { to: '/guard/sla', label: 'SLA Tracker', icon: Clock },
  ],
  vendor: [
    { to: '/vendor', label: 'Vendor Dashboard', icon: Gauge, end: true },
    { to: '/vendor/new', label: 'New Submission', icon: FilePlus2 },
    { to: '/vendor/submissions', label: 'My Submissions', icon: Search },
    { to: '/vendor/issues', label: 'Issues', icon: AlertTriangle },
    { to: '/vendor/stock', label: 'Stock Update', icon: Boxes },
  ],
  storeExec: [
    { to: '/unloading', label: 'Dashboard', icon: Gauge, end: true },
    { to: '/unloading/desk', label: 'Unloading Desk', icon: Warehouse },
    { to: '/unloading/history', label: 'History', icon: History },
    { to: '/unloading/staging', label: 'Staging Areas', icon: MapPinned },
  ],
  qc: [
    { to: '/qc', label: 'Dashboard', icon: Gauge, end: true },
    { to: '/qc/queue', label: 'QC Queue', icon: PackageSearch },
    { to: '/qc/history', label: 'History', icon: History },
    { to: '/qc/holds', label: 'Quality Holds', icon: ShieldAlert },
    { to: '/qc/ledger', label: 'Stock Ledger', icon: BookOpen },
  ],
  storeManager: [
    { to: '/grn', label: 'Dashboard', icon: Gauge, end: true },
    { to: '/grn/check', label: 'GRN Check', icon: ClipboardCheck },
    { to: '/grn/register', label: 'GRN Register', icon: LayoutList },
    { to: '/grn/stock-balance', label: 'Stock Balance', icon: PackageSearch },
    { to: '/grn/ledger', label: 'Stock Ledger', icon: BookOpen },
    { to: '/grn/bins', label: 'Shelf & Bin', icon: Warehouse },
    { to: '/validation', label: 'Validation Issues', icon: ListChecks },
  ],
  finance: [
    { to: '/finance', label: 'Dashboard', icon: Gauge, end: true },
    { to: '/finance/review', label: 'Finance Review', icon: FileText },
    { to: '/finance/claims', label: 'Vendor Claims', icon: Receipt },
    { to: '/finance/reports', label: 'Reports', icon: TrendingUp },
  ],
  admin: [
    { to: '/command-center', label: 'Command Center', icon: LayoutGrid },
    { to: '/admin', label: 'Overview', icon: Gauge },
    { to: '/admin/team', label: 'Team & Roles', icon: UserCog },
    { to: '/admin/integrations', label: 'Integrations', icon: Link2 },
    { to: '/admin/sku', label: 'SKU Master', icon: Package },
    { to: '/admin/vendors', label: 'Vendor Master', icon: Users },
    { to: '/admin/reports', label: 'Reports', icon: TrendingUp },
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

export const allNavItems: NavItem[] = roleOrder.flatMap((role) =>
  [...roleScreens[role], ...sharedScreens].map((item) => ({ ...item, role })),
);

export function navForRole(role: Role | undefined): NavItem[] {
  return role ? allNavItems.filter((n) => n.role === role) : [];
}
