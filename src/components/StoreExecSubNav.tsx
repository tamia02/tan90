import { NavLink } from 'react-router-dom';
import { Gauge, History, MapPinned, Warehouse } from 'lucide-react';

const tabs = [
  { to: '/unloading', label: 'Dashboard', icon: Gauge, end: true },
  { to: '/unloading/desk', label: 'Unloading Desk', icon: Warehouse, end: false },
  { to: '/unloading/history', label: 'History', icon: History, end: false },
  { to: '/unloading/staging', label: 'Staging Areas', icon: MapPinned, end: false },
];

export default function StoreExecSubNav() {
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
