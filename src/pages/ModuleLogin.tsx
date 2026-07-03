import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, LogOut } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { roleMeta, roleOrder, type Role } from '../lib/auth';
import { useStore } from '../lib/store';

const roles = roleOrder.map((r) => roleMeta[r]);

export default function ModuleLogin() {
  const navigate = useNavigate();
  const { auth, dispatch } = useStore();

  function demoLogin(role: Role) {
    const meta = roleMeta[role];
    dispatch({ type: 'LOGIN', payload: { role, name: meta.demoName } });
    navigate(meta.homePath);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6 mt-4">
        <div
          className="w-14 h-14 rounded-2xl grid place-items-center font-bold text-white text-lg mx-auto mb-4"
          style={{ background: 'var(--brand)' }}
        >
          T90
        </div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Module Access
        </h1>
        <p className="text-sm mt-1.5 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Select a role and sign in. Only one module can be open at a time.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <StatPill label="Roles" value="7" hint="Separate entry points" />
        <StatPill label="Flow" value="Live" hint="GRN to ledger" />
        <StatPill label="Mode" value="Client Ready" hint="Production labels" />
      </div>

      {auth && (
        <div
          className="flex items-center justify-between gap-3 rounded-[var(--radius)] border px-4 py-3 mb-6"
          style={{ background: 'var(--brand-bg)', borderColor: 'var(--brand)' }}
        >
          <p className="text-sm" style={{ color: 'var(--brand)' }}>
            Signed in as <strong>{roleMeta[auth.role].label}</strong> ({auth.name}). Log out to switch modules.
          </p>
          <Button variant="secondary" onClick={() => dispatch({ type: 'LOGOUT' })}>
            <LogOut size={14} />
            Log out
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((meta) => {
          const isMine = auth?.role === meta.role;
          const blocked = Boolean(auth) && !isMine;
          return (
            <Card key={meta.role} className="p-4 flex flex-col" style={blocked ? { opacity: 0.55 } : undefined}>
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-[var(--radius)] grid place-items-center shrink-0"
                  style={{ background: 'var(--brand-bg)', color: 'var(--brand)' }}
                >
                  <meta.icon size={19} />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    {meta.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {meta.moduleName}
                  </div>
                </div>
                {isMine && <CheckCircle2 size={16} color="var(--status-good)" className="ml-auto shrink-0" />}
              </div>

              <ul className="flex flex-col gap-1.5 mb-4 flex-1">
                {meta.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={12} color="var(--brand)" className="shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {isMine && (
                <p className="text-xs mb-2" style={{ color: 'var(--status-good)' }}>
                  Signed in as {auth!.name}
                </p>
              )}
              {blocked && (
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  Log out of {roleMeta[auth!.role].label} to open this.
                </p>
              )}

              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" disabled={blocked} onClick={() => demoLogin(meta.role)}>
                  Demo Login
                </Button>
                <Button
                  className="flex-1"
                  disabled={blocked}
                  onClick={() => navigate(isMine ? meta.homePath : `/login/${meta.role}`)}
                >
                  {isMine ? 'Continue' : 'Secure Login'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StatPill({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div
      className="rounded-[var(--radius)] border px-4 py-2 text-center"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}
    >
      <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        {hint}
      </div>
    </div>
  );
}
