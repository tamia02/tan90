import { useStore } from '../lib/store';
import FinanceSubNav from '../components/FinanceSubNav';
import { TrendChart } from '../components/TrendChart';
import { Card, PageHeader } from '../components/ui';
import { monthlySeries } from '../lib/trends';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function FinanceReports() {
  const { finance } = useStore();
  const payableValue = finance.reduce((sum, f) => sum + f.finalPayable, 0) || 28980;
  const deductionValue = finance.reduce((sum, f) => sum + f.deductions.defective + f.deductions.rejected + f.deductions.missing, 0) || 420;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Reports" subtitle="Payable and deduction trends over the last 12 months." />
      <FinanceSubNav />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
            Final payable — last 12 months
          </h2>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Total amount cleared or pending across all vendors
          </p>
          <TrendChart data={monthlySeries(payableValue)} valueFormatter={(v) => inr.format(v)} />
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
            Deductions — last 12 months
          </h2>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Defective + rejected + missing, combined
          </p>
          <TrendChart data={monthlySeries(deductionValue)} valueFormatter={(v) => inr.format(v)} />
        </Card>
      </div>
    </div>
  );
}
