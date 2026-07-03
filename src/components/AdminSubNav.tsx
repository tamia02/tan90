import { NavLink } from 'react-router-dom';
import { Gauge, Link2, Package, TrendingUp, UserCog, Users } from 'lucide-react';

const tabs = [
  { to: '/admin', label: 'Overview', icon: Gauge, end: true },
  { to: '/admin/team', label: 'Team & Roles', icon: UserCog, end: false },
  { to: '/admin/integrations', label: 'Integrations', icon: Link2, end: false },
  { to: '/admin/sku', label: 'SKU Master', icon: Package, end: false },
  { to: '/admin/vendors', label: 'Vendor Master', icon: Users, end: false },
  { to: '/admin/reports', label: 'Reports', icon: TrendingUp, end: false },
];

export default function AdminSubNav() {
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
