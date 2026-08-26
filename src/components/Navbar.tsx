import { useEffect, useId, useState } from 'react';

const links = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'المميزات', href: '#showroom' },
  { label: 'كيف تعمل المنصة', href: '#dashboard-intro' },
  { label: 'للمعارض', href: '#egypt' },
  { label: 'الأسعار', href: '#pricing' },
];

/* ------------------------------------------------------------------ */
/* Small wood-cube button/link - same front/top/side face technique   */
/* as the Hero CTA, scaled down to fit inside the navbar's height.     */
/* ------------------------------------------------------------------ */
/* Jagged silhouette shared by both buttons - reads as a snapped-off  */
/* chunk of plank: near-straight long edges (top/bottom, the grain     */
/* direction), fractured zigzag on the two short ends (left/right).    */
const BROKEN_WOOD_CLIP =
  'polygon(10% 3%, 30% 0%, 50% 2%, 70% 0%, 90% 3%, 96% 15%, 91% 28%, 98% 42%, 93% 58%, 99% 72%, 94% 85%, 100% 97%, 90% 100%, 70% 97%, 50% 100%, 30% 98%, 10% 100%, 4% 88%, 9% 74%, 2% 60%, 7% 45%, 1% 30%, 6% 17%, 0% 5%)';

function NavWoodButton({
  href,
  children,
  variant,
  onClick,
  full,
}: {
  href: string;
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
  full?: boolean;
}) {
  const isPrimary = variant === 'primary';

  const frontColor = isPrimary
    ? 'linear-gradient(155deg, #7a5230 0%, #4e3018 55%, #331e0d 100%)'
    : 'linear-gradient(155deg, #d9ab5c 0%, #a97a37 55%, #7a5222 100%)';
  const backColor = isPrimary ? '#241407' : '#6b4a20';
  const textColor = isPrimary ? '#F5ECD8' : '#2A1D0E';
  const tilt = isPrimary ? '1deg' : '-1.5deg';

  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative inline-block ${full ? 'flex-1' : ''}`}
      style={{ paddingBottom: 5, paddingRight: 4 }}
    >
      {/* contact shadow, reads as the chip sitting just above the navbar surface */}
      <span
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-200 ease-out opacity-0 group-hover:opacity-100"
        style={{
          bottom: -6,
          width: '75%',
          height: 6,
          background: 'radial-gradient(ellipse, rgba(20,14,8,0.35), transparent 72%)',
          filter: 'blur(3px)',
        }}
      />

      <span
        className={`relative block ${full ? 'w-full' : ''}`}
        style={{ transform: `rotate(${tilt})` }}
      >
        {/* back chip - offset copy gives the piece some thickness */}
        <span
          className="absolute inset-0 transition-transform duration-150 ease-out translate-x-[3px] translate-y-[4px] group-active:translate-x-[1px] group-active:translate-y-[1px]"
          style={{ background: backColor, clipPath: BROKEN_WOOD_CLIP }}
        />

        {/* front chip */}
        <span
          className={`relative flex items-center justify-center transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-active:translate-y-0 ${
            full ? 'w-full px-6 py-3' : 'px-6 py-2.5'
          }`}
          style={{ background: frontColor, clipPath: BROKEN_WOOD_CLIP }}
        >
          {/* grain */}
          <span
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'repeating-linear-gradient(94deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 2px, transparent 4px)',
            }}
          />
          {/* sheen */}
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 35%, transparent 68%, rgba(0,0,0,0.16) 100%)',
            }}
          />
          <span
            className="relative z-10 text-sm font-semibold whitespace-nowrap"
            style={{
              color: textColor,
              textShadow: isPrimary
                ? '0 1px 0 rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.35)'
                : '0 1px 0 rgba(255,255,255,0.3), 0 1px 1px rgba(0,0,0,0.2)',
            }}
          >
            {children}
          </span>
        </span>
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Nav text link - on hover (or when its section is the active one     */
/* while scrolling), a rough "broken wood" strip fills in underneath   */
/* the label, like a splinter of the same timber snapping into place   */
/* and gluing itself under the text.                                   */
/* ------------------------------------------------------------------ */
function NavLinkWood({
  href,
  children,
  onClick,
  full,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  full?: boolean;
  active?: boolean;
}) {
  const gradId = useId();

  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={`group relative inline-flex items-center text-sm font-medium transition-colors duration-200 ${
        active ? 'text-ink' : 'text-ink/70 hover:text-ink'
      } ${full ? 'w-full px-4 py-3 rounded-lg hover:bg-ink/5' : 'px-3.5 py-2 rounded-lg'}`}
    >
      <span className="relative z-10">{children}</span>

      {/* broken-wood strip underline - stays put while the section is
          active, otherwise only appears on hover */}
      <span
        className={`pointer-events-none absolute origin-center transition-all duration-300 ease-out ${
          active
            ? 'scale-x-100 opacity-100'
            : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
        }`}
        style={{
          left: full ? 16 : 12,
          right: full ? 16 : 12,
          bottom: full ? 7 : 4,
          height: 8,
        }}
      >
        <svg
          viewBox="0 0 200 16"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c99251" />
              <stop offset="45%" stopColor="#a97a37" />
              <stop offset="100%" stopColor="#7a5222" />
            </linearGradient>
          </defs>
          {/* jagged, splinter-tipped strip */}
          <path
            d="M2,8 6,3 14,5 24,2 36,6 50,3 66,5 84,2 104,6 124,3 142,5 158,2 172,6 184,3 193,6 198,8 193,10 184,13 172,10 158,14 142,11 124,13 104,10 84,14 66,11 50,13 36,10 24,14 14,11 6,13 Z"
            fill={`url(#${gradId})`}
          />
          {/* grain lines */}
          <path
            d="M6,8 Q60,5 120,8 T196,7"
            stroke="rgba(58,32,14,0.32)"
            strokeWidth="0.6"
            fill="none"
          />
          <path
            d="M6,10 Q60,12 120,9 T196,10"
            stroke="rgba(255,232,196,0.28)"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(links[0].href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Scroll-spy: whichever section currently sits in a thin band near
     the vertical center of the viewport becomes the active link. Using
     a shrunk rootMargin turns IntersectionObserver into that band,
     rather than firing for every section that's merely on-screen. */
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiveHref(`#${topMost.target.id}`);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-3 sm:pt-4">
      <nav
        className={`mx-auto max-w-6xl flex items-center justify-between rounded-2xl px-4 sm:px-6 h-14 sm:h-16 transition-all duration-500 ${
          scrolled ? 'glass shadow-soft' : 'bg-transparent border border-transparent'
        }`}
      >
        <a href="#hero" className="flex items-center gap-2.5 shrink-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-sage text-bg">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M4 16h16v3H4z" fill="currentColor" opacity="0.95" />
              <path
                d="M6 9c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v5H6z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M3 14h18v2H3z" fill="#B79B68" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">معرض</span>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <NavLinkWood
                href={l.href}
                active={activeHref === l.href}
                onClick={() => setActiveHref(l.href)}
              >
                {l.label}
              </NavLinkWood>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <NavWoodButton href="#" variant="secondary">
            تسجيل الدخول
          </NavWoodButton>
          <NavWoodButton href="#cta" variant="primary">
            ابدأ الآن
          </NavWoodButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden grid place-items-center w-10 h-10 rounded-lg hover:bg-ink/5 text-ink"
          aria-label="القائمة"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="lg:hidden mx-auto max-w-6xl mt-2 glass rounded-2xl p-4 shadow-soft">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <NavLinkWood
                  href={l.href}
                  full
                  active={activeHref === l.href}
                  onClick={() => {
                    setActiveHref(l.href);
                    setOpen(false);
                  }}
                >
                  {l.label}
                </NavLinkWood>
              </li>
            ))}
            <li className="flex gap-2.5 pt-3">
              <NavWoodButton href="#" variant="secondary" full onClick={() => setOpen(false)}>
                تسجيل الدخول
              </NavWoodButton>
              <NavWoodButton href="#cta" variant="primary" full onClick={() => setOpen(false)}>
                ابدأ الآن
              </NavWoodButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}