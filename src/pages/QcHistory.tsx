import { useStore } from '../lib/store';
import QcSubNav from '../components/QcSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';

export default function QcHistory() {
  const { qcResults } = useStore();

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="QC History" subtitle="Every completed QC check, most recent first." />
      <QcSubNav />

      <div className="flex flex-col gap-3">
        {qcResults.length === 0 && <EmptyState text="No QC checks completed yet." />}
        {qcResults.map((r) => (
          <Card key={r.gateEntryId} className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {r.sku}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {new Date(r.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-center">
              <Metric label="Invoice" value={r.invoiceQty} />
              <Metric label="Accepted" value={r.split.accepted} tone="var(--status-good)" />
              <Metric label="QC Hold" value={r.split.qcHold} tone="var(--status-warning)" />
              <Metric label="Defective" value={r.split.defective} tone="var(--status-serious)" />
              <Metric label="Missing" value={r.missing} tone="var(--status-critical)" />
            </div>
            {r.qcReasons && (
              <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
                {r.qcReasons}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <div className="text-lg font-semibold tabular-nums" style={{ color: tone ?? 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  );
}
