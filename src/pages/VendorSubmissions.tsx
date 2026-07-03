import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../lib/store';
import VendorSubNav from '../components/VendorSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';

const statusTone: Record<string, string> = {
  submitted: 'var(--brand)',
  correction_requested: 'var(--status-warning)',
  acknowledged: 'var(--status-good)',
};

export default function VendorSubmissions() {
  const { vendorSubmissions } = useStore();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vendorSubmissions;
    return vendorSubmissions.filter((s) => [s.poNumber, s.vendorName, s.invoiceNumber, s.material].some((v) => v?.toLowerCase().includes(q)));
  }, [vendorSubmissions, query]);

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="My Submissions" subtitle="Every document set you've sent in, and its review status." />
      <VendorSubNav />

      <div className="flex items-center gap-2 mb-4 rounded-[var(--radius)] border px-3 py-2" style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search PO, invoice, material"
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && <EmptyState text="No submissions match your search." />}
        {filtered.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {s.poNumber}
              </span>
              <span className="text-xs font-medium capitalize" style={{ color: statusTone[s.status] ?? 'var(--text-muted)' }}>
                {s.status.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {s.vendorName} · {s.material || 'No material set'} · {s.invoiceQty || '—'} qty
            </div>
            <div className="text-xs mt-2 flex gap-3" style={{ color: 'var(--text-muted)' }}>
              <span>Invoice {s.hasInvoice ? '✓' : '—'}</span>
              <span>E-way bill {s.hasEwayBill ? '✓' : '—'}</span>
              <span>LR/POD {s.hasLrPod ? '✓' : '—'}</span>
            </div>
            {s.note && (
              <p className="text-xs mt-2 rounded-[var(--radius)] px-2.5 py-1.5" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}>
                {s.note}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
