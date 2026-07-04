import { useState } from 'react';
import { Boxes, CheckCircle2 } from 'lucide-react';
import { useStore } from '../lib/store';
import VendorSubNav from '../components/VendorSubNav';
import { Button, Card, EmptyState, Field, Input, PageHeader, Textarea } from '../components/ui';
import type { VendorStockUpdate as VendorStockUpdateEntry } from '../lib/types';

export default function VendorStockUpdate() {
  const { auth, vendorStockUpdates, dispatch } = useStore();
  const vendorName = auth?.name ?? 'Unknown Vendor';
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('KG');
  const [note, setNote] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const mine = vendorStockUpdates.filter((u) => u.vendorName === vendorName);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const entry: VendorStockUpdateEntry = {
      id: `VSU-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      vendorName,
      material: material.trim(),
      quantity: Number(quantity) || 0,
      unit: unit.trim() || 'KG',
      note: note.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_VENDOR_STOCK_UPDATE', payload: entry });
    setMaterial('');
    setQuantity('');
    setNote('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Stock Update" subtitle="Tell the warehouse what you have ready to dispatch — Admin can see every update and when it was made." />
      <VendorSubNav />

      <Card className="p-4 mb-6">
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Field label="Material">
            <Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Sodium Fluoride" required />
          </Field>
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Quantity">
              <Input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="500" required />
            </Field>
            <Field label="Unit">
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="KG" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Note (optional)">
              <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ready to dispatch against next PO" />
            </Field>
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={!material.trim() || !quantity}>
              <Boxes size={15} />
              Update stock
            </Button>
            {justSaved && (
              <span className="text-xs flex items-center gap-1" style={{ color: 'var(--status-good)' }}>
                <CheckCircle2 size={14} /> Saved — visible to Admin
              </span>
            )}
          </div>
        </form>
      </Card>

      <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
        Your update history
      </h2>
      <div className="flex flex-col gap-2">
        {mine.length === 0 && <EmptyState text="No stock updates yet — log your first one above." />}
        {mine.map((u) => (
          <Card key={u.id} className="p-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {u.material}
              </div>
              {u.note && (
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {u.note}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {u.quantity} {u.unit}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Updated {new Date(u.updatedAt).toLocaleString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
