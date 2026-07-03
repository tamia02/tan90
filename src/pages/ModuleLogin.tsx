import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import AuthHero from '../components/AuthHero';
import { Button, Field, Input, Select } from '../components/ui';
import { roleMeta, roleOrder, type Role } from '../lib/auth';
import { useStore } from '../lib/store';

const roles = roleOrder.map((r) => roleMeta[r]);

export default function ModuleLogin() {
  const navigate = useNavigate();
  const { auth, dispatch } = useStore();
  const [role, setRole] = useState<Role>('guard');
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  function demoLogin(r: Role) {
    const meta = roleMeta[r];
    dispatch({ type: 'LOGIN', payload: { role: r, name: meta.demoName } });
    navigate(meta.homePath);
  }

  function secureLogin(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'LOGIN', payload: { role, name: name.trim() } });
    navigate(roleMeta[role].homePath);
  }

  const selectedMeta = roleMeta[role];

  return (
    <div className="min-h-svh flex" style={{ background: 'var(--surface-1)' }}>
      <AuthHero />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-11 h-11 rounded-xl grid place-items-center font-bold text-white" style={{ background: 'var(--brand)' }}>
              T90
            </div>
            <div>
              <div className="font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                TAN90 ERP
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                GRN · Store · Ledger
              </div>
            </div>
          </div>

          <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Welcome back!
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Select a module below, or sign in with your details. Only one module can be open at a time.
          </p>

          {auth && (
            <div
              className="flex items-center justify-between gap-3 rounded-[var(--radius)] border px-4 py-3 mb-6"
              style={{ background: 'var(--brand-bg)', borderColor: 'var(--brand)' }}
            >
              <p className="text-sm" style={{ color: 'var(--brand)' }}>
                Signed in as <strong>{roleMeta[auth.role].label}</strong> ({auth.name}).
              </p>
              <Button variant="secondary" onClick={() => dispatch({ type: 'LOGOUT' })}>
                <LogOut size={14} />
                Log out
              </Button>
            </div>
          )}

          <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}>
            <div className="text-xs font-bold tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
              DEMO LOGIN
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {roles.map((meta) => {
                const isMine = auth?.role === meta.role;
                const blocked = Boolean(auth) && !isMine;
                return (
                  <button
                    key={meta.role}
                    type="button"
                    disabled={blocked}
                    onClick={() => demoLogin(meta.role)}
                    className="flex items-center gap-2 rounded-[var(--radius)] border px-3 py-2.5 text-sm font-medium text-left disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--brand-bg)] transition-colors"
                    style={{
                      borderColor: isMine ? 'var(--brand)' : 'var(--border)',
                      color: isMine ? 'var(--brand)' : 'var(--text-primary)',
                      background: isMine ? 'var(--brand-bg)' : 'transparent',
                    }}
                  >
                    <meta.icon size={16} className="shrink-0" />
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              SECURE LOGIN
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>

          <form onSubmit={secureLogin} className="flex flex-col gap-3.5">
            <Field label="Module">
              <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                {roles.map((meta) => (
                  <option key={meta.role} value={meta.role}>
                    {meta.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Full name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </Field>
            <Field label={selectedMeta.idLabel}>
              <Input value={id} onChange={(e) => setId(e.target.value)} placeholder={selectedMeta.idPlaceholder} required />
            </Field>
            <Button type="submit" className="w-full justify-center mt-1">
              <LogIn size={16} />
              Log in
            </Button>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Demo prototype — any name and ID signs you in to the selected module.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
