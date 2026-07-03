import { Mail, MessageCircle, Phone } from 'lucide-react';
import { useStore } from '../lib/store';
import { Card, PageHeader } from '../components/ui';
import { roleMeta } from '../lib/auth';

const faqByRole: Partial<Record<string, { q: string; a: string }[]>> = {
  guard: [
    { q: 'A vehicle shows "Duplicate Vehicle" — what do I do?', a: 'Check the Guard Entries list for the other open entry on that vehicle number. If it\'s a genuine repeat visit, note it in Remarks and continue — it\'s a warning, not a block.' },
    { q: 'GPS won\'t capture', a: 'Use the "Use current GPS" button again once you have signal, or save the entry and add GPS later from Guard Entries.' },
  ],
  vendor: [
    { q: 'My PO number isn\'t recognized', a: 'Only POs already issued by Tan90 can be matched. Contact your purchasing contact if a valid PO is rejected.' },
    { q: 'Can I edit a submission after sending it?', a: 'Not directly — re-submit with corrected details and reference the original PO in Remarks.' },
  ],
  storeExec: [
    { q: 'The "Complete unloading" button is disabled', a: 'Box count, staging area, unloaded by, POD/LR reference and the seal/load proof are all required before it unlocks.' },
  ],
  qc: [
    { q: 'Reason code is required but greyed out', a: 'It\'s only required once Defective or Rejected quantity is greater than zero.' },
  ],
  storeManager: [
    { q: 'Nothing shows up in GRN Check', a: 'GRN Check only lists entries QC has already checked. Confirm with QC User that the check was sent through.' },
  ],
  finance: [
    { q: 'Final payable looks wrong', a: 'Final payable = Accepted qty × rate. Deductions (defective, rejected, missing) are shown separately below it, not subtracted again.' },
  ],
  admin: [
    { q: 'A role login is asking to log out first', a: 'That\'s expected — only one module can be open per session. Have that person log out from the sidebar before switching.' },
  ],
};

export default function HelpSupport() {
  const { auth } = useStore();
  if (!auth) return null;
  const meta = roleMeta[auth.role];
  const faqs = faqByRole[auth.role] ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Help & Support" subtitle={`Quick reference for the ${meta.moduleName}.`} />

      <Card className="p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          What this module covers
        </h2>
        <ul className="flex flex-col gap-2">
          {meta.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--brand)' }} />
              {f}
            </li>
          ))}
        </ul>
      </Card>

      {faqs.length > 0 && (
        <Card className="p-5 mb-6">
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Frequently asked
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {f.q}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Contact support
        </h2>
        <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-2">
            <Phone size={15} color="var(--brand)" /> +91 90000 00000
          </div>
          <div className="flex items-center gap-2">
            <Mail size={15} color="var(--brand)" /> support@tan90.tech
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={15} color="var(--brand)" /> WhatsApp — same number, 9am–7pm IST
          </div>
        </div>
      </Card>
    </div>
  );
}
