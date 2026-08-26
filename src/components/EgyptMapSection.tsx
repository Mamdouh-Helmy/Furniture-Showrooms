import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import mapImage from '../assets/egypt-illustrated-map.png';

/* Base map: the fully illustrated Delta artwork the user supplied
   (1536×1024, i.e. a 3:2 canvas), imported as a module — NOT a plain
   string path. Vite (like CRA/webpack) only fingerprints and bundles
   an asset — giving you back a working, hashed URL — when you actually
   `import` it like this. A bare string such as
   '../assets/egypt-illustrated-map.png' assigned to a variable is
   never touched by the bundler, so the browser tries to fetch it
   relative to the current PAGE url instead of the file's real
   location on disk — that's why it 404'd and never rendered. Adjust
   the import path/extension above to wherever the file actually sits
   in your project (e.g. `@/assets/...` if that alias is set up). */
const MAP_IMAGE_SRC = mapImage;
const MAP_ASPECT = '3 / 2'; // matches the 1536×1024 source image

/* Pins are positioned as PERCENTAGES of the image's width/height so
   they stay aligned with the illustration at any render size. These
   were hand-eyeballed against the specific artwork above (Cairo's
   mosque icon, the Giza pyramids, the Alexandria lighthouse, Damietta
   and Mansoura's town clusters near the top of the Delta) — if the
   image ever changes, these will need to be nudged to match. */
interface City {
  id: string;
  name: string;
  xPct: number;
  yPct: number;
  branch: string;
  orders: number;
}

const cities: City[] = [
  { id: 'cairo', name: 'القاهرة', xPct: 47.5, yPct: 34, branch: 'فرع مدينة نصر', orders: 48 },
  { id: 'giza', name: 'الجيزة', xPct: 44, yPct: 46.5, branch: 'فرع المهندسين', orders: 35 },
  { id: 'alex', name: 'الإسكندرية', xPct: 26, yPct: 23, branch: 'فرع سموحة', orders: 29 },
  { id: 'damietta', name: 'دمياط', xPct: 56, yPct: 14, branch: 'فرع دمياط الجديدة', orders: 52 },
  { id: 'mansoura', name: 'المنصورة', xPct: 49.5, yPct: 20, branch: 'فرع جوار المنصورة', orders: 18 },
];

/* Same wood-joinery frame language as ProductsSection's ProductCard —
   reused here so the map and the stats plank read as the same physical
   material as the rest of the site. */
const WOOD_FRAME = {
  background: `
    repeating-linear-gradient(
      115deg,
      rgba(255,255,255,0.05) 0px,
      rgba(255,255,255,0.05) 1px,
      transparent 1px,
      transparent 3px
    ),
    linear-gradient(
      135deg,
      #6b4226 0%,
      #7c4f2c 18%,
      #5a3820 32%,
      #85572f 48%,
      #603c22 64%,
      #7a4f2b 82%,
      #55351d 100%
    )
  `,
  boxShadow:
    'inset 0 0 0 1px rgba(0,0,0,0.35), inset 0 -3px 6px rgba(0,0,0,0.4), 0 18px 30px -12px rgba(40,24,12,0.55)',
};

function FrameCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotation = { tl: '0deg', tr: '90deg', bl: '270deg', br: '180deg' }[position];
  const placement = {
    tl: 'top-1 left-1',
    tr: 'top-1 right-1',
    bl: 'bottom-1 left-1',
    br: 'bottom-1 right-1',
  }[position];
  return (
    <div
      className={`absolute ${placement} w-5 h-5 pointer-events-none`}
      style={{ transform: `rotate(${rotation})` }}
    >
      <svg viewBox="0 0 20 20" className="w-full h-full">
        <line x1="0" y1="0" x2="20" y2="20" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
        <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function WoodFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative rounded-[22px] p-3 sm:p-3.5 ${className ?? ''}`} style={WOOD_FRAME}>
      <FrameCorner position="tl" />
      <FrameCorner position="tr" />
      <FrameCorner position="bl" />
      <FrameCorner position="br" />
      {children}
    </div>
  );
}

function CityPin({ c, active, onHover }: { c: City; active: boolean; onHover: (id: string) => void }) {
  const gradientId = `pinWoodGrain-${c.id}`;
  return (
    <button
      onMouseEnter={() => onHover(c.id)}
      onFocus={() => onHover(c.id)}
      onClick={() => onHover(c.id)}
      className="absolute cursor-pointer"
      style={{ left: `${c.xPct}%`, top: `${c.yPct}%`, transform: 'translate(-50%, -100%)' }}
    >
      {/* inner wrapper carries the hover/active lift — kept separate from
          the outer button because the outer button's inline `transform`
          (used for centering the pin on its x/y%) would otherwise
          override any Tailwind transform utility placed on the same
          element */}
      <div
        className={`flex flex-col items-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          active ? '-translate-y-1' : 'hover:-translate-y-1'
        }`}
      >
        {/* label pill — sits above the pin so it's readable over any part
            of the illustration behind it */}
        <span
          style={active ? WOOD_FRAME : undefined}
          className={`mb-1 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            active
              ? 'text-[#F7EFE1] border-black/20 scale-105'
              : 'text-[#5a3820] bg-[rgba(247,245,240,0.94)] border-[#B39F76] scale-100'
          }`}
        >
          {c.name}
        </span>

        {/* drop pin + pulsing halo when active */}
        <div className="relative flex items-center justify-center">
          {active && (
            <span
              className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-bright/50 animate-ping"
              style={{ left: '50%', top: '38%' }}
            />
          )}
          <svg
            viewBox="0 0 24 34"
            className={`relative drop-shadow-md transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              active ? 'scale-125' : 'scale-100 hover:scale-110'
            }`}
            style={{ width: 22, height: 31 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c4f2c" />
                <stop offset="55%" stopColor="#85572f" />
                <stop offset="100%" stopColor="#55351d" />
              </linearGradient>
            </defs>
            <path
              d="M12,0 C4,0 0,6 0,13 C0,22 12,34 12,34 C12,34 24,22 24,13 C24,6 20,0 12,0 Z"
              fill={active ? `url(#${gradientId})` : '#8A6245'}
              stroke="#F7F5F0"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="13" r="5" fill="#F7F5F0" />
          </svg>
        </div>
      </div>
    </button>
  );
}

function EgyptMap({ active, onHover }: { active: string | null; onHover: (id: string) => void }) {
  return (
    <div className="relative w-full h-full">
      <img
        src={MAP_IMAGE_SRC}
        alt="خريطة مصر التوضيحية"
        className="w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />
      {cities.map((c) => (
        <CityPin key={c.id} c={c} active={active === c.id} onHover={onHover} />
      ))}
    </div>
  );
}

/* One shared wood plank holding both stats — each stat reads as a small
   brass-rivet badge (inset icon disc) next to a baseline-aligned
   value/unit, split by a plain hairline joint. Simpler and calmer than
   a stacked layout, so it sits on the wood without competing with the
   grain. */
function StatsPlank() {
  const stats = [
    {
      value: '5',
      unit: 'فروع',
      label: 'إجمالي الفروع',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      value: '182',
      unit: 'طلب',
      label: 'إجمالي الطلبات',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 7h12l1 13H5L6 7Z M9 7a3 3 0 0 1 6 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <WoodFrame>
      <div className="grid grid-cols-2 divide-x divide-white/10 rounded-[14px] overflow-hidden">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-5">
            <div className="shrink-0 w-12 h-12 rounded-full grid place-items-center bg-gradient-to-b from-black/10 to-black/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.08)] text-gold-bright">
              {s.icon}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tnum text-[#f7efe1] leading-none">{s.value}</span>
                <span className="text-sm text-[#f7efe1]/70">{s.unit}</span>
              </div>
              <div className="text-[11px] text-[#f7efe1]/45 mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </WoodFrame>
  );
}

export default function EgyptMapSection() {
  const [active, setActive] = useState<string | null>('damietta');
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="egypt" className="relative py-24 sm:py-32 px-6 bg-bg-2/40">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div data-reveal className="text-center mb-14">
          <div className="eyebrow mb-4">مصمم لمصر</div>
          <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ink mb-4">
            <span className="relative inline-block pb-4">
              مصمم لمعارض الأثاث في مصر.
              <svg
                className="absolute left-0 bottom-0 w-full h-3 text-gold"
                viewBox="0 0 200 16"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9 Q 8 4 14 9 T 26 9 T 38 9 T 50 9 T 62 9 T 74 9 T 86 9 T 98 9 T 110 9 T 122 9 T 134 9 T 146 9 T 158 9 T 170 9 T 182 9 T 194 9"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-ink/55 max-w-xl mx-auto">
            من دمياط للقاهرة والإسكندرية، إدارة معرضك أصبحت في مكان واحد.
          </p>

          {/* curvy pointer nudging the eye toward the map below — same
              style as ProductsSection's arrow, for consistency */}
          <svg
            className="mx-auto mt-1 w-10 h-12 text-gold"
            viewBox="0 0 40 50"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M14 4 C 10 14, 26 12, 22 24 C 18 34, 26 34, 26 46"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M22 40 L26 46 L30 40"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <div data-reveal className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <WoodFrame>
            {/* no padding here on purpose — the map fills this panel edge to edge */}
            <div className="relative rounded-[14px] overflow-hidden bg-[#e0c58e]">
              <div style={{ aspectRatio: MAP_ASPECT }}>
                <EgyptMap active={active} onHover={setActive} />
              </div>
            </div>
          </WoodFrame>

          <div className="space-y-4">
            {cities.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onMouseEnter={() => setActive(c.id)}
                  onClick={() => setActive(c.id)}
                  style={isActive ? WOOD_FRAME : undefined}
                  className={`relative w-full text-right rounded-2xl p-5 border transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden ${
                    isActive
                      ? 'border-black/20 shadow-soft -translate-y-1 scale-[1.02]'
                      : 'bg-bg-2/30 border-transparent hover:bg-bg-2/60 hover:-translate-y-1 hover:shadow-md'
                  }`}
                >
                  {isActive && (
                    <>
                      <FrameCorner position="tl" />
                      <FrameCorner position="tr" />
                      <FrameCorner position="bl" />
                      <FrameCorner position="br" />
                    </>
                  )}
                  <div className="relative flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="relative flex items-center justify-center w-3 h-3">
                        {isActive && (
                          <span className="absolute inset-0 rounded-full bg-gold-bright/60 animate-ping" />
                        )}
                        <span
                          className={`relative w-3 h-3 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                            isActive ? 'bg-gold-bright scale-125' : 'bg-wood'
                          }`}
                        />
                      </span>
                      <span className={`font-bold transition-colors duration-500 ${isActive ? 'text-[#f7efe1]' : 'text-ink'}`}>
                        {c.name}
                      </span>
                    </div>
                    <span className={`text-xs tnum transition-colors duration-500 ${isActive ? 'text-[#f7efe1]/60' : 'text-ink/40'}`}>
                      {c.orders} طلب
                    </span>
                  </div>
                  <div className={`relative text-sm pr-6 transition-colors duration-500 ${isActive ? 'text-[#f7efe1]/70' : 'text-ink/50'}`}>
                    {c.branch}
                  </div>
                </button>
              );
            })}

            <StatsPlank />
          </div>
        </div>
      </div>
    </section>
  );
}