import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock, LogOut } from 'lucide-react';
import { roleCanAccess, roleMeta, type Role } from '../lib/auth';
import { useStore } from '../lib/store';
import { Button, Card, PageHeader } from './ui';

export default function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { auth, dispatch } = useStore();

  // Nobody signed in at all — send them to this module's own login.
  if (!auth) {
    return <Navigate to={`/login/${role}`} replace />;
  }

  if (roleCanAccess(auth, role)) {
    return <>{children}</>;
  }

  // Someone IS signed in, just not to this module — per the client, that
  // must not silently swap them into another portal. They have to log out
  // first, on purpose.
  const current = roleMeta[auth.role];
  const wanted = roleMeta[role];
  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="p-6 text-center">
        <div
          className="w-12 h-12 rounded-full grid place-items-center mx-auto mb-4"
          style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}
        >
          <Lock size={22} />
        </div>
        <PageHeader
          title={`Signed in as ${current.label}`}
          subtitle={`You need to log out before you can open the ${wanted.moduleName}. Only one portal can be open at a time.`}
        />
        <Button
          variant="danger"
          className="w-full justify-center"
          onClick={() => {
            dispatch({ type: 'LOGOUT' });
          }}
        >
          <LogOut size={15} />
          Log out of {current.label}
        </Button>
      </Card>
    </div>
  );
}
