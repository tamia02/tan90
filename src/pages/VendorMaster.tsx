import { useState } from 'react';
import { Boxes, CheckCircle2, Trash2, UserPlus, XCircle } from 'lucide-react';
import AdminSubNav from '../components/AdminSubNav';
import { Button, Card, CheckboxRow, EmptyState, Field, Input, PageHeader } from '../components/ui';
import { useStore } from '../lib/store';
import type { VendorMasterEntry } from '../lib/types';

export default function VendorMaster() {
  const { vendorMaster, vendorStockUpdates, dispatch } = useStore();
  const stockUpdates = [...vendorStockUpdates].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const [adding, setAdding] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [category, setCategory] = useState('Raw material');
  const [active, setActive] = useState(true);

  function reset() {
    setVendorName('');
    setGstNumber('');
    setContactPhone('');
    setContactEmail('');
    setCategory('Raw material');
    setActive(true);
    setAdding(false);
  }

  function add() {
    const entry: VendorMasterEntry = {
      id: `VM-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      vendorName: vendorName.trim(),
      gstNumber: gstNumber.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim() || undefined,
      category,
      active,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_VENDOR_MASTER', payload: entry });
    reset();
  }

  function remove(entry: VendorMasterEntry) {
    if (window.confirm(`Remove "${entry.vendorName}" from the vendor master? Gate entries will no longer GST-match against them.`)) {
      dispatch({ type: 'DELETE_VENDOR_MASTER', payload: { id: entry.id } });
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Vendor Master"
        subtitle="Every registered vendor and the GST on file — used for the gate's GST-mismatch check."
        action={
          <Button variant="secondary" onClick={() => setAdding((a) => !a)}>
            <UserPlus size={15} />
            {adding ? 'Cancel' : 'Add vendor'}
          </Button>
        }
      />
      <AdminSubNav />

      {adding && (
        <Card className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Field label="Vendor name">
            <Input value={vendorName} onChange={(e) => setVendorName(e.target.value)} placeholder="Company name" required />
          </Field>
          <Field label="GST number">
            <Input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="27AACCH1234K1Z5" required />
          </Field>
          <Field label="Contact phone">
            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91 22 6712 4400" />
          </Field>
          <Field label="Contact email">
            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="accounts@vendor.example" />
          </Field>
          <Field label="Category">
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Raw material" />
          </Field>
          <div className="sm:col-span-2">
            <CheckboxRow checked={active} onChange={(e) => setActive(e.target.checked)}>
              Active vendor
            </CheckboxRow>
          </div>
          <Button className="sm:col-span-2" onClick={add} disabled={!vendorName.trim() || !gstNumber.trim()}>
            Add to master
          </Button>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        {vendorMaster.length === 0 ? (
          <EmptyState text="No vendors registered yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-4 py-2.5 font-medium">Vendor</th>
                  <th className="px-4 py-2.5 font-medium">GST</th>
                  <th className="px-4 py-2.5 font-medium">Contact</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Active</th>
                  <th className="px-4 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {vendorMaster.map((v, i) => (
                  <tr key={v.id} style={{ borderTop: i === 0 ? undefined : '1px solid var(--border)' }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>{v.vendorName}</td>
                    <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{v.gstNumber}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{v.contactPhone}</td>
                    <td className="px-4 py-2.5">{v.category}</td>
                    <td className="px-4 py-2.5">
                      {v.active ? <CheckCircle2 size={16} color="var(--status-good)" /> : <XCircle size={16} color="var(--text-muted)" />}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => remove(v)} aria-label={`Remove ${v.vendorName}`} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--status-critical)' }}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <h2 className="font-semibold text-sm mt-8 mb-3 flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
        <Boxes size={15} />
        Vendor stock updates
      </h2>
      <Card className="p-0 overflow-hidden">
        {stockUpdates.length === 0 ? (
          <EmptyState text="No vendor stock updates yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-4 py-2.5 font-medium">Vendor</th>
                  <th className="px-4 py-2.5 font-medium">Material</th>
                  <th className="px-4 py-2.5 font-medium">Quantity</th>
                  <th className="px-4 py-2.5 font-medium">Note</th>
                  <th className="px-4 py-2.5 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {stockUpdates.map((u, i) => (
                  <tr key={u.id} style={{ borderTop: i === 0 ? undefined : '1px solid var(--border)' }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>{u.vendorName}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>{u.material}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text-primary)' }}>{u.quantity} {u.unit}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{u.note ?? '—'}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(u.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
