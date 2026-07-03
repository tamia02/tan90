import { useStore } from '../lib/store';
import StoreManagerSubNav from '../components/StoreManagerSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { Boxes, PackageCheck } from 'lucide-react';

export default function ShelfBin() {
  const { grnRecords, ledger } = useStore();

  const bins = Array.from(new Set(ledger.map((l) => l.bin))).map((bin) => ({
    bin,
    skus: Array.from(new Set(ledger.filter((l) => l.bin === bin).map((l) => l.sku))),
    qty: ledger.filter((l) => l.bin === bin && l.bucket === 'available').reduce((sum, l) => sum + l.qty, 0),
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Shelf & Bin" subtitle="Put-away destinations — suggested bin per GRN, and what's stored where." />
      <StoreManagerSubNav />

      <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Recent put-aways
      </h2>
      <div className="flex flex-col gap-3 mb-8">
        {grnRecords.length === 0 && <EmptyState text="No GRN records posted yet." />}
        {grnRecords.map((grn) => (
          <Card key={grn.gateEntryId} className="p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl grid place-items-center shrink-0" style={{ background: 'var(--brand-bg)', color: 'var(--brand)' }}>
              <Boxes size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {grn.sku}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Accepted {grn.split.accepted} → Bin <strong>{grn.suggestedBin}</strong>
              </div>
            </div>
            <PackageCheck size={18} color="var(--status-good)" />
          </Card>
        ))}
      </div>

      <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Bin occupancy
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bins.length === 0 && <EmptyState text="No bins in use yet." />}
        {bins.map((b) => (
          <Card key={b.bin} className="p-4">
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {b.bin}
            </div>
            <div className="text-2xl font-semibold tabular-nums mt-1" style={{ color: 'var(--status-good)' }}>
              {b.qty}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {b.skus.join(', ')}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
