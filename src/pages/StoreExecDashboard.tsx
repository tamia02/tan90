import { useNavigate } from 'react-router-dom';
import { Warehouse } from 'lucide-react';
import { useStore } from '../lib/store';
import StoreExecSubNav from '../components/StoreExecSubNav';
import { StatTile } from '../components/StatTile';
import { Button, Card, EmptyState, PageHeader } from '../components/ui';
import { GateStatusBadge } from '../components/Badge';
import { gateEntryLabel } from '../lib/derived';

export default function StoreExecDashboard() {
  const { gateEntries, unloadingRecords } = useStore();
  const navigate = useNavigate();

  const ready = gateEntries.filter((g) => g.status === 'validated');
  const inProgress = gateEntries.filter((g) => g.status === 'unloading');
  const completedToday = unloadingRecords.filter((u) => u.completedAt && new Date(u.completedAt).toDateString() === new Date().toDateString()).length;
  const recent = [...unloadingRecords].filter((u) => u.completedAt).slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Store Executive Dashboard"
        subtitle="Unloading queue and recent activity."
        action={<Button onClick={() => navigate('/unloading/desk')}><Warehouse size={15} />Open Unloading Desk</Button>}
      />
      <StoreExecSubNav />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatTile label="Ready for Unloading" value={ready.length} tone={ready.length ? 'warning' : 'good'} />
        <StatTile label="In Progress" value={inProgress.length} tone="neutral" />
        <StatTile label="Completed Today" value={completedToday} tone="good" />
      </div>

      <Card className="p-4">
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
          Recently completed
        </h2>
        {recent.length === 0 ? (
          <EmptyState text="No unloadings completed yet." />
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
            {recent.map((u) => {
              const gate = gateEntries.find((g) => g.id === u.gateEntryId);
              return (
                <div key={u.gateEntryId} className="py-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {gate ? gateEntryLabel(gate) : u.gateEntryId}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {u.boxCount} boxes · {u.stagingArea} · POD/LR {u.podLrRef}
                    </div>
                  </div>
                  {gate && <GateStatusBadge status={gate.status} />}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
