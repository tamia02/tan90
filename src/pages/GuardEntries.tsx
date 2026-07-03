import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../lib/store';
import GuardSubNav from '../components/GuardSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { GateStatusBadge } from '../components/Badge';
import { formatDuration, slaRemainingMs } from '../lib/derived';

export default function GuardEntries() {
  const { gateEntries } = useStore();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...gateEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (!q) return sorted;
    return sorted.filter((g) =>
      [g.gateNo, g.poNumber, g.vendorName, g.vehicleNumber, g.driverName, g.invoiceNumber]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [gateEntries, query]);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Guard Entries" subtitle="Full gate log across inward, outward, visitor and loading entries." />
      <GuardSubNav />

      <div className="flex items-center gap-2 mb-4 rounded-[var(--radius)] border px-3 py-2" style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gate no, PO, vendor, vehicle, driver"
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && <EmptyState text="No gate entries match your search." />}
        {filtered.map((g) => {
          const remaining = slaRemainingMs(g);
          const open = openId === g.id;
          return (
            <Card key={g.id} className="p-0 overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : g.id)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {g.gateNo} · {g.vendorName ?? g.driverName}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {g.entryType} · {g.vehicleNumber} · {new Date(g.createdAt).toLocaleString()}
                    {g.status !== 'closed' && (
                      <>
                        {' · '}
                        <span style={{ color: remaining < 0 ? 'var(--status-critical)' : 'var(--text-muted)' }}>
                          SLA {formatDuration(remaining)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <GateStatusBadge status={g.status} />
              </button>
              {open && (
                <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                  <Detail label="PO Number" value={g.poNumber} />
                  <Detail label="Invoice Number" value={g.invoiceNumber} />
                  <Detail label="Invoice Qty" value={g.invoiceQty} />
                  <Detail label="Material" value={g.material} />
                  <Detail label="Driver" value={g.driverName} />
                  <Detail label="Transporter" value={g.transporter} />
                  <Detail label="Location" value={g.location} />
                  <Detail label="GPS" value={g.gps ?? 'Not captured'} />
                  <Detail label="Bill Scanned" value={g.billScanned ? 'Yes' : 'No'} />
                  {g.remarks && <Detail label="Remarks" value={g.remarks} />}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div style={{ color: 'var(--text-primary)' }}>{value ?? '—'}</div>
    </div>
  );
}
