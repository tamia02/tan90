import { NavLink } from 'react-router-dom';
import { BookOpen, ClipboardCheck, Gauge, LayoutList, PackageSearch, Warehouse } from 'lucide-react';

const tabs = [
  { to: '/grn', label: 'Dashboard', icon: Gauge, end: true },
  { to: '/grn/check', label: 'GRN Check', icon: ClipboardCheck, end: false },
  { to: '/grn/register', label: 'GRN Register', icon: LayoutList, end: false },
  { to: '/grn/stock-balance', label: 'Stock Balance', icon: PackageSearch, end: false },
  { to: '/grn/ledger', label: 'Stock Ledger', icon: BookOpen, end: false },
  { to: '/grn/bins', label: 'Shelf & Bin', icon: Warehouse, end: false },
];

export default function StoreManagerSubNav() {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius)] text-sm font-medium whitespace-nowrap border transition-colors"
          style={({ isActive }) => ({
            borderColor: isActive ? 'var(--brand)' : 'var(--border)',
            background: isActive ? 'var(--brand-bg)' : 'var(--surface-3)',
            color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
          })}
        >
          <t.icon size={15} />
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}
