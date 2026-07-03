import { useState } from 'react';
import { History, Link2, Loader2, RefreshCw, Unlink } from 'lucide-react';
import { Button, Card, EmptyState, Field, Input, PageHeader } from '../components/ui';
import { resetDemo, useStore } from '../lib/store';

const roles = [
  ['Vendor', 'Upload PO-linked documents, view issue, re-upload correction'],
  ['Guard', 'Gate entry, bill scan, driver/vehicle, GPS, SLA timer'],
  ['Store Executive', 'Unloading, box count, POD/LR, staging'],
  ['Store Manager', 'GRN, put-away, stock posting, issue oversight'],
  ['QC User', 'Accepted/hold/defective/rejected split with reasons'],
  ['Finance', 'Deductions, final payable, vendor claim/debit note'],
  ['Admin / Auditor', 'Settings, GST/email/maps, reports, immutable audit trail'],
];

const checklist: [string, string[]][] = [
  ['Critical', ['Guard Portal — done', 'Vendor Portal — done', 'Unloading Desk — done', 'Finance Review — done', 'Modules kept fully separate (no merged screens) — done', 'One portal open at a time, logout required to switch — done']],
  ['High', ['Validation Issues — done', 'GPS — done', 'Product line / SKU mapping — done', 'QC Check and GRN Check as two separate steps — done', 'Camera / PWA capture — mocked, needs real device camera', 'GST verification — done (offline PO master check, not a live government API)', 'Email alerts — needs SMTP backend']],
  ['Medium', ['Put-away execution — done', 'Audit trail — done', 'Settings — done', 'Reports — not built', 'CSV cleanup — not applicable yet (no CSV import)', 'GST status consistency — done']],
  ['Low', ['Advanced analytics — not built', 'Vendor rating — not built', 'Zoho live sync — mocked, needs real API + backend', 'OCR provider selection — not applicable (no OCR yet)', 'Mobile polish — done, verified at 390px']],
];

const priorityTone: Record<string, string> = {
  Critical: 'var(--status-critical)',
  High: 'var(--status-serious)',
  Medium: 'var(--status-warning)',
  Low: 'var(--text-muted)',
};

export default function AdminModule() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Admin Module"
        subtitle="Settings, role ownership and the production-readiness checklist."
        action={
          <Button variant="secondary" onClick={resetDemo}>
            Reset demo data
          </Button>
        }
      />

      <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Role-wise ownership
      </h2>
      <Card className="p-0 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {roles.map(([role, resp], i) => (
                <tr key={role} style={{ borderTop: i === 0 ? undefined : '1px solid var(--border)' }}>
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                    {role}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                    {resp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Production-ready checklist
      </h2>
      <div className="flex flex-col gap-3 mb-8">
        {checklist.map(([priority, items]) => (
          <Card key={priority} className="p-4">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: priorityTone[priority] }}>
              {priority}
            </span>
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: priorityTone[priority] }} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Zoho Integration
      </h2>
      <ZohoIntegrationPanel />

      <h2 className="text-sm font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
        Immutable Audit Trail
      </h2>
      <AuditLogPanel />

      <h2 className="text-sm font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
        Other Integrations
      </h2>
      <Card className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        GST, Maps and SMTP credentials are configured server-side and never rendered in this UI — this prototype
        stores demo state only in the browser (localStorage), with no keys or secrets involved.
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

function AuditLogPanel() {
  const { auditLog } = useStore();

  return (
    <Card className="p-0 overflow-hidden">
      {auditLog.length === 0 ? (
        <EmptyState text="No actions logged yet — every gate entry, issue decision, GRN post and login will appear here." />
      ) : (
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="px-4 py-2.5 font-medium sticky top-0" style={{ background: 'var(--surface-3)' }}>Timestamp</th>
                <th className="px-4 py-2.5 font-medium sticky top-0" style={{ background: 'var(--surface-3)' }}>Action</th>
                <th className="px-4 py-2.5 font-medium sticky top-0" style={{ background: 'var(--surface-3)' }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry) => (
                <tr key={entry.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="px-4 py-2 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                    {entry.action}
                  </td>
                  <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>
                    {entry.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="px-4 py-2.5 text-xs border-t flex items-center gap-1.5" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        <History size={12} />
        Append-only — every login, gate entry, issue decision, unloading, GRN post and Zoho action is logged automatically. Nothing here can be edited or deleted.
      </div>
    </Card>
  );
}
