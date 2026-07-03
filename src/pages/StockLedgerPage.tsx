import { Fragment, useState } from 'react';
import { useStore } from '../lib/store';
import StoreManagerSubNav from '../components/StoreManagerSubNav';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { ChevronDown, ChevronUp } from 'lucide-react';
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

export default function StockLedgerPage() {
  const { ledger, gateEntries, grnRecords, finance } = useStore();
  const [expandedLedgerId, setExpandedLedgerId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Stock Ledger" subtitle="The immutable, system-of-record posting history." />
      <StoreManagerSubNav />

      <Card className="p-0 overflow-hidden">
        {ledger.length === 0 ? (
          <EmptyState text="No ledger postings yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-4 py-2.5 font-medium">Timestamp</th>
                  <th className="px-4 py-2.5 font-medium">SKU / Bin</th>
                  <th className="px-4 py-2.5 font-medium">Bucket</th>
                  <th className="px-4 py-2.5 font-medium">Qty</th>
                  <th className="px-4 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((l) => {
                  const expanded = expandedLedgerId === l.id;
                  const gate = gateEntries.find((g) => g.id === l.gateEntryId);
                  const grn = grnRecords.find((g) => g.gateEntryId === l.gateEntryId);
                  const financeRecord = finance.find((f) => f.gateEntryId === l.gateEntryId);
                  return (
                    <Fragment key={l.id}>
                      <tr onClick={() => setExpandedLedgerId(expanded ? null : l.id)} className="cursor-pointer" style={{ borderTop: '1px solid var(--border)' }}>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(l.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-2.5">{l.sku} / {l.bin}</td>
                        <td className="px-4 py-2.5 font-medium" style={{ color: bucketTone[l.bucket] }}>{bucketLabel[l.bucket]}</td>
                        <td className="px-4 py-2.5 tabular-nums">{l.qty}</td>
                        <td className="px-4 py-2.5 text-right" style={{ color: 'var(--text-muted)' }}>
                          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </td>
                      </tr>
                      {expanded && (
                        <tr style={{ borderTop: '1px solid var(--border)' }}>
                          <td colSpan={5} className="px-4 py-3" style={{ background: 'var(--surface-2)' }}>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              <div>
                                <div className="uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Gate Entry</div>
                                <div style={{ color: 'var(--text-primary)' }}>{gate ? `${gate.gateNo} · ${gate.vendorName ?? gate.vehicleNumber}` : '—'}</div>
                              </div>
                              <div>
                                <div className="uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>GRN</div>
                                <div style={{ color: 'var(--text-primary)' }}>{grn ? `Accepted ${grn.split.accepted} · Defective ${grn.split.defective} · Missing ${grn.missing}` : '—'}</div>
                              </div>
                              <div>
                                <div className="uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Finance</div>
                                <div style={{ color: 'var(--text-primary)' }}>{financeRecord ? `${financeRecord.vendorStatus} · Payable ₹${financeRecord.finalPayable.toLocaleString('en-IN')}` : 'Not yet posted'}</div>
                              </div>
                              <div>
                                <div className="uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Ledger Entry</div>
                                <div style={{ color: 'var(--text-primary)' }}>{l.id}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2.5 text-xs border-t flex items-center gap-1.5" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          No edit. No delete. Corrections only by reversal or adjustment.
        </div>
      </Card>
    </div>
  );
}
