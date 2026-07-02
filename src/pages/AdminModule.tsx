import { Card, PageHeader } from '../components/ui';
import { resetDemo } from '../lib/store';
import { Button } from '../components/ui';

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
  ['Critical', ['Guard Portal', 'Vendor Portal', 'Unloading Desk', 'Finance Review']],
  ['High', ['Validation Issues', 'Camera / PWA capture', 'GPS', 'Product line editing', 'GST verification', 'Email alerts']],
  ['Medium', ['Put-away execution', 'Reports', 'Audit trail', 'Settings', 'CSV cleanup', 'GST status consistency']],
  ['Low', ['Advanced analytics', 'Vendor rating', 'Zoho live sync', 'OCR provider selection', 'Mobile polish']],
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
        Integrations
      </h2>
      <Card className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        GST, Maps, SMTP and Zoho credentials are configured server-side and never rendered in this UI — this prototype
        stores demo state only in the browser (localStorage), with no keys or secrets involved.
      </Card>
    </div>
  );
}
