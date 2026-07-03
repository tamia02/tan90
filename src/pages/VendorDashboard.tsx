import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FilePlus2 } from 'lucide-react';
import { useStore } from '../lib/store';
import VendorSubNav from '../components/VendorSubNav';
import { StatTile } from '../components/StatTile';
import { Button, Card, PageHeader } from '../components/ui';

export default function VendorDashboard() {
  const { vendorSubmissions } = useStore();
  const navigate = useNavigate();
  const pending = vendorSubmissions.filter((s) => s.status === 'submitted').length;
  const needsCorrection = vendorSubmissions.filter((s) => s.status === 'correction_requested').length;
  const acknowledged = vendorSubmissions.filter((s) => s.status === 'acknowledged').length;

  const recent = vendorSubmissions.slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Vendor Dashboard"
        subtitle="Your submission activity at a glance."
        action={
          <Button onClick={() => navigate('/vendor/new')}>
            <FilePlus2 size={15} />
            New submission
          </Button>
        }
      />
      <VendorSubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile label="Total Submissions" value={vendorSubmissions.length} tone="neutral" />
        <StatTile label="Under Review" value={pending} tone="neutral" />
        <StatTile label="Correction Needed" value={needsCorrection} tone={needsCorrection ? 'warning' : 'good'} />
        <StatTile label="Acknowledged" value={acknowledged} tone="good" />
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Recent submissions
          </h2>
          <Link to="/vendor/submissions" className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--brand)' }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>
            No submissions yet — start with a new one.
          </p>
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
            {recent.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {s.poNumber}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {s.vendorName} · {s.invoiceQty || '—'} qty
                  </div>
                </div>
                <span className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
                  {s.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
