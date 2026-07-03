import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '../lib/store';
import QcSubNav from '../components/QcSubNav';
import { Button, Card, EmptyState, Field, Input, PageHeader, Select, Textarea } from '../components/ui';
import { gateEntryLabel } from '../lib/derived';
import type { GateEntry } from '../lib/types';

export default function QcModule() {
  const { gateEntries } = useStore();
  const pending = gateEntries.filter((g) => g.status === 'grn');

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="QC Queue" subtitle="Accept / hold / defective / reject split with reasons, then send to GRN Check." />
      <QcSubNav />

      <div className="flex flex-col gap-4">
        {pending.length === 0 && <EmptyState text="Nothing waiting — complete unloading at the Unloading Desk first." />}
        {pending.map((g) => (
          <QcForm key={g.id} gate={g} label={gateEntryLabel(g)} />
        ))}
      </div>
    </div>
  );
}

const reasonCodes = ['Damage', 'Leakage', 'Wrong item', 'Document mismatch', 'Other'];

function QcForm({ gate, label }: { gate: GateEntry; label: string }) {
  const { dispatch } = useStore();
  const invoiceQty = gate.invoiceQty ?? 0;
  const material = gate.material ?? 'SKU';
  const [accepted, setAccepted] = useState('');
  const [qcHold, setQcHold] = useState('');
  const [defective, setDefective] = useState('');
  const [rejected, setRejected] = useState('');
  const [reasonCode, setReasonCode] = useState('');
  const [qcReasons, setQcReasons] = useState('');

  const a = Number(accepted) || 0;
  const h = Number(qcHold) || 0;
  const d = Number(defective) || 0;
  const r = Number(rejected) || 0;
  const physicalReceived = a + h + d + r;
  const missing = Math.max(invoiceQty - physicalReceived, 0);
  const overReceived = physicalReceived > invoiceQty;
  const needsReason = d + r > 0;
  const docMissing = !gate.billScanned;

  function submit() {
    const reasons = [reasonCode, qcReasons].filter(Boolean).join(' — ');
    dispatch({
      type: 'SAVE_QC_RESULT',
      payload: {
        gateEntryId: gate.id,
        sku: material,
        poQty: invoiceQty,
        invoiceQty,
        split: { accepted: a, qcHold: h, defective: d, rejected: r },
        qcReasons: reasons || undefined,
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

      {docMissing && (
        <div className="flex items-center gap-2 text-xs rounded-[var(--radius)] px-3 py-2 mb-3" style={{ background: 'var(--status-critical-bg)', color: 'var(--status-critical)' }}>
          <AlertTriangle size={14} />
          Bill/document scan was never confirmed at the gate — this can't be sent to GRN Check until that's resolved.
        </div>
      )}

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

      <div className="flex items-center justify-between gap-3 mt-3 text-sm rounded-[var(--radius)] px-3 py-2" style={{ background: 'var(--surface-2)' }}>
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

      <Field label="Reason code" hint={needsReason ? 'Required — defective or rejected qty entered' : undefined}>
        <Select value={reasonCode} onChange={(e) => setReasonCode(e.target.value)} className="mt-3">
          <option value="">Select reason…</option>
          {reasonCodes.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Reason details">
        <Textarea rows={1} value={qcReasons} onChange={(e) => setQcReasons(e.target.value)} placeholder="Optional detail — e.g. minor bag damage on 1 pallet" className="mt-3" />
      </Field>

      <Button
        className="mt-4"
        onClick={submit}
        disabled={physicalReceived === 0 || overReceived || docMissing || (needsReason && !reasonCode)}
      >
        Send to GRN Check
      </Button>
    </Card>
  );
}
