import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../lib/store';
import StoreManagerSubNav from '../components/StoreManagerSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';

export default function GrnRegister() {
  const { grnRecords, gateEntries } = useStore();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const withGate = grnRecords.map((grn) => ({ grn, gate: gateEntries.find((g) => g.id === grn.gateEntryId) }));
    if (!q) return withGate;
    return withGate.filter(({ grn, gate }) => [grn.sku, grn.suggestedBin, gate?.vendorName, gate?.poNumber].some((v) => v?.toLowerCase().includes(q)));
  }, [grnRecords, gateEntries, query]);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="GRN Register" subtitle="Every GRN posted, searchable — the historical record behind GRN Check." />
      <StoreManagerSubNav />

      <div className="flex items-center gap-2 mb-4 rounded-[var(--radius)] border px-3 py-2" style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search SKU, bin, vendor, PO"
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      <Card className="p-0 overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState text="No GRNs match your search." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-4 py-2.5 font-medium">SKU</th>
                  <th className="px-4 py-2.5 font-medium">Vendor / PO</th>
                  <th className="px-4 py-2.5 font-medium">Accepted</th>
                  <th className="px-4 py-2.5 font-medium">Defective</th>
                  <th className="px-4 py-2.5 font-medium">Missing</th>
                  <th className="px-4 py-2.5 font-medium">Bin</th>
                  <th className="px-4 py-2.5 font-medium">Posted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ grn, gate }) => (
                  <tr key={grn.gateEntryId} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>{grn.sku}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                      {gate?.vendorName ?? '—'} · {gate?.poNumber ?? '—'}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums" style={{ color: 'var(--status-good)' }}>{grn.split.accepted}</td>
                    <td className="px-4 py-2.5 tabular-nums" style={{ color: 'var(--status-serious)' }}>{grn.split.defective}</td>
                    <td className="px-4 py-2.5 tabular-nums" style={{ color: 'var(--status-critical)' }}>{grn.missing}</td>
                    <td className="px-4 py-2.5">{grn.suggestedBin}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(grn.createdAt).toLocaleString()}</td>
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
