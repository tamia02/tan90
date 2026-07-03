import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2 } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { roleCanAccess, roleMeta, type Role } from '../lib/auth';
import { useStore } from '../lib/store';

const roles = Object.values(roleMeta);

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
          Select a role and sign in.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <StatPill label="Roles" value="6" hint="Separate entry points" />
        <StatPill label="Flow" value="Live" hint="GRN to ledger" />
        <StatPill label="Mode" value="Client Ready" hint="Production labels" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((meta) => {
          const signedIn = roleCanAccess(auth, meta.role) && Boolean(auth[meta.role]);
          const sessionName = auth[meta.role]?.name;
          return (
            <Card key={meta.role} className="p-4 flex flex-col">
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
                {signedIn && <CheckCircle2 size={16} color="var(--status-good)" className="ml-auto shrink-0" />}
              </div>

              <ul className="flex flex-col gap-1.5 mb-4 flex-1">
                {meta.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={12} color="var(--brand)" className="shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {signedIn && (
                <p className="text-xs mb-2" style={{ color: 'var(--status-good)' }}>
                  Signed in as {sessionName}
                </p>
              )}

              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => demoLogin(meta.role)}>
                  Demo Login
                </Button>
                <Button className="flex-1" onClick={() => navigate(signedIn ? meta.homePath : `/login/${meta.role}`)}>
                  {signedIn ? 'Continue' : 'Secure Login'}
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
