import { useStore } from '../lib/store';
import FinanceSubNav from '../components/FinanceSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function VendorClaims() {
  const { finance } = useStore();
  const withDeductions = finance.filter((f) => f.deductions.defective + f.deductions.rejected + f.deductions.missing > 0);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Vendor Claims" subtitle="Deduction breakdown per vendor — the basis for any debit note or dispute." />
      <FinanceSubNav />

      <div className="flex flex-col gap-3">
        {withDeductions.length === 0 && <EmptyState text="No deductions raised against any vendor yet." />}
        {withDeductions.map((f) => {
          const total = f.deductions.defective + f.deductions.rejected + f.deductions.missing;
          return (
            <Card key={f.gateEntryId} className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {f.vendorName}
                </span>
                <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--status-critical)' }}>
                  {inr.format(total)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Defective</div>
                  <div className="tabular-nums" style={{ color: 'var(--status-serious)' }}>{inr.format(f.deductions.defective)}</div>
                </div>
                <div>
                  <div className="uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Rejected</div>
                  <div className="tabular-nums" style={{ color: 'var(--status-critical)' }}>{inr.format(f.deductions.rejected)}</div>
                </div>
                <div>
                  <div className="uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Missing</div>
                  <div className="tabular-nums" style={{ color: 'var(--status-critical)' }}>{inr.format(f.deductions.missing)}</div>
                </div>
              </div>
              {f.notes && (
                <p className="text-xs mt-3 rounded-[var(--radius)] px-2.5 py-1.5" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                  {f.notes}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
