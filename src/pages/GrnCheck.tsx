import { useState } from 'react';
import { useStore } from '../lib/store';
import StoreManagerSubNav from '../components/StoreManagerSubNav';
import { Button, Card, EmptyState, Field, Input, PageHeader } from '../components/ui';
import { gateEntryLabel } from '../lib/derived';
import type { QcResult } from '../lib/types';

export default function GrnCheck() {
  const { gateEntries, qcResults } = useStore();
  const readyForGrn = gateEntries.filter((g) => g.status === 'qc_done');

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="GRN Check" subtitle="Post the QC-checked receipt to stock." />
      <StoreManagerSubNav />

      <div className="flex flex-col gap-3">
        {readyForGrn.length === 0 && <EmptyState text="Nothing waiting — QC Check hasn't sent anything through yet." />}
        {readyForGrn.map((g) => {
          const qc = qcResults.find((r) => r.gateEntryId === g.id);
          if (!qc) return null;
          return <GrnCard key={g.id} gateId={g.id} label={gateEntryLabel(g)} qc={qc} />;
        })}
      </div>
    </div>
  );
}

function GrnCard({ gateId, label, qc }: { gateId: string; label: string; qc: QcResult }) {
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
