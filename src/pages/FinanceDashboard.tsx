import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useStore } from '../lib/store';
import FinanceSubNav from '../components/FinanceSubNav';
import { StatTile } from '../components/StatTile';
import { Button, Card, EmptyState, PageHeader } from '../components/ui';
import { VendorStatusBadge } from '../components/Badge';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function FinanceDashboard() {
  const { finance } = useStore();
  const navigate = useNavigate();

  const pending = finance.filter((f) => f.vendorStatus === 'pending').length;
  const onHold = finance.filter((f) => f.vendorStatus === 'hold').length;
  const totalPayable = finance.reduce((sum, f) => sum + f.finalPayable, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Finance Dashboard"
        subtitle="Payables at a glance."
        action={<Button onClick={() => navigate('/finance/review')}><FileText size={15} />Open Finance Review</Button>}
      />
      <FinanceSubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile label="Records" value={finance.length} tone="neutral" />
        <StatTile label="Pending" value={pending} tone={pending ? 'warning' : 'good'} />
        <StatTile label="On Hold" value={onHold} tone={onHold ? 'critical' : 'good'} />
        <StatTile label="Total Payable" value={inr.format(totalPayable)} tone="good" />
      </div>

      <Card className="p-4">
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
          Recent records
        </h2>
        {finance.length === 0 ? (
          <EmptyState text="No GRN has posted through to finance yet." />
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
            {finance.slice(0, 5).map((f) => (
              <div key={f.gateEntryId} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {f.vendorName}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {inr.format(f.finalPayable)}
                  </div>
                </div>
                <VendorStatusBadge status={f.vendorStatus} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
