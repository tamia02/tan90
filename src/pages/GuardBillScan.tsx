import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2, MapPin, Timer } from 'lucide-react';
import { useStore } from '../lib/store';
import GuardSubNav from '../components/GuardSubNav';
import { Button, Card, CheckboxRow, Field, Input, PageHeader, Select, Textarea } from '../components/ui';
import type { EntryType, GateEntry, ValidationIssue } from '../lib/types';
import { findPoMaster, isSkuMapped } from '../lib/poMaster';

const entryTypes: { value: EntryType; label: string }[] = [
  { value: 'inward', label: 'Inward' },
  { value: 'outward', label: 'Outward' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'loading', label: 'Loading' },
];

function nextGateId() {
  return `GE-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function GuardBillScan() {
  const { gateEntries, vendorSubmissions, dispatch } = useStore();
  const navigate = useNavigate();
  const [entryType, setEntryType] = useState<EntryType>('inward');
  const [billScanned, setBillScanned] = useState(false);
  const [gps, setGps] = useState('');
  const [saved, setSaved] = useState<{ gate: GateEntry; issues: ValidationIssue[] } | null>(null);

  const [form, setForm] = useState({
    poNumber: '',
    vendorName: '',
    vendorGst: '',
    invoiceNumber: '',
    invoiceQty: '',
    rate: '',
    material: '',
    vehicleNumber: '',
    driverName: '',
    transporter: '',
    location: 'Bhiwandi',
    remarks: '',
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function useGps() {
    setGps('19.2967 N, 73.0631 E (captured)');
  }

  function saveEntry(e: React.FormEvent) {
    e.preventDefault();
    const createdAt = new Date();
    const slaDeadline = new Date(createdAt.getTime() + 12 * 3_600_000);
    const id = nextGateId();

    const gate: GateEntry = {
      id,
      gateNo: `GATE-${id.split('-')[1]}`,
      entryType,
      poNumber: form.poNumber || undefined,
      vendorName: form.vendorName || undefined,
      vendorGst: form.vendorGst || undefined,
      invoiceNumber: form.invoiceNumber || undefined,
      invoiceQty: form.invoiceQty ? Number(form.invoiceQty) : undefined,
      rate: form.rate ? Number(form.rate) : undefined,
      material: form.material || undefined,
      vehicleNumber: form.vehicleNumber,
      driverName: form.driverName,
      transporter: form.transporter || undefined,
      location: form.location,
      gps: gps || undefined,
      billScanned,
      remarks: form.remarks || undefined,
      status: 'pending_validation',
      createdAt: createdAt.toISOString(),
      slaDeadline: slaDeadline.toISOString(),
    };

    const issues: ValidationIssue[] = [];
    function raise(code: string, title: string, description: string, severity: ValidationIssue['severity']) {
      issues.push({
        id: `VI-${Math.floor(Math.random() * 90000)}`,
        gateEntryId: id,
        code,
        title,
        description,
        severity,
        status: 'open',
        raisedAt: createdAt.toISOString(),
      });
    }

    if (entryType === 'inward') {
      const master = form.poNumber ? findPoMaster(form.poNumber) : undefined;

      if (!form.poNumber) {
        raise('PO_MISSING', 'PO Missing', 'PO number not found for this inward entry', 'hardFail');
      }

      const duplicateInvoice = form.invoiceNumber && gateEntries.some((g) => g.invoiceNumber?.toLowerCase() === form.invoiceNumber.toLowerCase());
      if (duplicateInvoice) {
        raise('DUP_INVOICE', 'Duplicate Invoice', 'Possible duplicate invoice detected', 'hardFail');
      }

      const duplicateVehicle = gateEntries.some((g) => g.status !== 'closed' && g.vehicleNumber.toLowerCase() === form.vehicleNumber.toLowerCase());
      if (duplicateVehicle) {
        raise('DUP_VEHICLE', 'Duplicate Vehicle', 'This vehicle already has an open, unclosed gate entry', 'warning');
      }

      if (!form.material) {
        raise('PRODUCT_LINE_MISSING', 'Product Line Missing', 'No material/SKU line entered for this inward entry', 'hardFail');
      } else if (!isSkuMapped(form.material)) {
        raise('SKU_NOT_MAPPED', 'SKU Not Mapped', `"${form.material}" is not in the mapped SKU master — map it before GRN`, 'hardFail');
      }

      if (form.poNumber && !master) {
        raise('PO_NOT_FOUND', 'PO Not Found', `${form.poNumber} was not found in PO master data`, 'hardFail');
      }

      if (master && form.rate && Number(form.rate) !== master.expectedRate) {
        raise('RATE_MISMATCH', 'Rate Mismatch', `Entered rate ₹${form.rate}/unit does not match PO rate ₹${master.expectedRate}/unit`, 'redFlag');
      }

      if (master && form.invoiceQty && Number(form.invoiceQty) !== master.expectedQty) {
        raise('QTY_MISMATCH', 'Quantity Mismatch', `Invoice qty ${form.invoiceQty} does not match PO qty ${master.expectedQty}`, 'redFlag');
      }

      if (master && form.vendorGst && form.vendorGst.trim().toUpperCase() !== master.vendorGst.toUpperCase()) {
        raise('GST_MISMATCH', 'GST Mismatch', `Entered GST does not match the GST on file for ${master.vendorName}`, 'redFlag');
      }

      const vendorHasLrPod = form.poNumber && vendorSubmissions.some((v) => v.poNumber.toLowerCase() === form.poNumber.toLowerCase() && v.hasLrPod);
      if (form.poNumber && !vendorHasLrPod) {
        raise('POD_LR_EARLY', 'POD/LR Missing At Gate', 'Vendor has not pre-uploaded LR/POD for this PO — confirm at unloading', 'redFlag');
      }

      if (!gps) {
        raise('GPS_MISSING', 'GPS Missing', 'Gate entry saved without GPS location', 'warning');
      }
    }

    dispatch({ type: 'ADD_GATE_ENTRY', payload: gate, issues });
    setSaved({ gate, issues });
  }

  if (saved) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="p-6 text-center">
          <CheckCircle2 size={40} color="var(--status-good)" className="mx-auto mb-3" />
          <h1 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            Gate entry saved
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {saved.gate.gateNo} · 12-hour GRN SLA timer started.
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            <Timer size={13} /> SLA deadline {new Date(saved.gate.slaDeadline).toLocaleString()}
          </div>

          {saved.issues.length > 0 ? (
            <p className="text-sm mt-4 rounded-[var(--radius)] p-3" style={{ background: 'var(--status-critical-bg)', color: 'var(--status-critical)' }}>
              {saved.issues.length} validation issue{saved.issues.length > 1 ? 's' : ''} raised — sent to Validation Engine
              before unloading can start.
            </p>
          ) : (
            <p className="text-sm mt-4 rounded-[var(--radius)] p-3" style={{ background: 'var(--status-good-bg)', color: 'var(--status-good)' }}>
              No issues found. Cleared straight to unloading.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <Button variant="secondary" className="flex-1" onClick={() => setSaved(null)}>
              New gate entry
            </Button>
            <Button className="flex-1" onClick={() => navigate('/guard/entries')}>
              Guard Entries
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Bill Scan" subtitle="Scan bill, capture vehicle, driver and GPS. Saving starts the 12-hour GRN SLA timer." />
      <GuardSubNav />

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {entryTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => setEntryType(t.value)}
            className="px-3.5 py-2 rounded-[var(--radius)] text-sm font-medium whitespace-nowrap border"
            style={{
              borderColor: entryType === t.value ? 'var(--brand)' : 'var(--border)',
              background: entryType === t.value ? 'var(--brand-bg)' : 'var(--surface-3)',
              color: entryType === t.value ? 'var(--brand)' : 'var(--text-secondary)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={saveEntry}>
        <Card className="p-4 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setBillScanned(true)}
            className="flex items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed py-6 text-sm font-medium"
            style={{
              borderColor: billScanned ? 'var(--status-good)' : 'var(--border-strong)',
              color: billScanned ? 'var(--status-good)' : 'var(--text-muted)',
            }}
          >
            {billScanned ? <CheckCircle2 size={18} /> : <Camera size={18} />}
            {billScanned ? 'Bill scanned' : 'Scan bill (camera) or tap to upload'}
          </button>

          {entryType === 'inward' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="PO Number">
                  <Input value={form.poNumber} onChange={(e) => update('poNumber', e.target.value)} placeholder="PO RM 2627 0031" />
                </Field>
                <Field label="Vendor">
                  <Input value={form.vendorName} onChange={(e) => update('vendorName', e.target.value)} placeholder="Vendor name" required />
                </Field>
                <Field label="Invoice Number">
                  <Input value={form.invoiceNumber} onChange={(e) => update('invoiceNumber', e.target.value)} placeholder="INV/1187" />
                </Field>
                <Field label="Invoice Qty">
                  <Input type="number" value={form.invoiceQty} onChange={(e) => update('invoiceQty', e.target.value)} placeholder="700" />
                </Field>
                <Field label="Rate (₹ / unit)">
                  <Input type="number" value={form.rate} onChange={(e) => update('rate', e.target.value)} placeholder="42" />
                </Field>
                <Field label="Vendor GST">
                  <Input value={form.vendorGst} onChange={(e) => update('vendorGst', e.target.value)} placeholder="27AACCH1234K1Z5" />
                </Field>
                <Field label="Material / SKU">
                  <Input value={form.material} onChange={(e) => update('material', e.target.value)} placeholder="Sodium Fluoride" />
                </Field>
                <Field label="Transporter">
                  <Input value={form.transporter} onChange={(e) => update('transporter', e.target.value)} placeholder="Transporter name" />
                </Field>
              </div>
            </>
          )}

          {entryType === 'outward' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Destination">
                <Input value={form.material} onChange={(e) => update('material', e.target.value)} placeholder="Destination" />
              </Field>
              <Field label="Dispatch reference">
                <Input value={form.poNumber} onChange={(e) => update('poNumber', e.target.value)} placeholder="Dispatch ref" />
              </Field>
            </div>
          )}

          {entryType === 'visitor' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Visitor name">
                <Input value={form.vendorName} onChange={(e) => update('vendorName', e.target.value)} placeholder="Visitor name" required />
              </Field>
              <Field label="Company / Purpose">
                <Input value={form.material} onChange={(e) => update('material', e.target.value)} placeholder="Purpose of visit" />
              </Field>
              <Field label="Person to meet">
                <Input value={form.remarks} onChange={(e) => update('remarks', e.target.value)} placeholder="Employee name" />
              </Field>
            </div>
          )}

          {entryType === 'loading' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Transporter">
                <Input value={form.transporter} onChange={(e) => update('transporter', e.target.value)} placeholder="Transporter" />
              </Field>
              <Field label="Loading area">
                <Input value={form.material} onChange={(e) => update('material', e.target.value)} placeholder="Loading bay" />
              </Field>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Vehicle Number">
              <Input value={form.vehicleNumber} onChange={(e) => update('vehicleNumber', e.target.value)} placeholder="MH 04 GT 5521" required />
            </Field>
            <Field label="Driver Name">
              <Input value={form.driverName} onChange={(e) => update('driverName', e.target.value)} placeholder="Driver name" required />
            </Field>
            <Field label="Location">
              <Select value={form.location} onChange={(e) => update('location', e.target.value)}>
                <option>Bhiwandi</option>
                <option>Bhopal</option>
                <option>Chennai</option>
                <option>Delhi NCR</option>
              </Select>
            </Field>
            <Field label="GPS">
              <Button type="button" variant="secondary" onClick={useGps} className="w-full justify-start">
                <MapPin size={15} />
                {gps || 'Use current GPS'}
              </Button>
            </Field>
          </div>

          <Field label="Remarks">
            <Textarea rows={2} value={form.remarks} onChange={(e) => update('remarks', e.target.value)} placeholder="Optional notes" />
          </Field>

          <CheckboxRow checked={billScanned} onChange={(e) => setBillScanned(e.target.checked)}>
            Bill / document scan confirmed
          </CheckboxRow>

          <Button type="submit" className="w-full sm:w-auto sm:self-end">
            Save gate entry &amp; send to unloading
          </Button>
        </Card>
      </form>
    </div>
  );
}
