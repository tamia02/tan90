import { useStore } from '../lib/store';
import StoreExecSubNav from '../components/StoreExecSubNav';
import { Card, PageHeader } from '../components/ui';
import { MapPinned } from 'lucide-react';

const knownBays = ['Staging Bay 1', 'Staging Bay 2', 'Staging Bay 3', 'Staging Bay 4', 'Staging Bay 5', 'Staging Bay 6', 'Staging Bay 7', 'Staging Bay 8'];

export default function StagingAreas() {
  const { unloadingRecords, gateEntries } = useStore();

  const bays = knownBays.map((bay) => {
    const records = unloadingRecords.filter((u) => u.stagingArea === bay);
    const active = records.filter((u) => {
      const gate = gateEntries.find((g) => g.id === u.gateEntryId);
      return gate && gate.status !== 'closed';
    });
    return { bay, active: active.length, throughput: records.length };
  });

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Staging Areas" subtitle="Bay occupancy across the yard." />
      <StoreExecSubNav />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bays.map((b) => (
          <Card key={b.bay} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPinned size={15} color={b.active > 0 ? 'var(--brand)' : 'var(--text-muted)'} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {b.bay}
              </span>
            </div>
            <div className="text-2xl font-semibold tabular-nums" style={{ color: b.active > 0 ? 'var(--brand)' : 'var(--text-muted)' }}>
              {b.active}
            </div>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Active now
            </div>
            <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
              {b.throughput} total unloadings staged here
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
