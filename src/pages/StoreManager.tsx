import { useState } from 'react';
import { useStore } from '../lib/store';
import { Button, Card, EmptyState, Field, Input, PageHeader } from '../components/ui';
import { GateStatusBadge } from '../components/Badge';
import { gateEntryLabel } from '../lib/derived';
import { Boxes, PackageCheck } from 'lucide-react';
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

export default function StoreManager() {
  const { gateEntries, unloadingRecords, grnRecords, ledger } = useStore();
  const [tab, setTab] = useState<'unloading' | 'putaway' | 'ledger'>('unloading');

  const readyForUnloading = gateEntries.filter((g) => g.status === 'validated');
  const inUnloading = gateEntries.filter((g) => g.status === 'unloading' || g.status === 'grn');

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Store Manager" subtitle="Unloading, put-away and the immutable stock ledger." />

      <div className="flex gap-2 mb-5">
        {(
          [
            ['unloading', 'Unloading Desk'],
            ['putaway', 'Put-away'],
            ['ledger', 'Immutable Ledger'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className="px-3.5 py-2 rounded-lg text-sm font-medium border"
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

      {tab === 'unloading' && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Cleared validation, ready for unloading
          </h2>
          {readyForUnloading.length === 0 && <EmptyState text="Nothing waiting — resolve issues in Validation Engine first." />}
          {readyForUnloading.map((g) => (
            <UnloadingCard key={g.id} gateId={g.id} label={gateEntryLabel(g)} />
          ))}

          <h2 className="text-sm font-semibold mt-4" style={{ color: 'var(--text-primary)' }}>
            Unloaded / in GRN
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
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((l) => (
                    <tr key={l.id} style={{ borderTop: '1px solid var(--border)' }}>
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
                    </tr>
                  ))}
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

function UnloadingCard({ gateId, label }: { gateId: string; label: string }) {
  const { dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [boxCount, setBoxCount] = useState('');
  const [stagingArea, setStagingArea] = useState('');
  const [unloadedBy, setUnloadedBy] = useState('');
  const [podLrRef, setPodLrRef] = useState('');

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
          <Button
            className="sm:col-span-2"
            onClick={complete}
            disabled={!boxCount || !stagingArea || !unloadedBy || !podLrRef}
          >
            Save &amp; send to GRN / QC
          </Button>
        </div>
      )}
    </Card>
  );
}
