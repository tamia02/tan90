import { Fragment, useState } from 'react';
import { useStore } from '../lib/store';
import { Button, Card, EmptyState, Field, Input, PageHeader } from '../components/ui';
import { gateEntryLabel } from '../lib/derived';
import { Boxes, ChevronDown, ChevronUp, PackageCheck } from 'lucide-react';
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

export default function GrnCheck() {
  const { gateEntries, qcResults, grnRecords, finance, ledger } = useStore();
  const [tab, setTab] = useState<'grn' | 'putaway' | 'ledger'>('grn');
  const [expandedLedgerId, setExpandedLedgerId] = useState<string | null>(null);

  const readyForGrn = gateEntries.filter((g) => g.status === 'qc_done');

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="GRN Check" subtitle="Post the QC-checked receipt to stock, then put-away and the immutable ledger." />

      <div className="flex gap-2 mb-5">
        {(
          [
            ['grn', 'GRN Check'],
            ['putaway', 'Put-away'],
            ['ledger', 'Immutable Ledger'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className="px-3.5 py-2 rounded-[var(--radius)] text-sm font-medium border"
            style={{
              borderColor: tab === value ? 'var(--brand)' : 'var(--border)',
              background: tab === value ? 'var(--brand-bg)' : 'var(--surface-3)',
              color: tab === value ? 'var(--brand)' : 'var(--text-secondary)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'grn' && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            QC Check complete, ready for GRN posting
          </h2>
          {readyForGrn.length === 0 && <EmptyState text="Nothing waiting — QC Check hasn't sent anything through yet." />}
          {readyForGrn.map((g) => {
            const qc = qcResults.find((r) => r.gateEntryId === g.id);
            if (!qc) return null;
            return <GrnCard key={g.id} gateId={g.id} label={gateEntryLabel(g)} qc={qc} />;
          })}
        </div>
      )}

      {tab === 'putaway' && (
        <div className="flex flex-col gap-3">
          {grnRecords.length === 0 && <EmptyState text="No GRN records posted yet." />}
          {grnRecords.map((grn) => (
            <Card key={grn.gateEntryId} className="p-4 flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl grid place-items-center shrink-0"
                style={{ background: 'var(--brand-bg)', color: 'var(--brand)' }}
              >
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
      )}

      {tab === 'ledger' && (
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
                        <tr
                          onClick={() => setExpandedLedgerId(expanded ? null : l.id)}
                          className="cursor-pointer"
                          style={{ borderTop: '1px solid var(--border)' }}
                        >
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
                                  <div style={{ color: 'var(--text-primary)' }}>
                                    {gate ? `${gate.gateNo} · ${gate.vendorName ?? gate.vehicleNumber}` : '—'}
                                  </div>
                                </div>
                                <div>
                                  <div className="uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>GRN</div>
                                  <div style={{ color: 'var(--text-primary)' }}>
                                    {grn ? `Accepted ${grn.split.accepted} · Defective ${grn.split.defective} · Missing ${grn.missing}` : '—'}
                                  </div>
                                </div>
                                <div>
                                  <div className="uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Finance</div>
                                  <div style={{ color: 'var(--text-primary)' }}>
                                    {financeRecord ? `${financeRecord.vendorStatus} · Payable ₹${financeRecord.finalPayable.toLocaleString('en-IN')}` : 'Not yet posted'}
                                  </div>
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
          <div className="px-4 py-2.5 text-xs border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            No edit. No delete. Corrections only by reversal or adjustment.
          </div>
        </Card>
      )}
    </div>
  );
}

function GrnCard({ gateId, label, qc }: { gateId: string; label: string; qc: import('../lib/types').QcResult }) {
  const { dispatch } = useStore();
  const [suggestedBin, setSuggestedBin] = useState('');

  function post() {
    dispatch({ type: 'SAVE_GRN', payload: { gateEntryId: gateId, suggestedBin: suggestedBin || 'UNBINNED' } });
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between flex-wrap gap-1 mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {qc.sku}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center mb-3">
        <Metric label="Invoice" value={qc.invoiceQty} />
        <Metric label="Accepted" value={qc.split.accepted} tone="var(--status-good)" />
        <Metric label="QC Hold" value={qc.split.qcHold} tone="var(--status-warning)" />
        <Metric label="Defective" value={qc.split.defective} tone="var(--status-serious)" />
        <Metric label="Missing" value={qc.missing} tone="var(--status-critical)" />
      </div>
      {qc.qcReasons && (
        <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          QC notes: {qc.qcReasons}
        </p>
      )}

      <Field label="Suggested bin">
        <Input value={suggestedBin} onChange={(e) => setSuggestedBin(e.target.value)} placeholder="BHW-CHEM-A1" />
      </Field>

      <Button className="mt-4" onClick={post}>
        Post GRN &amp; update stock
      </Button>
    </Card>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <div className="text-lg font-semibold tabular-nums" style={{ color: tone ?? 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  );
}
