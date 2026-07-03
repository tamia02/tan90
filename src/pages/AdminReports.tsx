import { useStore } from '../lib/store';
import AdminSubNav from '../components/AdminSubNav';
import { TrendChart } from '../components/TrendChart';
import { Card, PageHeader } from '../components/ui';
import { StatTile } from '../components/StatTile';
import { monthlySeries } from '../lib/trends';
import { issueCounts } from '../lib/derived';

export default function AdminReports() {
  const { gateEntries, issues, teamMembers, vendorMaster, skuMaster } = useStore();
  const counts = issueCounts(issues);
  const gateVolume = gateEntries.length || 4;
  const issueVolume = counts.hardFail + counts.needsApproval + counts.warnings || 3;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Reports" subtitle="System-wide activity, last 12 months." />
      <AdminSubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile label="Team Members" value={teamMembers.length} tone="neutral" />
        <StatTile label="Vendors on File" value={vendorMaster.length} tone="neutral" />
        <StatTile label="SKUs Mapped" value={skuMaster.filter((s) => s.mapped).length} tone="good" />
        <StatTile label="Open Issues" value={counts.hardFail + counts.needsApproval + counts.warnings} tone={counts.hardFail ? 'critical' : 'good'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
            Gate entries — last 12 months
          </h2>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Inward, outward, visitor and loading entries combined
          </p>
          <TrendChart data={monthlySeries(gateVolume)} valueFormatter={(v) => `${v.toLocaleString('en-IN')} entries`} />
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
            Validation issues raised — last 12 months
          </h2>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Hard Fail, Red Flag and Warning combined
          </p>
          <TrendChart data={monthlySeries(issueVolume)} valueFormatter={(v) => `${v.toLocaleString('en-IN')} issues`} />
        </Card>
      </div>
    </div>
  );
}
