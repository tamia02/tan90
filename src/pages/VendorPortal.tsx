import { useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, FileText, Loader2, Sparkles, Truck, UploadCloud } from 'lucide-react';
import { useStore } from '../lib/store';
import { Button, Card, Field, Input, PageHeader } from '../components/ui';
import type { VendorSubmission } from '../lib/types';
import { fetchZohoInvoiceForPO } from '../lib/zoho';

const steps = ['PO Number', 'Invoice', 'E-way Bill', 'LR / POD'];

export default function VendorPortal() {
  const { vendorSubmissions, zoho, dispatch } = useStore();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [zohoState, setZohoState] = useState<'idle' | 'loading' | 'synced' | 'not_found'>('idle');
  const [form, setForm] = useState({
    poNumber: '',
    vendorName: '',
    invoiceNumber: '',
    invoiceQty: '',
    material: '',
    ewayBillNumber: '',
    hasInvoice: false,
    hasEwayBill: false,
    hasLrPod: false,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function fetchFromZoho() {
    setZohoState('loading');
    const record = await fetchZohoInvoiceForPO(form.poNumber);
    if (!record) {
      setZohoState('not_found');
      return;
    }
    setForm((f) => ({
      ...f,
      invoiceNumber: record.invoiceNumber,
      invoiceQty: String(record.invoiceQty),
      material: f.material || record.material,
      ewayBillNumber: record.ewayBillNumber,
      hasInvoice: true,
      hasEwayBill: true,
    }));
    dispatch({ type: 'ZOHO_SYNCED' });
    setZohoState('synced');
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
              setZohoState('idle');
              setForm({ poNumber: '', vendorName: '', invoiceNumber: '', invoiceQty: '', material: '', ewayBillNumber: '', hasInvoice: false, hasEwayBill: false, hasLrPod: false });
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
            {zoho.connected ? (
              <button
                type="button"
                onClick={fetchFromZoho}
                disabled={zohoState === 'loading' || !form.poNumber}
                className="flex items-center justify-center gap-2 rounded-[var(--radius)] py-3 text-sm font-medium w-full disabled:opacity-50"
                style={{ background: 'var(--brand-bg)', color: 'var(--brand)' }}
              >
                {zohoState === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {zohoState === 'loading' ? 'Fetching from Zoho…' : 'Fetch from Zoho'}
              </button>
            ) : (
              <p className="text-xs rounded-[var(--radius)] px-3 py-2" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                Zoho isn't connected yet (Admin → Zoho Integration) — enter invoice details manually below.
              </p>
            )}
            {zohoState === 'not_found' && (
              <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--status-warning)' }}>
                <AlertTriangle size={13} /> No invoice found in Zoho for this PO — enter details manually.
              </p>
            )}
            {zohoState === 'synced' && (
              <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--status-good)' }}>
                <CheckCircle2 size={13} /> Invoice and e-way bill auto-filled from Zoho.
              </p>
            )}

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
          <div className="flex flex-col gap-4">
            <UploadTile
              icon={<FileText size={18} />}
              label={form.hasEwayBill ? 'E-way bill attached' : 'Upload e-way bill'}
              done={form.hasEwayBill}
              onClick={() => update('hasEwayBill', true)}
            />
            <Field label="E-way bill number" hint={form.ewayBillNumber ? 'Auto-filled from Zoho' : undefined}>
              <Input value={form.ewayBillNumber} onChange={(e) => update('ewayBillNumber', e.target.value)} placeholder="EWB-3312890021" />
            </Field>
          </div>
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
      className="flex items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed py-8 text-sm font-medium w-full"
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
