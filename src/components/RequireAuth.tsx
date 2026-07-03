import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../lib/store';

// For the shared utility screens (Notifications, Settings, Activity Log,
// Help) — any signed-in role may open them, since each adapts its content
// to whoever is signed in rather than being owned by one specific role.
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { auth } = useStore();
  if (!auth) return <Navigate to="/" replace />;
  return <>{children}</>;
}
