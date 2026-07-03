import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ChevronDown, KeyRound, LogOut, Menu, Search, User, Wifi, X } from 'lucide-react';
import { allNavItems, navForRole, type NavItem } from '../lib/nav';
import { resetDemo, useStore } from '../lib/store';
import { roleMeta, roleOrder, type Role } from '../lib/auth';

// Shows every module's icon always. `locked` (true when signed into a
// different role, or admin) dims the row and swaps a lock icon in — clicking
// it still works, it just routes into RequireRole's "log out first" screen
// or that module's own login rather than silently switching anything.
function NavRow({
  to,
  label,
  icon: Icon,
  end,
  onClick,
  locked,
}: Omit<NavItem, 'role'> & { onClick?: () => void; locked?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive ? 'text-white' : ''
        }`
      }
      style={({ isActive }) => ({
        background: isActive ? 'var(--brand)' : 'transparent',
        color: isActive ? '#fff' : locked ? 'var(--text-muted)' : 'var(--text-secondary)',
        opacity: locked && !isActive ? 0.6 : 1,
      })}
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

function ProfileMenu() {
  const { auth, dispatch } = useStore();
  const [open, setOpen] = useState(false);

  if (!auth) {
    return (
      <Link to="/" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: 'var(--brand)' }}>
        Sign in
      </Link>
    );
  }

  const meta = roleMeta[auth.role];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:opacity-80"
      >
        <div className="w-8 h-8 rounded-full grid place-items-center text-white" style={{ background: 'var(--brand)' }}>
          <User size={16} />
        </div>
        <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {meta.label}
        </span>
        <ChevronDown size={15} color="var(--text-muted)" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 mt-2 w-64 rounded-[var(--radius)] border shadow-[var(--shadow-modal)] z-50 p-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}
          >
            <div className="flex items-center gap-2 px-2 py-2" style={{ color: 'var(--text-primary)' }}>
              <meta.icon size={16} color="var(--brand)" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{auth.name}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {meta.label}
                </div>
              </div>
            </div>
            <div className="h-px my-1" style={{ background: 'var(--border)' }} />
            <button
              onClick={() => {
                setOpen(false);
                dispatch({ type: 'LOGOUT' });
              }}
              className="flex items-center gap-2 w-full text-left text-sm px-2 py-2 rounded-lg hover:opacity-80"
              style={{ color: 'var(--status-critical)' }}
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <div className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
      {children}
    </div>
  );
}

function isLocked(itemRole: Role, activeRole: Role | undefined) {
  if (!activeRole) return false; // nobody signed in — nothing to lock against
  if (activeRole === 'admin') return false; // admin reaches everything
  return itemRole !== activeRole;
}

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { auth, dispatch } = useStore();
  const mobileItems = navForRole(auth?.role).slice(0, 4);
  const groups = roleOrder.map((role) => ({ role, meta: roleMeta[role], items: allNavItems.filter((n) => n.role === role) }));

  return (
    <div className="min-h-svh flex" style={{ background: 'var(--surface-2)' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:w-64 md:flex-col shrink-0 border-r p-4 gap-0.5 overflow-y-auto"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}
      >
        <Link to="/" className="flex items-center gap-2 px-2 pb-4">
          <div
            className="w-9 h-9 rounded-lg grid place-items-center font-bold text-white text-sm"
            style={{ background: 'var(--brand)' }}
          >
            T90
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Tan90 ERP
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              GRN · Store · Ledger
            </div>
          </div>
        </Link>

        {groups.map((group) => (
          <div key={group.role}>
            <GroupLabel>{group.meta.label}</GroupLabel>
            {group.items.map((item) => (
              <NavRow key={item.to} {...item} locked={isLocked(item.role, auth?.role)} />
            ))}
          </div>
        ))}

        <div className="mt-auto pt-4 flex flex-col gap-1">
          {auth && (
            <button
              onClick={() => dispatch({ type: 'LOGOUT' })}
              className="flex items-center gap-2 text-xs w-full text-left px-3 py-2 rounded-lg hover:opacity-80"
              style={{ color: 'var(--status-critical)' }}
            >
              <LogOut size={13} />
              Log out of {roleMeta[auth.role].label}
            </button>
          )}
          <button
            onClick={resetDemo}
            className="text-xs w-full text-left px-3 py-2 rounded-lg hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            Reset demo data
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <nav
            aria-label="Mobile menu"
            className="absolute left-0 top-0 bottom-0 w-72 p-4 flex flex-col gap-0.5 overflow-y-auto"
            style={{ background: 'var(--surface-3)' }}
          >
            <div className="flex items-center justify-between pb-4">
              <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Tan90 ERP
              </div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <NavRow to="/" label="Module Access" icon={KeyRound} onClick={() => setDrawerOpen(false)} end />
            {groups.map((group) => (
              <div key={group.role}>
                <GroupLabel>{group.meta.label}</GroupLabel>
                {group.items.map((item) => (
                  <NavRow key={item.to} {...item} locked={isLocked(item.role, auth?.role)} onClick={() => setDrawerOpen(false)} />
                ))}
              </div>
            ))}
            <div className="mt-auto pt-4 flex flex-col gap-1">
              {auth && (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    dispatch({ type: 'LOGOUT' });
                  }}
                  className="flex items-center gap-2 text-xs w-full text-left px-3 py-2 rounded-lg hover:opacity-80"
                  style={{ color: 'var(--status-critical)' }}
                >
                  <LogOut size={13} />
                  Log out of {roleMeta[auth.role].label}
                </button>
              )}
              <button
                onClick={resetDemo}
                className="text-xs w-full text-left px-3 py-2 rounded-lg hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
              >
                Reset demo data
              </button>
            </div>
          </nav>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center gap-3 border-b px-4 py-3 sticky top-0 z-30"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}
        >
          <button className="md:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md rounded-[var(--radius)] border px-3 py-1.5" style={{ borderColor: 'var(--border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              placeholder="Search GRN, bill, SKU, vendor"
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--status-good)' }}>
              <Wifi size={15} />
              Online
            </div>
            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>

        {/* Mobile bottom tabs */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 border-t flex z-30"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}
        >
          {mobileItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium"
              style={({ isActive }) => ({ color: isActive ? 'var(--brand)' : 'var(--text-muted)' })}
            >
              <item.icon size={19} />
              {item.label.split(' ')[0]}
            </NavLink>
          ))}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            <Menu size={19} />
            More
          </button>
        </nav>
      </div>
    </div>
  );
}
