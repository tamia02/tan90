import { useState } from 'react';
import { Check, CheckCircle2, FileText, Truck, UploadCloud } from 'lucide-react';
import { useStore } from '../lib/store';
import { Button, Card, Field, Input, PageHeader } from '../components/ui';
import type { VendorSubmission } from '../lib/types';

const steps = ['PO Number', 'Invoice', 'E-way Bill', 'LR / POD'];

export default function VendorPortal() {
  const { vendorSubmissions, dispatch } = useStore();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    poNumber: '',
    vendorName: '',
    invoiceNumber: '',
    invoiceQty: '',
    material: '',
    hasInvoice: false,
    hasEwayBill: false,
    hasLrPod: false,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const poMissing = step === 0 && form.poNumber.trim() === '';

  function submit() {
    const record: VendorSubmission = {
      id: `VS-${Math.floor(Math.random() * 900) + 100}`,
      poNumber: form.poNumber,
      vendorName: form.vendorName || 'Unnamed Vendor',
      invoiceNumber: form.invoiceNumber,
      invoiceQty: Number(form.invoiceQty) || 0,
      material: form.material,
      hasInvoice: form.hasInvoice,
      hasEwayBill: form.hasEwayBill,
      hasLrPod: form.hasLrPod,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_VENDOR_SUBMISSION', payload: record });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="p-6 text-center">
          <CheckCircle2 size={40} color="var(--status-good)" className="mx-auto mb-3" />
          <h1 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            Documents submitted
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            PO {form.poNumber} — the guard at gate can now match this against the physical delivery.
          </p>
          <Button
            className="mt-5"
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setForm({ poNumber: '', vendorName: '', invoiceNumber: '', invoiceQty: '', material: '', hasInvoice: false, hasEwayBill: false, hasLrPod: false });
            }}
          >
            Submit another
          </Button>
        </Card>

        <h2 className="text-sm font-semibold mt-8 mb-2" style={{ color: 'var(--text-primary)' }}>
          Your submissions
        </h2>
        <SubmissionList submissions={vendorSubmissions} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <PageHeader title="Vendor Portal" subtitle="Upload PO-linked documents before the vehicle reaches the gate." />

      <div className="flex items-center gap-1 mb-5">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-7 h-7 rounded-full grid place-items-center text-xs font-semibold"
              style={{
                background: i < step ? 'var(--status-good)' : i === step ? 'var(--brand)' : 'var(--surface-2)',
                color: i <= step ? '#fff' : 'var(--text-muted)',
                border: i > step ? '1px solid var(--border)' : 'none',
              }}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="text-[10px] text-center" style={{ color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <Card className="p-4">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Field label="PO Number" hint={poMissing ? 'PO missing blocks submission' : undefined}>
              <Input value={form.poNumber} onChange={(e) => update('poNumber', e.target.value)} placeholder="PO RM 2627 0020" required />
            </Field>
            <Field label="Vendor name">
              <Input value={form.vendorName} onChange={(e) => update('vendorName', e.target.value)} placeholder="Your company name" required />
            </Field>
            <Field label="Material">
              <Input value={form.material} onChange={(e) => update('material', e.target.value)} placeholder="Material description" />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <UploadTile
              icon={<FileText size={18} />}
              label={form.hasInvoice ? 'Invoice attached' : 'Scan or upload invoice'}
              done={form.hasInvoice}
              onClick={() => update('hasInvoice', true)}
            />
            <Field label="Invoice number">
              <Input value={form.invoiceNumber} onChange={(e) => update('invoiceNumber', e.target.value)} placeholder="INV-4471" />
            </Field>
            <Field label="Invoice quantity">
              <Input type="number" value={form.invoiceQty} onChange={(e) => update('invoiceQty', e.target.value)} placeholder="700" />
            </Field>
          </div>
        )}

        {step === 2 && (
          <UploadTile
            icon={<FileText size={18} />}
            label={form.hasEwayBill ? 'E-way bill attached' : 'Upload e-way bill'}
            done={form.hasEwayBill}
            onClick={() => update('hasEwayBill', true)}
          />
        )}

        {step === 3 && (
          <UploadTile
            icon={<Truck size={18} />}
            label={form.hasLrPod ? 'LR / POD attached' : 'Upload LR / POD / docket'}
            done={form.hasLrPod}
            onClick={() => update('hasLrPod', true)}
          />
        )}

        <div className="flex gap-2 mt-6">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button className="flex-1" disabled={poMissing} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button className="flex-1" onClick={submit}>
              Submit
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function UploadTile({ icon, label, done, onClick }: { icon: React.ReactNode; label: string; done: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 text-sm font-medium w-full"
      style={{ borderColor: done ? 'var(--status-good)' : 'var(--border-strong)', color: done ? 'var(--status-good)' : 'var(--text-muted)' }}
    >
      {done ? <CheckCircle2 size={18} /> : <UploadCloud size={18} />}
      {icon}
      {label}
    </button>
  );
}

function SubmissionList({ submissions }: { submissions: VendorSubmission[] }) {
  return (
    <div className="flex flex-col gap-2">
      {submissions.map((s) => (
        <Card key={s.id} className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {s.poNumber}
            </span>
            <span className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
              {s.status.replace('_', ' ')}
            </span>
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {s.vendorName} · {s.invoiceQty || '—'} qty
          </div>
        </Card>
      ))}
    </div>
  );
}
