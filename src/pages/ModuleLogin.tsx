import { useNavigate } from 'react-router-dom';
import { navItems } from '../lib/nav';
import { Card } from '../components/ui';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { roleCanAccess, roleMeta, type Role } from '../lib/auth';
import { useStore } from '../lib/store';

const roleForPath: Record<string, Role | undefined> = {
  '/command-center': undefined,
  '/guard': 'guard',
  '/vendor': 'vendor',
  '/validation': 'store',
  '/store': 'store',
  '/qc': 'qc',
  '/finance': 'finance',
  '/admin': 'admin',
};

export default function ModuleLogin() {
  const navigate = useNavigate();
  const { auth } = useStore();
  const modules = navItems.filter((n) => n.to !== '/');

  function open(to: string) {
    const role = roleForPath[to];
    if (!role) {
      navigate(to);
      return;
    }
    if (roleCanAccess(auth, role)) navigate(to);
    else navigate(`/login/${role}`);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 mt-4">
        <div
          className="w-14 h-14 rounded-2xl grid place-items-center font-bold text-white text-lg mx-auto mb-4"
          style={{ background: 'var(--brand)' }}
        >
          T90
        </div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Tan90 Inward-to-GRN Control Tower
        </h1>
        <p className="text-sm mt-1.5 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Not just bill-upload software. Vendor/Guard capture → validation → unloading → GRN/QC → stock ledger →
          finance closure. Pick a module to sign in.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {modules.map((m) => {
          const role = roleForPath[m.to];
          const signedIn = role ? roleCanAccess(auth, role) : false;
          const sessionName = role && auth[role]?.name;
          return (
            <Card key={m.to} className="p-0 overflow-hidden">
              <button
                onClick={() => open(m.to)}
                className="w-full flex items-center gap-4 p-4 text-left hover:opacity-90 transition-opacity"
              >
                <div
                  className="w-11 h-11 rounded-xl grid place-items-center shrink-0"
                  style={{ background: 'var(--brand-bg)', color: 'var(--brand)' }}
                >
                  <m.icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    {m.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {role ? (sessionName ? `Signed in as ${sessionName}` : roleMeta[role].label) : 'All roles · overview'}
                  </div>
                </div>
                {signedIn ? (
                  <CheckCircle2 size={18} color="var(--status-good)" />
                ) : (
                  <ArrowRight size={18} color="var(--text-muted)" />
                )}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
