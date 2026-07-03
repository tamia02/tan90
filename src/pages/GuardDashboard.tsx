import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ClipboardList, ScanLine, Timer } from 'lucide-react';
import { useStore } from '../lib/store';
import GuardSubNav from '../components/GuardSubNav';
import { StatTile } from '../components/StatTile';
import { Button, Card, PageHeader } from '../components/ui';
import { GateStatusBadge } from '../components/Badge';
import { formatDuration, gateEntryLabel, slaRemainingMs } from '../lib/derived';

export default function GuardDashboard() {
  const { gateEntries } = useStore();
  const navigate = useNavigate();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaysEntries = gateEntries.filter((g) => new Date(g.createdAt) >= todayStart);
  const openEntries = gateEntries.filter((g) => g.status !== 'closed');
  const slaBreaches = gateEntries.filter((g) => g.status !== 'closed' && slaRemainingMs(g) < 0);
  const missingGps = gateEntries.filter((g) => g.status !== 'closed' && !g.gps);

  const recent = [...gateEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Guard Dashboard"
        subtitle="Today's gate activity, SLA status and quick actions."
        action={
          <Button onClick={() => navigate('/guard/scan')}>
            <ScanLine size={15} />
            New bill scan
          </Button>
        }
      />
      <GuardSubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile label="Today's Entries" value={todaysEntries.length} tone="neutral" icon={<ClipboardList size={16} />} />
        <StatTile label="Open / In Progress" value={openEntries.length} tone="neutral" icon={<Timer size={16} />} />
        <StatTile label="SLA Breaches" value={slaBreaches.length} tone={slaBreaches.length ? 'critical' : 'good'} icon={<AlertTriangle size={16} />} />
        <StatTile label="GPS Missing" value={missingGps.length} tone={missingGps.length ? 'warning' : 'good'} icon={<AlertTriangle size={16} />} />
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Recent gate entries
          </h2>
          <Button variant="ghost" onClick={() => navigate('/guard/entries')}>
            View all
          </Button>
        </div>
        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
          {recent.length === 0 && (
            <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>
              No gate entries yet. Start a bill scan to log the first one.
            </p>
          )}
          {recent.map((g) => {
            const remaining = slaRemainingMs(g);
            return (
              <div key={g.id} className="py-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {gateEntryLabel(g)}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {g.entryType} · {g.vehicleNumber} ·{' '}
                    {g.status !== 'closed' && (
                      <span style={{ color: remaining < 0 ? 'var(--status-critical)' : 'var(--text-muted)' }}>
                        SLA {formatDuration(remaining)}
                      </span>
                    )}
                  </div>
                </div>
                <GateStatusBadge status={g.status} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
