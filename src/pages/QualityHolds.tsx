import { useStore } from '../lib/store';
import QcSubNav from '../components/QcSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { gateEntryLabel } from '../lib/derived';

// QC's own read of "what's on hold" — built from QC's own check results
// (defective/rejected/qcHold splits), not Store Manager's Validation Issues.
// Keeps the two roles' screens from overlapping.
export default function QualityHolds() {
  const { qcResults, gateEntries } = useStore();
  const holds = qcResults.filter((r) => r.split.defective > 0 || r.split.rejected > 0 || r.split.qcHold > 0);

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Quality Holds" subtitle="Items flagged defective, rejected or held during QC Check." />
      <QcSubNav />

      <div className="flex flex-col gap-3">
        {holds.length === 0 && <EmptyState text="Nothing on hold — every recent check was clean." />}
        {holds.map((r) => {
          const gate = gateEntries.find((g) => g.id === r.gateEntryId);
          return (
            <Card key={r.gateEntryId} className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {gate ? gateEntryLabel(gate) : r.gateEntryId}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {r.sku}
                </span>
              </div>
              <div className="flex gap-4 text-xs">
                {r.split.defective > 0 && <span style={{ color: 'var(--status-serious)' }}>Defective: {r.split.defective}</span>}
                {r.split.rejected > 0 && <span style={{ color: 'var(--status-critical)' }}>Rejected: {r.split.rejected}</span>}
                {r.split.qcHold > 0 && <span style={{ color: 'var(--status-warning)' }}>QC Hold: {r.split.qcHold}</span>}
              </div>
              {r.qcReasons && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {r.qcReasons}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
