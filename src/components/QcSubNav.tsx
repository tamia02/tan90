import { NavLink } from 'react-router-dom';
import { Gauge, History, PackageSearch, ShieldAlert, BookOpen } from 'lucide-react';

const tabs = [
  { to: '/qc', label: 'Dashboard', icon: Gauge, end: true },
  { to: '/qc/queue', label: 'QC Queue', icon: PackageSearch, end: false },
  { to: '/qc/history', label: 'History', icon: History, end: false },
  { to: '/qc/holds', label: 'Quality Holds', icon: ShieldAlert, end: false },
  { to: '/qc/ledger', label: 'Stock Ledger', icon: BookOpen, end: false },
];

export default function QcSubNav() {
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
