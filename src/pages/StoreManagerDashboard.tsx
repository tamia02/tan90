import { useNavigate } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { useStore } from '../lib/store';
import StoreManagerSubNav from '../components/StoreManagerSubNav';
import { StatTile } from '../components/StatTile';
import { Button, Card, EmptyState, PageHeader } from '../components/ui';
import { gateEntryLabel } from '../lib/derived';

export default function StoreManagerDashboard() {
  const { gateEntries, grnRecords, ledger, issues } = useStore();
  const navigate = useNavigate();

  const readyForGrn = gateEntries.filter((g) => g.status === 'qc_done');
  const unassignedIssues = issues.filter((i) => i.status === 'open' && !i.owner).length;
  const availableStock = ledger.filter((l) => l.bucket === 'available').reduce((sum, l) => sum + l.qty, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Store Manager Dashboard"
        subtitle="GRN posting, stock and validation oversight."
        action={<Button onClick={() => navigate('/grn/check')}><ClipboardCheck size={15} />Open GRN Check</Button>}
      />
      <StoreManagerSubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile label="Ready for GRN" value={readyForGrn.length} tone={readyForGrn.length ? 'warning' : 'good'} />
        <StatTile label="GRNs Posted" value={grnRecords.length} tone="neutral" />
        <StatTile label="Unassigned Issues" value={unassignedIssues} tone={unassignedIssues ? 'critical' : 'good'} />
        <StatTile label="Available Stock (units)" value={availableStock} tone="good" />
      </div>

      <Card className="p-4">
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
          Awaiting GRN posting
        </h2>
        {readyForGrn.length === 0 ? (
          <EmptyState text="Nothing waiting — QC hasn't sent anything through yet." />
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
            {readyForGrn.map((g) => (
              <div key={g.id} className="py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                {gateEntryLabel(g)}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
