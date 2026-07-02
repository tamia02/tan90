import type { GateEntry, GrnRecord, StockException, ValidationIssue } from './types';

export function issueCounts(issues: ValidationIssue[]) {
  const open = issues.filter((i) => i.status === 'open' || i.status === 'escalated');
  return {
    hardFail: open.filter((i) => i.severity === 'hardFail').length,
    needsApproval: open.filter((i) => i.severity === 'redFlag').length,
    warnings: open.filter((i) => i.severity === 'warning').length,
  };
}

export function stockExceptionsFromGrn(grnRecords: GrnRecord[]): StockException[] {
  const out: StockException[] = [];
  for (const grn of grnRecords) {
    if (grn.missing > 0)
      out.push({ id: `${grn.gateEntryId}-missing`, gateEntryId: grn.gateEntryId, sku: grn.sku, bin: grn.suggestedBin, type: 'missing', qty: grn.missing, status: 'open' });
    if (grn.split.defective > 0)
      out.push({ id: `${grn.gateEntryId}-defective`, gateEntryId: grn.gateEntryId, sku: grn.sku, bin: grn.suggestedBin, type: 'defective', qty: grn.split.defective, status: 'open' });
    if (grn.split.rejected > 0)
      out.push({ id: `${grn.gateEntryId}-rejected`, gateEntryId: grn.gateEntryId, sku: grn.sku, bin: grn.suggestedBin, type: 'rejected', qty: grn.split.rejected, status: 'open' });
  }
  return out;
}

export function slaRemainingMs(entry: GateEntry): number {
  return new Date(entry.slaDeadline).getTime() - Date.now();
}

export function formatDuration(ms: number): string {
  const abs = Math.abs(ms);
  const hrs = Math.floor(abs / 3_600_000);
  const mins = Math.floor((abs % 3_600_000) / 60_000);
  const label = `${hrs}h ${mins}m`;
  return ms < 0 ? `${label} overdue` : `${label} left`;
}

export function gateEntryLabel(entry: GateEntry): string {
  return `${entry.gateNo} · ${entry.vendorName ?? entry.vehicleNumber}`;
}
