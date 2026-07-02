import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { roleCanAccess, type Role } from '../lib/auth';
import { useStore } from '../lib/store';

export default function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { auth } = useStore();
  if (!roleCanAccess(auth, role)) {
    return <Navigate to={`/login/${role}`} replace />;
  }
  return <>{children}</>;
}
