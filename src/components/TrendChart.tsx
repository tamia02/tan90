import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TrendPoint } from '../lib/trends';

function CustomTooltip({ active, payload, label, valueFormatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}
    >
      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
        {label}
      </div>
      <div style={{ color: 'var(--brand)' }}>{valueFormatter ? valueFormatter(payload[0].value) : payload[0].value}</div>
    </div>
  );
}

export function TrendChart({ data, valueFormatter }: { data: TrendPoint[]; valueFormatter?: (v: number) => string }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : String(v))}
        />
        <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--brand)"
          strokeWidth={2}
          fill="url(#trendFill)"
          dot={{ r: 4, fill: 'var(--brand)', stroke: 'var(--surface-3)', strokeWidth: 2 }}
          activeDot={{ r: 5, fill: 'var(--brand)', stroke: 'var(--surface-3)', strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
