import AdminSubNav from '../components/AdminSubNav';
import { Button, Card, PageHeader } from '../components/ui';
import { resetDemo } from '../lib/store';

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
  ['Medium', ['Put-away execution — done', 'Audit trail — done', 'Settings — done', 'Reports — done', 'CSV cleanup — not applicable yet (no CSV import)', 'GST status consistency — done']],
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
        title="Admin Overview"
        subtitle="Role ownership and the production-readiness checklist."
        action={
          <Button variant="secondary" onClick={resetDemo}>
            Reset demo data
          </Button>
        }
      />
      <AdminSubNav />

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
      <div className="flex flex-col gap-3">
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
    </div>
  );
}
