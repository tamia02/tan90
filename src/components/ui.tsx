import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl border ${className}`}
      style={{ borderColor: 'var(--border)', background: 'var(--surface-3)', ...style }}
    >
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
        {label}
      </span>
      {children}
      {hint && (
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </span>
      )}
    </label>
  );
}

const controlClass =
  'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--brand)]';
const controlStyle = { borderColor: 'var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' };

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} ${props.className ?? ''}`} style={{ ...controlStyle, ...props.style }} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClass} ${props.className ?? ''}`} style={{ ...controlStyle, ...props.style }} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${controlClass} ${props.className ?? ''}`} style={{ ...controlStyle, ...props.style }} />;
}

export function CheckboxRow({ children, ...props }: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: 'var(--text-primary)' }}>
      <input type="checkbox" {...props} className="w-4 h-4 accent-[var(--brand)]" />
      {children}
    </label>
  );
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary: 'text-white',
    secondary: '',
    ghost: '',
    danger: 'text-white',
  };
  const styleMap: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--brand)' },
    secondary: { background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)' },
    danger: { background: 'var(--status-critical)' },
  };
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 ${variants[variant]} ${className}`}
      style={styleMap[variant]}
    >
      {children}
    </button>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
      {text}
    </div>
  );
}
