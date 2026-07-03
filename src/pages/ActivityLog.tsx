import { useStore } from '../lib/store';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { roleMeta, type Role } from '../lib/auth';
import type { AuditEntry } from '../lib/store';

// Keyword match against the shared audit trail's `action` label — keeps
// each role's log scoped to actions that actually belong to their module,
// without needing every dispatch to carry an explicit role tag.
const roleKeywords: Record<Role, string[]> = {
  guard: ['Gate entry', 'Security Guard signed'],
  vendor: ['Vendor submission', 'Vendor User signed'],
  storeExec: ['Unloading', 'Store Executive signed'],
  qc: ['QC Check', 'QC User signed'],
  storeManager: ['GRN Check', 'Issue ', 'Store Manager signed'],
  finance: ['Vendor status', 'Finance User signed'],
  admin: [], // sees everything
};

export default function ActivityLog() {
  const { auth, auditLog } = useStore();
  if (!auth) return null;

  const keywords = roleKeywords[auth.role];
  const entries: AuditEntry[] = keywords.length === 0 ? auditLog : auditLog.filter((e) => keywords.some((k) => e.action.includes(k)));

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Activity Log"
        subtitle={auth.role === 'admin' ? 'Every action across every module, append-only.' : `Actions in the ${roleMeta[auth.role].moduleName}, append-only.`}
      />
      <Card className="p-0 overflow-hidden">
        {entries.length === 0 ? (
          <EmptyState text="Nothing logged yet for this module." />
        ) : (
          <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-4 py-2.5 font-medium sticky top-0" style={{ background: 'var(--surface-3)' }}>Timestamp</th>
                  <th className="px-4 py-2.5 font-medium sticky top-0" style={{ background: 'var(--surface-3)' }}>Action</th>
                  <th className="px-4 py-2.5 font-medium sticky top-0" style={{ background: 'var(--surface-3)' }}>Detail</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-4 py-2 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                      {entry.action}
                    </td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>
                      {entry.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
