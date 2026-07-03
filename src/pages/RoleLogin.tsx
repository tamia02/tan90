import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { roleMeta, type Role } from '../lib/auth';
import { useStore } from '../lib/store';
import { Button, Card, Field, Input, PageHeader } from '../components/ui';

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

  // Someone else's session is active — reached this URL directly rather
  // than through the disabled card on Module Access. Same rule applies:
  // logout has to be the deliberate step, not a side effect of this form.
  if (auth) {
    const current = roleMeta[auth.role];
    return (
      <div className="max-w-sm mx-auto mt-10">
        <Card className="p-6 text-center">
          <PageHeader
            title={`Signed in as ${current.label}`}
            subtitle={`Log out before signing in to ${meta.moduleName}.`}
          />
          <Button variant="danger" className="w-full justify-center" onClick={() => dispatch({ type: 'LOGOUT' })}>
            <LogOut size={15} />
            Log out of {current.label}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-6 sm:mt-16">
      <div className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-2xl grid place-items-center mx-auto mb-4"
          style={{ background: 'var(--brand-bg)', color: 'var(--brand)' }}
        >
          <meta.icon size={26} />
        </div>
        <PageHeader title={meta.loginTitle} subtitle={`Sign in to continue to the ${meta.moduleName}.`} />
      </div>

      <Card className="p-5">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required autoFocus />
          </Field>
          <Field label={meta.idLabel}>
            <Input value={id} onChange={(e) => setId(e.target.value)} placeholder={meta.idPlaceholder} required />
          </Field>
          <Button type="submit" className="w-full mt-1">
            Sign in
          </Button>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            Demo prototype — any name and ID signs you in as {meta.label}.
          </p>
        </form>
      </Card>
    </div>
  );
}
