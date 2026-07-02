import type { ReactNode } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Circle, Clock, Flag } from 'lucide-react';
import type { GateEntryStatus, IssueSeverity, IssueStatus, VendorClosureStatus } from '../lib/types';

function Pill({ fg, bg, icon, children }: { fg: string; bg: string; icon: ReactNode; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap"
      style={{ color: fg, background: bg }}
    >
      {icon}
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  if (severity === 'hardFail')
    return (
      <Pill fg="var(--status-critical)" bg="var(--status-critical-bg)" icon={<AlertOctagon size={13} />}>
        Hard Fail
      </Pill>
    );
  if (severity === 'redFlag')
    return (
      <Pill fg="var(--status-serious)" bg="var(--status-serious-bg)" icon={<Flag size={13} />}>
        Needs Approval
      </Pill>
    );
  return (
    <Pill fg="var(--status-warning)" bg="var(--status-warning-bg)" icon={<AlertTriangle size={13} />}>
      Warning
    </Pill>
  );
}

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  if (status === 'open')
    return (
      <Pill fg="var(--text-secondary)" bg="var(--surface-2)" icon={<Circle size={13} />}>
        Open
      </Pill>
    );
  if (status === 'approved')
    return (
      <Pill fg="var(--status-good)" bg="var(--status-good-bg)" icon={<CheckCircle2 size={13} />}>
        Approved
      </Pill>
    );
  if (status === 'resolved')
    return (
      <Pill fg="var(--status-good)" bg="var(--status-good-bg)" icon={<CheckCircle2 size={13} />}>
        Resolved
      </Pill>
    );
  return (
    <Pill fg="var(--status-critical)" bg="var(--status-critical-bg)" icon={<AlertOctagon size={13} />}>
      Escalated
    </Pill>
  );
}

const gateStatusLabel: Record<GateEntryStatus, string> = {
  pending_validation: 'Pending Validation',
  validated: 'Validated',
  unloading: 'Unloading',
  grn: 'Ready for GRN/QC',
  posted: 'Posted',
  closed: 'Closed',
};

export function GateStatusBadge({ status }: { status: GateEntryStatus }) {
  const tone =
    status === 'closed' || status === 'posted'
      ? { fg: 'var(--status-good)', bg: 'var(--status-good-bg)' }
      : status === 'pending_validation'
        ? { fg: 'var(--status-critical)', bg: 'var(--status-critical-bg)' }
        : { fg: 'var(--brand)', bg: 'var(--brand-bg)' };
  return (
    <Pill fg={tone.fg} bg={tone.bg} icon={<Clock size={13} />}>
      {gateStatusLabel[status]}
    </Pill>
  );
}

export function VendorStatusBadge({ status }: { status: VendorClosureStatus }) {
  if (status === 'cleared')
    return (
      <Pill fg="var(--status-good)" bg="var(--status-good-bg)" icon={<CheckCircle2 size={13} />}>
        Cleared
      </Pill>
    );
  if (status === 'hold')
    return (
      <Pill fg="var(--status-critical)" bg="var(--status-critical-bg)" icon={<AlertOctagon size={13} />}>
        Hold
      </Pill>
    );
  return (
    <Pill fg="var(--status-warning)" bg="var(--status-warning-bg)" icon={<Clock size={13} />}>
      Pending
    </Pill>
  );
}
