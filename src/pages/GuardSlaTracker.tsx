import { useStore } from '../lib/store';
import GuardSubNav from '../components/GuardSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { GateStatusBadge } from '../components/Badge';
import { formatDuration, gateEntryLabel, slaRemainingMs } from '../lib/derived';

export default function GuardSlaTracker() {
  const { gateEntries } = useStore();
  const open = [...gateEntries]
    .filter((g) => g.status !== 'closed')
    .sort((a, b) => slaRemainingMs(a) - slaRemainingMs(b));

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="SLA Tracker" subtitle="Every open gate entry, sorted by how close it is to breaching the 12-hour GRN SLA." />
      <GuardSubNav />

      <div className="flex flex-col gap-2">
        {open.length === 0 && <EmptyState text="No open gate entries — everything is through GRN and closed." />}
        {open.map((g) => {
          const remaining = slaRemainingMs(g);
          const breached = remaining < 0;
          return (
            <Card
              key={g.id}
              className="p-4 flex items-center justify-between gap-3 flex-wrap"
              style={breached ? { borderColor: 'var(--status-critical)' } : undefined}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {gateEntryLabel(g)}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {g.entryType} · {g.vehicleNumber} · {g.poNumber ?? 'No PO'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tabular-nums" style={{ color: breached ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                  {formatDuration(remaining)}
                </span>
                <GateStatusBadge status={g.status} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
