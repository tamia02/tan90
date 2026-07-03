import { useState } from 'react';
import { CheckCircle2, PackagePlus, Trash2, XCircle } from 'lucide-react';
import AdminSubNav from '../components/AdminSubNav';
import { Button, Card, CheckboxRow, EmptyState, Field, Input, PageHeader, Select } from '../components/ui';
import { useStore } from '../lib/store';
import type { SkuMasterEntry } from '../lib/types';

const categories = ['Chemical — Raw Material', 'Chemical — Trial', 'Packaging', 'Consumable', 'Other'];
const units = ['KG', 'LTR', 'MT', 'NOS', 'BOX'];

export default function SkuMaster() {
  const { skuMaster, dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [unit, setUnit] = useState(units[0]);
  const [defaultBin, setDefaultBin] = useState('');
  const [mapped, setMapped] = useState(true);

  function reset() {
    setSku('');
    setCategory(categories[0]);
    setUnit(units[0]);
    setDefaultBin('');
    setMapped(true);
    setAdding(false);
  }

  function add() {
    const entry: SkuMasterEntry = {
      id: `SKU-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      sku: sku.trim(),
      category,
      unit,
      defaultBin: defaultBin.trim(),
      mapped,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_SKU', payload: entry });
    reset();
  }

  function remove(entry: SkuMasterEntry) {
    if (window.confirm(`Remove "${entry.sku}" from the SKU master? Any inward entry using this SKU will fail the mapped-SKU check.`)) {
      dispatch({ type: 'DELETE_SKU', payload: { id: entry.id } });
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="SKU Master"
        subtitle="Every mapped product — Guard Bill Scan checks new entries against this list."
        action={
          <Button variant="secondary" onClick={() => setAdding((a) => !a)}>
            <PackagePlus size={15} />
            {adding ? 'Cancel' : 'Add SKU'}
          </Button>
        }
      />
      <AdminSubNav />

      {adding && (
        <Card className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Field label="SKU / Material name">
            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Sodium Fluoride" required />
          </Field>
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Unit">
            <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              {units.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </Select>
          </Field>
          <Field label="Default bin">
            <Input value={defaultBin} onChange={(e) => setDefaultBin(e.target.value)} placeholder="BHW-CHEM-A1" />
          </Field>
          <div className="sm:col-span-2">
            <CheckboxRow checked={mapped} onChange={(e) => setMapped(e.target.checked)}>
              Mapped — passes the "SKU not mapped" validation check
            </CheckboxRow>
          </div>
          <Button className="sm:col-span-2" onClick={add} disabled={!sku.trim()}>
            Add to master
          </Button>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        {skuMaster.length === 0 ? (
          <EmptyState text="No SKUs mapped yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-4 py-2.5 font-medium">SKU</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Unit</th>
                  <th className="px-4 py-2.5 font-medium">Default Bin</th>
                  <th className="px-4 py-2.5 font-medium">Mapped</th>
                  <th className="px-4 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {skuMaster.map((s, i) => (
                  <tr key={s.id} style={{ borderTop: i === 0 ? undefined : '1px solid var(--border)' }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>{s.sku}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>{s.category}</td>
                    <td className="px-4 py-2.5">{s.unit}</td>
                    <td className="px-4 py-2.5">{s.defaultBin || '—'}</td>
                    <td className="px-4 py-2.5">
                      {s.mapped ? <CheckCircle2 size={16} color="var(--status-good)" /> : <XCircle size={16} color="var(--status-critical)" />}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => remove(s)} aria-label={`Remove ${s.sku}`} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--status-critical)' }}>
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
    </div>
  );
}
