import {
  LayoutGrid,
  Gauge,
  ScanLine,
  ClipboardList,
  Truck,
  Store,
  ClipboardCheck,
  Warehouse,
  Wallet,
  Settings,
  KeyRound,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Module Login', icon: KeyRound, end: true },
  { to: '/command-center', label: 'Command Center', icon: LayoutGrid },
  { to: '/guard', label: 'Guard Dashboard', icon: Gauge, end: true },
  { to: '/guard/scan', label: 'Bill Scan', icon: ScanLine },
  { to: '/guard/entries', label: 'Guard Entries', icon: ClipboardList },
  { to: '/vendor', label: 'Vendor Portal', icon: Truck },
  { to: '/validation', label: 'Validation Issues', icon: ClipboardCheck },
  { to: '/store', label: 'Store Manager', icon: Warehouse },
  { to: '/qc', label: 'QC Module', icon: Store },
  { to: '/finance', label: 'Finance Module', icon: Wallet },
  { to: '/admin', label: 'Admin Module', icon: Settings },
];

// Sidebar, grouped into labeled sections (mirrors the client's reference admin template).
export const navGroups: { label: string; items: NavItem[] }[] = [
  { label: 'Control Tower', items: navItems.filter((n) => n.to === '/command-center') },
  { label: 'Gate & Vendor', items: navItems.filter((n) => ['/guard', '/guard/scan', '/guard/entries', '/vendor'].includes(n.to)) },
  { label: 'Validation & Stock', items: navItems.filter((n) => ['/validation', '/store', '/qc'].includes(n.to)) },
  { label: 'Finance', items: navItems.filter((n) => n.to === '/finance') },
  { label: 'Admin', items: navItems.filter((n) => n.to === '/admin') },
];

// Subset shown on the mobile bottom tab bar; the rest live in the "More" sheet.
export const mobilePrimaryNav = ['/command-center', '/guard', '/validation', '/store'] as const;
