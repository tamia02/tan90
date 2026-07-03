import { useState } from 'react';
import { useStore } from '../lib/store';
import { Button, Card, CheckboxRow, EmptyState, Field, Input, PageHeader } from '../components/ui';
import { GateStatusBadge } from '../components/Badge';
import { gateEntryLabel } from '../lib/derived';
import { Camera, CheckCircle2 } from 'lucide-react';

export default function UnloadingDesk() {
  const { gateEntries, unloadingRecords } = useStore();
  const readyForUnloading = gateEntries.filter((g) => g.status === 'validated');
  const inUnloading = gateEntries.filter((g) => g.status === 'unloading' || g.status === 'grn' || g.status === 'qc_done');

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Unloading Desk" subtitle="Box count, POD/LR, staging area and seal/load proof — then send to QC Check." />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Cleared validation, ready for unloading
        </h2>
        {readyForUnloading.length === 0 && <EmptyState text="Nothing waiting — resolve issues in Validation Engine first." />}
        {readyForUnloading.map((g) => (
          <UnloadingCard key={g.id} gateId={g.id} label={gateEntryLabel(g)} />
        ))}

        <h2 className="text-sm font-semibold mt-4" style={{ color: 'var(--text-primary)' }}>
          Unloaded / in QC or GRN Check
        </h2>
        {inUnloading.length === 0 && <EmptyState text="No entries currently unloading." />}
        {inUnloading.map((g) => {
          const record = unloadingRecords.find((u) => u.gateEntryId === g.id);
          return (
            <Card key={g.id} className="p-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {gateEntryLabel(g)}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {record ? `${record.boxCount} boxes · ${record.stagingArea} · POD/LR ${record.podLrRef}` : 'No unloading record'}
                </div>
              </div>
              <GateStatusBadge status={g.status} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function UnloadingCard({ gateId, label }: { gateId: string; label: string }) {
  const { dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [boxCount, setBoxCount] = useState('');
  const [stagingArea, setStagingArea] = useState('');
  const [unloadedBy, setUnloadedBy] = useState('');
  const [podLrRef, setPodLrRef] = useState('');
  const [proofCaptured, setProofCaptured] = useState(false);

  function complete() {
    const startedAt = new Date().toISOString();
    dispatch({
      type: 'START_UNLOADING',
      payload: { gateEntryId: gateId, boxCount: Number(boxCount) || 0, stagingArea, unloadedBy, podLrRef, startedAt },
    });
    dispatch({ type: 'COMPLETE_UNLOADING', payload: { gateEntryId: gateId, completedAt: new Date().toISOString() } });
    setOpen(false);
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
        <Button variant={open ? 'secondary' : 'primary'} onClick={() => setOpen((o) => !o)}>
          {open ? 'Cancel' : 'Complete unloading'}
        </Button>
      </div>
      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <Field label="Box count">
            <Input type="number" value={boxCount} onChange={(e) => setBoxCount(e.target.value)} required />
          </Field>
          <Field label="Staging area">
            <Input value={stagingArea} onChange={(e) => setStagingArea(e.target.value)} placeholder="Staging Bay 2" required />
          </Field>
          <Field label="Unloaded by">
            <Input value={unloadedBy} onChange={(e) => setUnloadedBy(e.target.value)} placeholder="Store executive name" required />
          </Field>
          <Field label="POD / LR reference">
            <Input value={podLrRef} onChange={(e) => setPodLrRef(e.target.value)} placeholder="LR-88213" required />
          </Field>

          <button
            type="button"
            onClick={() => setProofCaptured(true)}
            className="sm:col-span-2 flex items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed py-4 text-sm font-medium"
            style={{
              borderColor: proofCaptured ? 'var(--status-good)' : 'var(--border-strong)',
              color: proofCaptured ? 'var(--status-good)' : 'var(--text-muted)',
            }}
          >
            {proofCaptured ? <CheckCircle2 size={16} /> : <Camera size={16} />}
            {proofCaptured ? 'Seal / load proof captured' : 'Capture seal / load stamp proof'}
          </button>
          <div className="sm:col-span-2">
            <CheckboxRow checked={proofCaptured} onChange={(e) => setProofCaptured(e.target.checked)}>
              Stamped proof confirmed for this unloading
            </CheckboxRow>
          </div>

          <Button
            className="sm:col-span-2"
            onClick={complete}
            disabled={!boxCount || !stagingArea || !unloadedBy || !podLrRef || !proofCaptured}
          >
            Save &amp; send to QC Check
          </Button>
        </div>
      )}
    </Card>
  );
}
