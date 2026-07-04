import { NavLink } from 'react-router-dom';
import { AlertTriangle, Boxes, FilePlus2, Gauge, Search } from 'lucide-react';

const tabs = [
  { to: '/vendor', label: 'Dashboard', icon: Gauge, end: true },
  { to: '/vendor/new', label: 'New Submission', icon: FilePlus2, end: false },
  { to: '/vendor/submissions', label: 'My Submissions', icon: Search, end: false },
  { to: '/vendor/issues', label: 'Issues', icon: AlertTriangle, end: false },
  { to: '/vendor/stock', label: 'Stock Update', icon: Boxes, end: false },
];

export default function VendorSubNav() {
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
