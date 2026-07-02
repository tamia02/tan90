import { useState } from 'react';
import { useStore } from '../lib/store';
import { Button, Card, EmptyState, PageHeader, Select, Textarea } from '../components/ui';
import { VendorStatusBadge } from '../components/Badge';
import type { FinanceRecord, VendorClosureStatus } from '../lib/types';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function FinanceModule() {
  const { finance } = useStore();

  const totals = finance.reduce(
    (acc, f) => {
      acc.invoiceValue += f.invoiceValue;
      acc.finalPayable += f.finalPayable;
      acc.deductions += f.deductions.defective + f.deductions.rejected + f.deductions.missing;
      return acc;
    },
    { invoiceValue: 0, finalPayable: 0, deductions: 0 },
  );

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Finance Module" subtitle="Deductions, final payable and vendor closure status." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Total invoice value
          </div>
          <div className="text-2xl font-semibold mt-1 tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {inr.format(totals.invoiceValue)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Total deductions
          </div>
          <div className="text-2xl font-semibold mt-1 tabular-nums" style={{ color: 'var(--status-critical)' }}>
            {inr.format(totals.deductions)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Total final payable
          </div>
          <div className="text-2xl font-semibold mt-1 tabular-nums" style={{ color: 'var(--status-good)' }}>
            {inr.format(totals.finalPayable)}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        {finance.length === 0 && <EmptyState text="No GRN has posted through to finance yet." />}
        {finance.map((f) => (
          <FinanceCard key={f.gateEntryId} record={f} />
        ))}
      </div>
    </div>
  );
}

function FinanceCard({ record }: { record: FinanceRecord }) {
  const { dispatch } = useStore();
  const [status, setStatus] = useState<VendorClosureStatus>(record.vendorStatus);
  const [notes, setNotes] = useState(record.notes ?? '');

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {record.vendorName}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Invoice {record.invoiceNumber} · Rate {inr.format(record.ratePerUnit)}/unit
          </div>
        </div>
        <VendorStatusBadge status={record.vendorStatus} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
        <Money label="Invoice value" value={record.invoiceValue} />
        <Money label="Accepted value" value={record.acceptedValue} tone="var(--status-good)" />
        <Money label="Deductions" value={record.deductions.defective + record.deductions.rejected + record.deductions.missing} tone="var(--status-critical)" />
        <Money label="Final payable" value={record.finalPayable} tone="var(--brand)" />
      </div>

      <div className="text-xs mt-3 grid grid-cols-3 gap-2" style={{ color: 'var(--text-muted)' }}>
        <span>Defective: {inr.format(record.deductions.defective)}</span>
        <span>Rejected: {inr.format(record.deductions.rejected)}</span>
        <span>Missing: {inr.format(record.deductions.missing)}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2 mt-4">
        <Select value={status} onChange={(e) => setStatus(e.target.value as VendorClosureStatus)}>
          <option value="pending">Pending</option>
          <option value="cleared">Cleared</option>
          <option value="hold">Hold</option>
        </Select>
        <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Debit note / claim reference" className="resize-none" />
        <Button
          onClick={() => dispatch({ type: 'SET_VENDOR_STATUS', payload: { gateEntryId: record.gateEntryId, vendorStatus: status, notes } })}
        >
          Update
        </Button>
      </div>
    </Card>
  );
}

function Money({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="font-semibold tabular-nums" style={{ color: tone ?? 'var(--text-primary)' }}>
        {inr.format(value)}
      </div>
    </div>
  );
}
