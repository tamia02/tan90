import { useNavigate } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { useStore } from '../lib/store';
import QcSubNav from '../components/QcSubNav';
import { StatTile } from '../components/StatTile';
import { Button, Card, EmptyState, PageHeader } from '../components/ui';

export default function QcDashboard() {
  const { gateEntries, qcResults } = useStore();
  const navigate = useNavigate();

  const pending = gateEntries.filter((g) => g.status === 'grn').length;
  const totalChecked = qcResults.length;
  const totalDefective = qcResults.reduce((sum, r) => sum + r.split.defective, 0);
  const totalRejected = qcResults.reduce((sum, r) => sum + r.split.rejected, 0);
  const totalAccepted = qcResults.reduce((sum, r) => sum + r.split.accepted, 0);
  const defectRate = totalAccepted + totalDefective + totalRejected > 0 ? Math.round(((totalDefective + totalRejected) / (totalAccepted + totalDefective + totalRejected)) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="QC Dashboard"
        subtitle="Quality check queue and outcomes."
        action={<Button onClick={() => navigate('/qc/queue')}><PackageSearch size={15} />Open QC Queue</Button>}
      />
      <QcSubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile label="Awaiting Check" value={pending} tone={pending ? 'warning' : 'good'} />
        <StatTile label="Checks Completed" value={totalChecked} tone="neutral" />
        <StatTile label="Defect Rate" value={`${defectRate}%`} tone={defectRate > 5 ? 'serious' : 'good'} />
        <StatTile label="Rejected Qty" value={totalRejected} tone={totalRejected ? 'critical' : 'good'} />
      </div>

      <Card className="p-4">
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
          Recent checks
        </h2>
        {qcResults.length === 0 ? (
          <EmptyState text="No QC checks completed yet." />
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
            {qcResults.slice(0, 5).map((r) => (
              <div key={r.gateEntryId} className="py-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {r.sku}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Accepted {r.split.accepted} · Defective {r.split.defective} · Rejected {r.split.rejected}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
