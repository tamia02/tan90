import { NavLink } from 'react-router-dom';
import { ClipboardList, Gauge, ScanLine } from 'lucide-react';

const tabs = [
  { to: '/guard', label: 'Guard Dashboard', icon: Gauge, end: true },
  { to: '/guard/scan', label: 'Bill Scan', icon: ScanLine, end: false },
  { to: '/guard/entries', label: 'Guard Entries', icon: ClipboardList, end: false },
];

export default function GuardSubNav() {
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
