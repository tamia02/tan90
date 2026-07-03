import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Tone = 'critical' | 'warning' | 'serious' | 'good' | 'neutral';

const toneStyles: Record<Tone, { fg: string; bg: string }> = {
  critical: { fg: 'var(--status-critical)', bg: 'var(--status-critical-bg)' },
  warning: { fg: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
  serious: { fg: 'var(--status-serious)', bg: 'var(--status-serious-bg)' },
  good: { fg: 'var(--status-good)', bg: 'var(--status-good-bg)' },
  neutral: { fg: 'var(--text-primary)', bg: 'var(--surface-3)' },
};

export function StatTile({
  label,
  value,
  tone = 'neutral',
  icon,
}: {
  label: string;
  value: number | string;
  tone?: Tone;
  icon?: ReactNode;
}) {
  const styles = toneStyles[tone];
  return (
    <div
      className="rounded-[var(--radius)] border p-4 flex flex-col gap-2 min-w-0 transition-shadow hover:shadow-[var(--shadow-hover)]"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide truncate" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
        {icon && (
          <span
            className="shrink-0 grid place-items-center w-7 h-7 rounded-lg"
            style={{ color: styles.fg, background: styles.bg }}
          >
            {icon}
          </span>
        )}
      </div>
      <span className="text-3xl font-semibold tabular-nums" style={{ color: styles.fg, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
    </div>
  );
}

export function ModuleStatCard({
  label,
  value,
  icon,
  to,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  to?: string;
}) {
  const content = (
    <div
      className="rounded-[var(--radius)] border p-4 flex items-center gap-3.5 min-w-0 h-full transition-shadow hover:shadow-[var(--shadow-hover)]"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}
    >
      <span
        className="shrink-0 grid place-items-center w-11 h-11 rounded-[var(--radius)] text-white"
        style={{ background: 'var(--brand)' }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-sm font-medium truncate" style={{ color: 'var(--brand)' }}>
          {label}
        </div>
        <div className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
          {value}
        </div>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}
