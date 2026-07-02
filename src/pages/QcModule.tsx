import { useState } from 'react';
import { useStore } from '../lib/store';
import { Button, Card, EmptyState, Field, Input, PageHeader, Textarea } from '../components/ui';
import { gateEntryLabel } from '../lib/derived';

export default function QcModule() {
  const { gateEntries, grnRecords } = useStore();
  const pending = gateEntries.filter((g) => g.status === 'grn');

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="QC Module" subtitle="Accept / hold / defective / reject split with reasons, then post to stock." />

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Awaiting QC / GRN
        </h2>
        {pending.length === 0 && <EmptyState text="Nothing waiting — complete unloading in Store Manager first." />}
        {pending.map((g) => (
          <QcForm key={g.id} gateId={g.id} label={gateEntryLabel(g)} invoiceQty={g.invoiceQty ?? 0} material={g.material ?? 'SKU'} />
        ))}
      </div>

      {grnRecords.length > 0 && (
        <>
          <h2 className="text-sm font-semibold mt-8 mb-3" style={{ color: 'var(--text-primary)' }}>
            Posted GRN / QC records
          </h2>
          <div className="flex flex-col gap-3">
            {grnRecords.map((grn) => (
              <Card key={grn.gateEntryId} className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {grn.sku}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Bin {grn.suggestedBin}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-center">
                  <Metric label="Invoice" value={grn.invoiceQty} />
                  <Metric label="Accepted" value={grn.split.accepted} tone="var(--status-good)" />
                  <Metric label="QC Hold" value={grn.split.qcHold} tone="var(--status-warning)" />
                  <Metric label="Defective" value={grn.split.defective} tone="var(--status-serious)" />
                  <Metric label="Missing" value={grn.missing} tone="var(--status-critical)" />
                </div>
                {grn.qcReasons && (
                  <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
                    {grn.qcReasons}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
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

function QcForm({ gateId, label, invoiceQty, material }: { gateId: string; label: string; invoiceQty: number; material: string }) {
  const { dispatch } = useStore();
  const [accepted, setAccepted] = useState('');
  const [qcHold, setQcHold] = useState('');
  const [defective, setDefective] = useState('');
  const [rejected, setRejected] = useState('');
  const [qcReasons, setQcReasons] = useState('');
  const [suggestedBin, setSuggestedBin] = useState('');

  const a = Number(accepted) || 0;
  const h = Number(qcHold) || 0;
  const d = Number(defective) || 0;
  const r = Number(rejected) || 0;
  const physicalReceived = a + h + d + r;
  const missing = Math.max(invoiceQty - physicalReceived, 0);
  const overReceived = physicalReceived > invoiceQty;

  function submit() {
    dispatch({
      type: 'SAVE_GRN',
      payload: {
        gateEntryId: gateId,
        sku: material,
        poQty: invoiceQty,
        invoiceQty,
        split: { accepted: a, qcHold: h, defective: d, rejected: r },
        qcReasons: qcReasons || undefined,
        suggestedBin: suggestedBin || 'UNBINNED',
      },
    });
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between flex-wrap gap-1 mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Invoice Qty {invoiceQty}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="Accepted">
          <Input type="number" value={accepted} onChange={(e) => setAccepted(e.target.value)} />
        </Field>
        <Field label="QC Hold">
          <Input type="number" value={qcHold} onChange={(e) => setQcHold(e.target.value)} />
        </Field>
        <Field label="Defective">
          <Input type="number" value={defective} onChange={(e) => setDefective(e.target.value)} />
        </Field>
        <Field label="Rejected">
          <Input type="number" value={rejected} onChange={(e) => setRejected(e.target.value)} />
        </Field>
      </div>

      <div className="flex items-center justify-between gap-3 mt-3 text-sm rounded-lg px-3 py-2" style={{ background: 'var(--surface-2)' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Physical received: {physicalReceived}</span>
        <span style={{ color: missing > 0 ? 'var(--status-critical)' : 'var(--status-good)' }}>
          Missing exception: {missing}
        </span>
      </div>
      {overReceived && (
        <p className="text-xs mt-2" style={{ color: 'var(--status-critical)' }}>
          Physical received exceeds invoice quantity — check entries.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <Field label="Suggested bin">
          <Input value={suggestedBin} onChange={(e) => setSuggestedBin(e.target.value)} placeholder="BHW-CHEM-A1" />
        </Field>
        <Field label="QC reasons">
          <Textarea rows={1} value={qcReasons} onChange={(e) => setQcReasons(e.target.value)} placeholder="Damage, leakage, wrong item…" />
        </Field>
      </div>

      <Button className="mt-4" onClick={submit} disabled={physicalReceived === 0 || overReceived}>
        Post GRN &amp; update stock
      </Button>
    </Card>
  );
}
