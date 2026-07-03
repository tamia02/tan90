import { useState } from 'react';
import { Link2, Loader2, RefreshCw, ShieldCheck, Unlink } from 'lucide-react';
import AdminSubNav from '../components/AdminSubNav';
import { Button, Card, Field, Input, PageHeader } from '../components/ui';
import { useStore } from '../lib/store';

export default function Integrations() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Integrations" subtitle="Zoho, GST and the other external systems Tan90 talks to." />
      <AdminSubNav />

      <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Zoho
      </h2>
      <ZohoIntegrationPanel />

      <h2 className="text-sm font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
        GST Verification
      </h2>
      <Card className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-[var(--radius)] grid place-items-center shrink-0" style={{ background: 'var(--status-good-bg)', color: 'var(--status-good)' }}>
          <ShieldCheck size={18} />
        </div>
        <div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Checked against PO master data
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Guard Bill Scan cross-checks the vendor GST entered at the gate against the GST on file for that PO
            (Vendor Master) and raises a Red Flag on mismatch. This is an offline check against your own master
            data — a live government GST API isn't connected yet.
          </p>
        </div>
      </Card>

      <h2 className="text-sm font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
        Other Integrations
      </h2>
      <Card className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Maps and SMTP credentials are configured server-side and never rendered in this UI — this prototype stores
        demo state only in the browser (localStorage), with no keys or secrets involved.
      </Card>
    </div>
  );
}

function ZohoIntegrationPanel() {
  const { zoho, dispatch } = useStore();
  const [orgName, setOrgName] = useState('');
  const [busy, setBusy] = useState<'connect' | 'sync' | null>(null);

  async function connect(e: React.FormEvent) {
    e.preventDefault();
    setBusy('connect');
    await new Promise((r) => setTimeout(r, 900));
    dispatch({ type: 'ZOHO_CONNECT', payload: { orgName: orgName.trim() || 'Tan90 Chemicals Pvt Ltd' } });
    setBusy(null);
  }

  async function syncNow() {
    setBusy('sync');
    await new Promise((r) => setTimeout(r, 900));
    dispatch({ type: 'ZOHO_SYNCED' });
    setBusy(null);
  }

  if (!zoho.connected) {
    return (
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] grid place-items-center shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
            <Link2 size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Not connected
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Connect a Zoho Books/Inventory organization to auto-sync invoice and e-way bill details into the Vendor
              Portal instead of vendors re-keying data.
            </p>
          </div>
        </div>
        <form onSubmit={connect} className="flex flex-col sm:flex-row items-end gap-3 mt-4">
          <div className="flex-1 w-full">
            <Field label="Zoho organization name">
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Tan90 Chemicals Pvt Ltd" />
            </Field>
          </div>
          <Button type="submit" disabled={busy === 'connect'}>
            {busy === 'connect' ? <Loader2 size={15} className="animate-spin" /> : <Link2 size={15} />}
            Connect to Zoho
          </Button>
        </form>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Demo prototype — this simulates the Zoho OAuth connection. No real API credentials are required yet; a
          production build needs a Zoho API Console app (Client ID/Secret + Org ID) and a backend to hold the secret.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] grid place-items-center shrink-0" style={{ background: 'var(--status-good-bg)', color: 'var(--status-good)' }}>
            <Link2 size={18} />
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Connected — {zoho.orgName}
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Connected {zoho.connectedAt && new Date(zoho.connectedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={syncNow} disabled={busy === 'sync'}>
            {busy === 'sync' ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            Sync now
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm(`Disconnect ${zoho.orgName}? Vendors lose "Fetch from Zoho" auto-fill until this is reconnected.`)) {
                dispatch({ type: 'ZOHO_DISCONNECT' });
              }
            }}
          >
            <Unlink size={15} />
            Disconnect
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
        <div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Last synced
          </div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {zoho.lastSyncedAt ? new Date(zoho.lastSyncedAt).toLocaleString() : '—'}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Manual syncs
          </div>
          <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {zoho.syncCount}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Auto-sync scope
          </div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Invoice + E-way Bill
          </div>
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
        Vendors can now use "Fetch from Zoho" on the Invoice step of a new submission to auto-fill invoice number,
        date, quantity and e-way bill number for a known PO.
      </p>
    </Card>
  );
}
