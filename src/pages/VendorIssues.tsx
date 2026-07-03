import { useStore } from '../lib/store';
import VendorSubNav from '../components/VendorSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { SeverityBadge, IssueStatusBadge } from '../components/Badge';

export default function VendorIssues() {
  const { issues, gateEntries } = useStore();

  const rows = issues
    .map((issue) => ({ issue, gate: gateEntries.find((g) => g.id === issue.gateEntryId) }))
    .sort((a, b) => new Date(b.issue.raisedAt).getTime() - new Date(a.issue.raisedAt).getTime());

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Issues" subtitle="Validation issues raised against your deliveries — view only, resolved by the store team." />
      <VendorSubNav />

      <div className="flex flex-col gap-3">
        {rows.length === 0 && <EmptyState text="No issues raised against your deliveries." />}
        {rows.map(({ issue, gate }) => (
          <Card key={issue.id} className="p-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <SeverityBadge severity={issue.severity} />
              <IssueStatusBadge status={issue.status} />
            </div>
            <h3 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
              {issue.title}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {issue.description}
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              {gate?.poNumber ? `${gate.poNumber} · ` : ''}
              {gate?.vendorName ?? 'Unknown vendor'} · Raised {new Date(issue.raisedAt).toLocaleString()}
            </p>
            {issue.note && (
              <p className="text-xs mt-2 rounded-[var(--radius)] px-2.5 py-1.5" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                Store note: {issue.note}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
