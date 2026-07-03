import { useStore } from '../lib/store';
import QcSubNav from '../components/QcSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';
import type { LedgerBucket } from '../lib/types';

const bucketLabel: Record<LedgerBucket, string> = {
  available: 'Available Stock',
  defective: 'Defective',
  rejected: 'Rejected',
  qcHold: 'QC Hold',
};

const bucketTone: Record<LedgerBucket, string> = {
  available: 'var(--status-good)',
  defective: 'var(--status-serious)',
  rejected: 'var(--status-critical)',
  qcHold: 'var(--status-warning)',
};

// Read-only — posting to the ledger is Store Manager's action (GRN Check).
// QC only sees the buckets its own checks feed into.
export default function QcStockLedger() {
  const { ledger } = useStore();
  const relevant = ledger.filter((l) => l.bucket !== 'available');

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Stock Ledger" subtitle="Defective, rejected and QC-hold postings your checks fed into — view only." />
      <QcSubNav />

      <Card className="p-0 overflow-hidden">
        {relevant.length === 0 ? (
          <EmptyState text="No defective, rejected or QC-hold postings yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-4 py-2.5 font-medium">Timestamp</th>
                  <th className="px-4 py-2.5 font-medium">SKU / Bin</th>
                  <th className="px-4 py-2.5 font-medium">Bucket</th>
                  <th className="px-4 py-2.5 font-medium">Qty</th>
                </tr>
              </thead>
              <tbody>
                {relevant.map((l) => (
                  <tr key={l.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5">
                      {l.sku} / {l.bin}
                    </td>
                    <td className="px-4 py-2.5 font-medium" style={{ color: bucketTone[l.bucket] }}>
                      {bucketLabel[l.bucket]}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">{l.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
