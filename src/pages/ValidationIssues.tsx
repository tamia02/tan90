import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { StatTile } from '../components/StatTile';
import { Button, Card, EmptyState, Input, PageHeader } from '../components/ui';
import { IssueStatusBadge, SeverityBadge } from '../components/Badge';
import { issueCounts, stockExceptionsFromGrn } from '../lib/derived';
import { AlertOctagon, AlertTriangle, Flag, PackageSearch, Search } from 'lucide-react';
import type { ValidationIssue } from '../lib/types';

export default function ValidationIssues() {
  const { issues, gateEntries, grnRecords, dispatch } = useStore();
  const [query, setQuery] = useState('');
  const counts = issueCounts(issues);
  const exceptions = stockExceptionsFromGrn(grnRecords);

  const openIssues = useMemo(() => {
    const q = query.trim().toLowerCase();
    return issues
      .filter((i) => i.status === 'open' || i.status === 'escalated')
      .filter((i) => {
        if (!q) return true;
        const gate = gateEntries.find((g) => g.id === i.gateEntryId);
        return (
          i.title.toLowerCase().includes(q) ||
          gate?.poNumber?.toLowerCase().includes(q) ||
          gate?.vendorName?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.raisedAt).getTime() - new Date(a.raisedAt).getTime());
  }, [issues, gateEntries, query]);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Validation Engine"
        subtitle="Triage blocked inward documents, approvals and stock exceptions before GRN or finance."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile label="Hard Fail" value={counts.hardFail} tone="critical" icon={<AlertOctagon size={16} />} />
        <StatTile label="Needs Approval" value={counts.needsApproval} tone="serious" icon={<Flag size={16} />} />
        <StatTile label="Warnings" value={counts.warnings} tone="warning" icon={<AlertTriangle size={16} />} />
        <StatTile label="Stock Exceptions" value={exceptions.length} tone="neutral" icon={<PackageSearch size={16} />} />
      </div>

      <div className="flex items-center gap-2 mb-4 rounded-[var(--radius)] border px-3 py-2" style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search issue or PO"
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {openIssues.length === 0 && <EmptyState text="No open issues. Everything is validated." />}
        {openIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} poNumber={gateEntries.find((g) => g.id === issue.gateEntryId)?.poNumber} dispatch={dispatch} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--status-critical)' }}>
            Hard Fail
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Blocks unloading, GRN or stock posting.
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--status-serious)' }}>
            Red Flag
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Requires a named owner and approval note.
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--status-warning)' }}>
            Warning
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Visible operational variance; resolve or escalate.
          </p>
        </Card>
      </div>

      <h2 className="text-sm font-semibold mt-8 mb-3" style={{ color: 'var(--text-primary)' }}>
        Stock Exceptions
      </h2>
      <Card className="p-0 overflow-hidden">
        {exceptions.length === 0 ? (
          <EmptyState text="No stock exceptions." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-4 py-2.5 font-medium">Exception</th>
                  <th className="px-4 py-2.5 font-medium">SKU / Bin</th>
                  <th className="px-4 py-2.5 font-medium">Quantity</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {exceptions.map((e) => (
                  <tr key={e.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-4 py-2.5 capitalize">{e.type}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                      {e.sku} / {e.bin}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">{e.qty}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {e.status}
                      </span>
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

function IssueCard({
  issue,
  poNumber,
  dispatch,
}: {
  issue: ValidationIssue;
  poNumber?: string;
  dispatch: ReturnType<typeof useStore>['dispatch'];
}) {
  const [owner, setOwner] = useState(issue.owner ?? '');
  const [note, setNote] = useState('');

  function act(status: ValidationIssue['status']) {
    dispatch({ type: 'UPDATE_ISSUE', payload: { id: issue.id, status, owner: owner || undefined, note: note || undefined } });
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <SeverityBadge severity={issue.severity} />
        {issue.status === 'escalated' && <IssueStatusBadge status={issue.status} />}
        {!issue.owner && <span className="text-xs font-medium" style={{ color: 'var(--status-critical)' }}>Unassigned SLA</span>}
      </div>
      <h3 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
        {issue.title}
      </h3>
      <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
        {issue.description}
      </p>
      <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
        {poNumber ? `${poNumber} · ` : ''}Owner: {issue.owner || 'Unassigned'} · Status: {issue.status} · Raised: {new Date(issue.raisedAt).toLocaleString()}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
        <Input placeholder="Owner name" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <Input placeholder="Decision note" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <Button variant="secondary" onClick={() => act('open')} disabled={!owner}>
          Assign
        </Button>
        <Button variant="primary" onClick={() => act('approved')} disabled={!owner || !note}>
          Approve
        </Button>
        <Button variant="secondary" onClick={() => act('resolved')} disabled={!owner}>
          Resolve
        </Button>
        <Button variant="danger" onClick={() => act('escalated')}>
          Escalate
        </Button>
      </div>
    </Card>
  );
}
