import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { ModuleStatCard, StatTile } from '../components/StatTile';
import { TrendChart } from '../components/TrendChart';
import { Card, PageHeader } from '../components/ui';
import { GateStatusBadge } from '../components/Badge';
import { formatDuration, gateEntryLabel, issueCounts, slaRemainingMs, stockExceptionsFromGrn } from '../lib/derived';
import { monthlySeries } from '../lib/trends';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Clock,
  Flag,
  PackageSearch,
  Truck,
  Wallet,
} from 'lucide-react';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function CommandCenter() {
  const { gateEntries, issues, vendorSubmissions, grnRecords, ledger, finance } = useStore();
  const counts = issueCounts(issues);
  const exceptions = stockExceptionsFromGrn(grnRecords);
  const openGateEntries = gateEntries.filter((g) => g.status !== 'closed');
  const pendingPayable = finance.filter((f) => f.vendorStatus !== 'cleared').length;

  const inwardQty = grnRecords.reduce((sum, g) => sum + g.physicalReceived, 0) || 700;
  const payableValue = finance.reduce((sum, f) => sum + f.finalPayable, 0) || 28980;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Control Tower"
        subtitle="Triage blocked inward documents, approvals and stock exceptions before GRN or finance."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <ModuleStatCard label="Gate Entries" value={gateEntries.length} icon={<Truck size={20} />} to="/guard" />
        <ModuleStatCard label="Vendor Submissions" value={vendorSubmissions.length} icon={<ClipboardCheck size={20} />} to="/vendor" />
        <ModuleStatCard label="GRN Posted" value={grnRecords.length} icon={<PackageSearch size={20} />} to="/qc" />
        <ModuleStatCard label="Ledger Postings" value={ledger.length} icon={<BookOpen size={20} />} to="/store" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatTile label="Hard Fail" value={counts.hardFail} tone="critical" icon={<AlertOctagon size={16} />} />
        <StatTile label="Needs Approval" value={counts.needsApproval} tone="serious" icon={<Flag size={16} />} />
        <StatTile label="Warnings" value={counts.warnings} tone="warning" icon={<AlertTriangle size={16} />} />
        <ModuleStatCard label="Pending Payable" value={pendingPayable} icon={<Wallet size={20} />} to="/finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
            Inward volume — last 12 months
          </h2>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Physical quantity received across all GRNs (KG)
          </p>
          <TrendChart data={monthlySeries(inwardQty)} valueFormatter={(v) => `${v.toLocaleString('en-IN')} KG`} />
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
            Finance payable — last 12 months
          </h2>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Final payable value posted to Finance
          </p>
          <TrendChart data={monthlySeries(payableValue)} valueFormatter={(v) => inr.format(v)} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Open gate entries
            </h2>
            <Link to="/guard/scan" className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--brand)' }}>
              New gate entry <ArrowRight size={13} />
            </Link>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
            {openGateEntries.length === 0 && (
              <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>
                No open gate entries. Everything is through GRN and closed.
              </p>
            )}
            {openGateEntries.map((g) => {
              const remaining = slaRemainingMs(g);
              return (
                <div key={g.id} className="py-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {gateEntryLabel(g)}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {g.poNumber ?? '—'} · {g.material ?? g.entryType} ·{' '}
                      <span style={{ color: remaining < 0 ? 'var(--status-critical)' : 'var(--text-muted)' }}>
                        SLA {formatDuration(remaining)}
                      </span>
                    </div>
                  </div>
                  <GateStatusBadge status={g.status} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Clock size={14} />
            5-step flow
          </div>
          <ol className="text-xs space-y-2" style={{ color: 'var(--text-secondary)' }}>
            <li>1. Vendor / Driver documents</li>
            <li>2. Guard Portal / gate entry</li>
            <li>3. Validation engine</li>
            <li>4. Unloading + QC + GRN</li>
            <li>5. Stock + finance closure</li>
          </ol>

          <div className="h-px my-4" style={{ background: 'var(--border)' }} />

          <h2 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
            Stock exceptions
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {exceptions.length} open exception{exceptions.length === 1 ? '' : 's'} across missing, defective and rejected.
          </p>
          <Link to="/validation" className="text-xs font-medium flex items-center gap-1 mt-2" style={{ color: 'var(--brand)' }}>
            Open Validation Engine <ArrowRight size={13} />
          </Link>
        </Card>
      </div>
    </div>
  );
}
