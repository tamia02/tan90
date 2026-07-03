import { Boxes } from 'lucide-react';

// Left-hand branding panel shared by every auth screen — split-screen
// layout matching the client's reference (hero panel + card), built with
// Tan90's own indigo system rather than copying the reference's palette.
export default function AuthHero() {
  return (
    <div
      className="relative hidden lg:flex lg:w-[42%] shrink-0 flex-col justify-between p-10 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #241f8f 0%, #4f46e5 55%, #6d63f5 100%)' }}
    >
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full translate-x-1/3 translate-y-1/3" style={{ background: 'rgba(255,255,255,0.06)' }} />

      <div className="relative flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg grid place-items-center font-bold text-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
          T90
        </div>
        <span className="font-semibold text-white tracking-wide">TAN90 ERP</span>
      </div>

      <div className="relative">
        <div
          className="rounded-2xl border p-8 mb-8"
          style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.16)' }}
        >
          <div className="w-16 h-16 rounded-2xl grid place-items-center mb-6" style={{ background: 'rgba(255,255,255,0.14)' }}>
            <Boxes size={30} color="#fff" />
          </div>
          <div className="text-white text-2xl font-semibold leading-snug text-wrap-balance">
            Inward-to-GRN
            <br />
            Control Tower
          </div>
          <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
            One connected flow — Vendor and Guard capture, validation, unloading, QC and GRN checks, stock ledger and
            finance closure.
          </p>
        </div>
        <p className="text-xs tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Built for chemical &amp; industrial inventory operations
        </p>
      </div>
    </div>
  );
}
