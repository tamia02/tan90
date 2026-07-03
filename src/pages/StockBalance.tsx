import { useMemo } from 'react';
import { useStore } from '../lib/store';
import StoreManagerSubNav from '../components/StoreManagerSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';
import type { LedgerBucket } from '../lib/types';

const buckets: LedgerBucket[] = ['available', 'qcHold', 'defective', 'rejected'];
const bucketLabel: Record<LedgerBucket, string> = { available: 'Available', qcHold: 'QC Hold', defective: 'Defective', rejected: 'Rejected' };
const bucketTone: Record<LedgerBucket, string> = {
  available: 'var(--status-good)',
  qcHold: 'var(--status-warning)',
  defective: 'var(--status-serious)',
  rejected: 'var(--status-critical)',
};

export default function StockBalance() {
  const { ledger } = useStore();

  const bySku = useMemo(() => {
    const map = new Map<string, Record<LedgerBucket, number> & { bin: string }>();
    for (const l of ledger) {
      const existing = map.get(l.sku) ?? { available: 0, qcHold: 0, defective: 0, rejected: 0, bin: l.bin };
      existing[l.bucket] += l.qty;
      map.set(l.sku, existing);
    }
    return Array.from(map.entries());
  }, [ledger]);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Stock Balance" subtitle="Current quantity per SKU, aggregated across every ledger posting." />
      <StoreManagerSubNav />

      {bySku.length === 0 ? (
        <EmptyState text="No stock posted yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bySku.map(([sku, totals]) => (
            <Card key={sku} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {sku}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Bin {totals.bin}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {buckets.map((b) => (
                  <div key={b}>
                    <div className="text-lg font-semibold tabular-nums" style={{ color: bucketTone[b] }}>
                      {totals[b]}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      {bucketLabel[b]}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
