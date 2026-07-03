import { Link } from 'react-router-dom';
import { AlertOctagon, AlertTriangle, Bell, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '../lib/store';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { formatDuration, gateEntryLabel, slaRemainingMs } from '../lib/derived';
import { roleMeta, type Role } from '../lib/auth';

interface Notice {
  id: string;
  tone: 'critical' | 'warning' | 'good' | 'neutral';
  title: string;
  detail: string;
  to?: string;
}

function buildNotices(role: Role, store: ReturnType<typeof useStore>): Notice[] {
  const { gateEntries, issues, vendorSubmissions, finance, zoho } = store;
  const notices: Notice[] = [];

  if (role === 'guard') {
    const open = gateEntries.filter((g) => g.status !== 'closed');
    for (const g of open) {
      const remaining = slaRemainingMs(g);
      if (remaining < 0) {
        notices.push({ id: `sla-${g.id}`, tone: 'critical', title: 'SLA breached', detail: `${gateEntryLabel(g)} — ${formatDuration(remaining)}`, to: '/guard/entries' });
      } else if (remaining < 2 * 3_600_000) {
        notices.push({ id: `sla-warn-${g.id}`, tone: 'warning', title: 'SLA closing in under 2 hours', detail: gateEntryLabel(g), to: '/guard/entries' });
      }
    }
  }

  if (role === 'vendor') {
    for (const s of vendorSubmissions.filter((s) => s.status === 'submitted')) {
      notices.push({ id: `vs-${s.id}`, tone: 'neutral', title: 'Submission under review', detail: `${s.poNumber} · ${s.vendorName}`, to: '/vendor' });
    }
    for (const s of vendorSubmissions.filter((s) => !s.hasLrPod)) {
      notices.push({ id: `vs-lr-${s.id}`, tone: 'warning', title: 'LR/POD not yet uploaded', detail: `${s.poNumber} — upload before the vehicle reaches the gate`, to: '/vendor' });
    }
  }

  if (role === 'storeExec') {
    const ready = gateEntries.filter((g) => g.status === 'validated');
    if (ready.length) notices.push({ id: 'unloading-ready', tone: 'neutral', title: `${ready.length} entr${ready.length === 1 ? 'y' : 'ies'} ready for unloading`, detail: ready.map(gateEntryLabel).join(', '), to: '/unloading' });
  }

  if (role === 'qc') {
    const ready = gateEntries.filter((g) => g.status === 'grn');
    if (ready.length) notices.push({ id: 'qc-ready', tone: 'neutral', title: `${ready.length} entr${ready.length === 1 ? 'y' : 'ies'} awaiting QC Check`, detail: ready.map(gateEntryLabel).join(', '), to: '/qc' });
  }

  if (role === 'storeManager') {
    const readyForGrn = gateEntries.filter((g) => g.status === 'qc_done');
    if (readyForGrn.length) notices.push({ id: 'grn-ready', tone: 'neutral', title: `${readyForGrn.length} entr${readyForGrn.length === 1 ? 'y' : 'ies'} ready for GRN Check`, detail: readyForGrn.map(gateEntryLabel).join(', '), to: '/grn' });
    const unowned = issues.filter((i) => i.status === 'open' && !i.owner);
    if (unowned.length) notices.push({ id: 'unowned-issues', tone: 'critical', title: `${unowned.length} unassigned validation issue${unowned.length === 1 ? '' : 's'}`, detail: 'No owner set — SLA at risk', to: '/validation' });
    const escalated = issues.filter((i) => i.status === 'escalated');
    if (escalated.length) notices.push({ id: 'escalated-issues', tone: 'critical', title: `${escalated.length} escalated issue${escalated.length === 1 ? '' : 's'}`, detail: 'Needs Admin/Auditor attention', to: '/validation' });
  }

  if (role === 'finance') {
    const pending = finance.filter((f) => f.vendorStatus !== 'cleared');
    for (const f of pending) {
      notices.push({ id: `fin-${f.gateEntryId}`, tone: f.vendorStatus === 'hold' ? 'critical' : 'warning', title: `Payment ${f.vendorStatus}`, detail: `${f.vendorName} · Invoice ${f.invoiceNumber}`, to: '/finance' });
    }
  }

  if (role === 'admin') {
    const hardFails = issues.filter((i) => (i.status === 'open' || i.status === 'escalated') && i.severity === 'hardFail');
    if (hardFails.length) notices.push({ id: 'admin-hardfail', tone: 'critical', title: `${hardFails.length} Hard Fail issue${hardFails.length === 1 ? '' : 's'} open`, detail: 'Blocking the inward pipeline', to: '/validation' });
    if (!zoho.connected) notices.push({ id: 'admin-zoho', tone: 'warning', title: 'Zoho not connected', detail: 'Vendors are entering invoice data manually', to: '/admin' });
    const pendingPay = finance.filter((f) => f.vendorStatus !== 'cleared');
    if (pendingPay.length) notices.push({ id: 'admin-finance', tone: 'neutral', title: `${pendingPay.length} vendor payment${pendingPay.length === 1 ? '' : 's'} not yet cleared`, detail: 'Awaiting Finance review', to: '/finance' });
  }

  return notices;
}

const toneStyle: Record<Notice['tone'], { fg: string; bg: string; Icon: typeof Bell }> = {
  critical: { fg: 'var(--status-critical)', bg: 'var(--status-critical-bg)', Icon: AlertOctagon },
  warning: { fg: 'var(--status-warning)', bg: 'var(--status-warning-bg)', Icon: AlertTriangle },
  good: { fg: 'var(--status-good)', bg: 'var(--status-good-bg)', Icon: CheckCircle2 },
  neutral: { fg: 'var(--brand)', bg: 'var(--brand-bg)', Icon: Clock },
};

export default function Notifications() {
  const store = useStore();
  const { auth } = store;
  if (!auth) return null;

  const notices = buildNotices(auth.role, store);

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Notifications" subtitle={`Alerts relevant to the ${roleMeta[auth.role].moduleName}.`} />
      <div className="flex flex-col gap-2">
        {notices.length === 0 && <EmptyState text="Nothing needs your attention right now." />}
        {notices.map((n) => {
          const { fg, bg, Icon } = toneStyle[n.tone];
          const content = (
            <Card className="p-4 flex items-start gap-3 hover:opacity-90 transition-opacity">
              <span className="w-9 h-9 rounded-[var(--radius)] grid place-items-center shrink-0" style={{ background: bg, color: fg }}>
                <Icon size={17} />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {n.title}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {n.detail}
                </div>
              </div>
            </Card>
          );
          return n.to ? (
            <Link key={n.id} to={n.to}>
              {content}
            </Link>
          ) : (
            <div key={n.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
