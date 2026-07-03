import { NavLink } from 'react-router-dom';
import { FileText, Gauge, Receipt, TrendingUp } from 'lucide-react';

const tabs = [
  { to: '/finance', label: 'Dashboard', icon: Gauge, end: true },
  { to: '/finance/review', label: 'Finance Review', icon: FileText, end: false },
  { to: '/finance/claims', label: 'Vendor Claims', icon: Receipt, end: false },
  { to: '/finance/reports', label: 'Reports', icon: TrendingUp, end: false },
];

export default function FinanceSubNav() {
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
