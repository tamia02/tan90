import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { LogIn, LogOut, Zap } from 'lucide-react';
import { roleMeta, type Role } from '../lib/auth';
import { useStore } from '../lib/store';
import AuthHero from '../components/AuthHero';
import { Button, Field, Input } from '../components/ui';

export default function RoleLogin() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { auth, dispatch } = useStore();
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const meta = role && role in roleMeta ? roleMeta[role as Role] : undefined;
  if (!meta) return <Navigate to="/" replace />;

  // Already signed in to exactly this module — no need to log in again.
  if (auth?.role === meta.role) {
    return <Navigate to={meta.homePath} replace />;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'LOGIN', payload: { role: meta!.role, name: name.trim() } });
    navigate(meta!.homePath, { replace: true });
  }

  function demoLogin() {
    dispatch({ type: 'LOGIN', payload: { role: meta!.role, name: meta!.demoName } });
    navigate(meta!.homePath, { replace: true });
  }

  return (
    <div className="min-h-svh flex" style={{ background: 'var(--surface-1)' }}>
      <AuthHero />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl grid place-items-center mb-4"
              style={{ background: 'var(--brand-bg)', color: 'var(--brand)' }}
            >
              <meta.icon size={26} />
            </div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {meta.loginTitle}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Sign in to continue to the {meta.moduleName}.
            </p>
          </div>

          {/* Someone else's session is active — reached this URL directly rather
              than through a disabled card on Module Access. Same rule applies:
              logout has to be the deliberate step, not a side effect of this form. */}
          {auth ? (
            <div className="rounded-2xl border p-5 text-center" style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                You're signed in as <strong style={{ color: 'var(--text-primary)' }}>{roleMeta[auth.role].label}</strong>.
                Log out before signing in to {meta.moduleName}.
              </p>
              <Button variant="danger" className="w-full justify-center" onClick={() => dispatch({ type: 'LOGOUT' })}>
                <LogOut size={15} />
                Log out of {roleMeta[auth.role].label}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--brand)', background: 'var(--brand-bg)' }}>
                <Button type="button" className="w-full justify-center" onClick={demoLogin}>
                  <Zap size={16} />
                  Demo login as {meta.demoName}
                </Button>
                <p className="text-xs text-center mt-2.5" style={{ color: 'var(--brand)' }}>
                  One click, no name or ID needed.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  OR SIGN IN MANUALLY
                </span>
                <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
              </div>

              <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}>
                <form onSubmit={submit} className="flex flex-col gap-3.5">
                  <Field label="Full name">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                  </Field>
                  <Field label={meta.idLabel}>
                    <Input value={id} onChange={(e) => setId(e.target.value)} placeholder={meta.idPlaceholder} required />
                  </Field>
                  <Button type="submit" variant="secondary" className="w-full justify-center mt-1">
                    <LogIn size={16} />
                    Log in
                  </Button>
                  <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                    Demo prototype — any name and ID signs you in as {meta.label}.
                  </p>
                </form>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full text-center text-xs font-medium mt-4"
            style={{ color: 'var(--brand)' }}
          >
            ← Back to Module Access
          </button>
        </div>
      </div>
    </div>
  );
}
