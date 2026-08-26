const columns = [
  { title: 'المنصة', links: ['الرئيسية', 'المميزات', 'كيف تعمل', 'الأسعار'] },
  { title: 'للمعارض', links: ['إدارة المنتجات', 'إدارة الفروع', 'العملاء', 'المبيعات'] },
  { title: 'الشركة', links: ['من نحن', 'المدونة', 'تواصل معنا', 'الوظائف'] },
];

/* ---------- Signature element: a wax-seal stamp standing in for the
   logo mark. Echoes the nail/wood-sign/paper vocabulary used
   elsewhere on the site (PriceTag's nail, FinalCTA's hanging sign),
   but reframes the footer itself as the stamped receipt you get on
   your way out of the showroom. ---------- */
function SealBadge() {
  return (
    <div className="relative w-14 h-14 shrink-0" style={{ transform: 'rotate(-5deg)' }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #F3D98B 0%, #C99A3E 55%, #8a662a 100%)',
          boxShadow:
            'inset 0 0 0 2px rgba(0,0,0,0.28), inset 0 2px 4px rgba(255,255,255,0.35), 0 8px 18px -8px rgba(0,0,0,0.65)',
        }}
      />
      <div
        className="absolute inset-[3px] rounded-full"
        style={{ border: '1px dashed rgba(28,19,10,0.4)' }}
      />
      <div className="absolute inset-0 grid place-items-center text-[#3d2914]">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
          <path d="M4 16h16v3H4z" fill="currentColor" opacity="0.95" />
          <path d="M6 9c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v5H6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M3 14h18v2H3z" fill="#5a3820" />
        </svg>
      </div>
    </div>
  );
}

/* A single receipt-style line item: label, a dotted leader that fills
   the remaining width, then a small chevron — like an item on a
   printed price list. */
function ReceiptLink({ label }: { label: string }) {
  return (
    <li>
      <a href="#" className="group flex items-center gap-2 py-0.5">
        <span className="text-sm text-bg/55 group-hover:text-bg transition-colors shrink-0">
          {label}
        </span>
        <span
          className="flex-1 h-0 border-b border-dotted border-bg/15 group-hover:border-bg/30 transition-colors mb-[3px]"
          aria-hidden="true"
        />
        <span className="text-bg/20 group-hover:text-[#F3D98B] transition-colors text-xs">‹</span>
      </a>
    </li>
  );
}

/* A row of small punched circles standing in for a tear-off
   perforation, the way a ticket stub separates from a receipt. */
function PerforationDivider() {
  return (
    <div
      className="h-3 w-full mb-8"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(247,239,225,0.16) 1.6px, transparent 1.7px)',
        backgroundSize: '16px 100%',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
}

export default function Footer() {
  return (
    <footer
      className="relative bg-ink text-bg px-6 py-16 overflow-hidden"
      style={{
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 9px)',
      }}
    >
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <SealBadge />
              <span className="display text-xl font-bold tracking-tight">معرض</span>
            </div>
            <p className="text-sm text-bg/50 leading-relaxed max-w-xs mb-6">
              منصة مصرية متكاملة لإدارة معارض الأثاث — المنتجات، الفروع، العملاء،
              والمبيعات من مكان واحد.
            </p>
            <div className="flex gap-3">
              {['twitter', 'facebook', 'instagram'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="grid place-items-center w-9 h-9 rounded-full transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(247,239,225,0.06)',
                    boxShadow: 'inset 0 0 0 1px rgba(247,239,225,0.12)',
                  }}
                  aria-label={s}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-bg/70" fill="currentColor">
                    {s === 'twitter' && (
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    )}
                    {s === 'facebook' && (
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    )}
                    {s === 'instagram' && (
                      <path d="M16 2H8a6 6 0 00-6 6v8a6 6 0 006 6h8a6 6 0 006-6V8a6 6 0 00-6-6zm-4 14a4 4 0 110-8 4 4 0 010 8zm5-9a1 1 0 110-2 1 1 0 010 2z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-[0.15em] text-[#F3D98B]/80 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-1">
                {col.links.map((l) => (
                  <ReceiptLink key={l} label={l} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <PerforationDivider />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs tracking-wide text-bg/35 font-mono">
            © ٢٠٢٦ معرض · جميع الحقوق محفوظة
          </p>
          <div className="flex gap-6 text-xs tracking-wide text-bg/35 font-mono">
            <a href="#" className="hover:text-bg/70 transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-bg/70 transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}