import { useState, useMemo, useRef, useEffect } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface Plan {
  name: string;
  perBranch: number;
  features: string[];
  highlight?: boolean;
}

const plans: Plan[] = [
  {
    name: 'البداية',
    perBranch: 499,
    features: ['إدارة المنتجات والمخزون', 'لوحة تحكم أساسية', 'حتى فرعين', 'دعم بالبريد الإلكتروني'],
  },
  {
    name: 'المعرض',
    perBranch: 899,
    highlight: true,
    features: ['كل ميزات البداية', 'إدارة الفروع المتعددة', 'تقارير المبيعات الحية', 'مساعد ذكي', 'دعم أولوية'],
  },
  {
    name: 'السلسلة',
    perBranch: 1499,
    features: ['كل ميزات المعرض', 'فروع غير محدودة', 'API مخصص', 'مدير حساب مخصص', 'تدريب الفريق'],
  },
];

const MIN_BRANCHES = 1;
const MAX_BRANCHES = 10;

function getPlan(branchCount: number): Plan {
  if (branchCount <= 2) return plans[0];
  if (branchCount <= 8) return plans[1];
  return plans[2];
}

const WOOD_FRAME: React.CSSProperties = {
  background: `
    repeating-linear-gradient(
      115deg,
      rgba(255,255,255,0.05) 0px,
      rgba(255,255,255,0.05) 1px,
      transparent 1px,
      transparent 3px
    ),
    linear-gradient(
      160deg,
      #6b4226 0%,
      #7c4f2c 20%,
      #5a3820 38%,
      #85572f 58%,
      #603c22 76%,
      #55351d 100%
    )
  `,
};

function FrameCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotation = { tl: '0deg', tr: '90deg', bl: '270deg', br: '180deg' }[position];
  const placement = {
    tl: 'top-1 left-1', tr: 'top-1 right-1', bl: 'bottom-1 left-1', br: 'bottom-1 right-1',
  }[position];
  return (
    <div className={`absolute ${placement} w-5 h-5 pointer-events-none`} style={{ transform: `rotate(${rotation})` }}>
      <svg viewBox="0 0 20 20" className="w-full h-full">
        <line x1="0" y1="0" x2="20" y2="20" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
        <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function BranchRuler({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const targetPctRef = useRef<number | null>(null);
  const valueRef = useRef(value);
  const [isRTL] = useState(() =>
    typeof document !== 'undefined' ? getComputedStyle(document.documentElement).direction === 'rtl' : true
  );

  const settledPct = ((value - MIN_BRANCHES) / (MAX_BRANCHES - MIN_BRANCHES)) * 100;
  const [visualPct, setVisualPct] = useState(settledPct);
  const [isDragging, setIsDragging] = useState(false);

  // خلي الـ ref متزامن دايمًا مع أحدث value (بدون ما يدخل في deps تاعت الـ listeners)
  useEffect(() => {
    valueRef.current = value;
    if (!draggingRef.current) setVisualPct(settledPct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

  const pctFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    let p = (clientX - rect.left) / rect.width;
    p = clamp(p, 0, 1);
    if (isRTL) p = 1 - p;
    return p * 100;
  };

  const cancelLoop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null; // مهم جدًا: من غير كده الجدولة الجاية هتفضل مرفوضة
    }
  };

  const tick = () => {
    if (targetPctRef.current == null) {
      rafRef.current = null;
      return;
    }
    setVisualPct((prev) => {
      const target = targetPctRef.current as number;
      const next = prev + (target - prev) * 0.35;
      const done = Math.abs(target - next) < 0.05;
      const finalVal = done ? target : next;

      const rounded = clamp(
        Math.round(MIN_BRANCHES + (finalVal / 100) * (MAX_BRANCHES - MIN_BRANCHES)),
        MIN_BRANCHES,
        MAX_BRANCHES
      );
      if (rounded !== valueRef.current) {
        valueRef.current = rounded;
        onChange(rounded);
      }

      if (!done && (draggingRef.current || rafRef.current !== null)) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
      return finalVal;
    });
  };

  const ensureLoop = () => {
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
  };

  const startDrag = (clientX: number) => {
    draggingRef.current = true;
    setIsDragging(true);
    targetPctRef.current = pctFromClientX(clientX);
    ensureLoop();
  };

  const moveDrag = (clientX: number) => {
    if (!draggingRef.current) return;
    targetPctRef.current = pctFromClientX(clientX);
    ensureLoop();
  };

  const stopDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    const finalPct = ((valueRef.current - MIN_BRANCHES) / (MAX_BRANCHES - MIN_BRANCHES)) * 100;
    targetPctRef.current = finalPct;
    ensureLoop();
  };

  // الليسنرز بتتسجل مرة واحدة بس — من غير ما تتأثر بتغيّر value أثناء السحب
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      moveDrag(clientX);
    };
    const onUp = () => stopDrag();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      cancelLoop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const increaseKey = isRTL ? 'ArrowLeft' : 'ArrowRight';
    const decreaseKey = isRTL ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === increaseKey || e.key === 'ArrowUp') { e.preventDefault(); onChange(Math.min(MAX_BRANCHES, value + 1)); }
    else if (e.key === decreaseKey || e.key === 'ArrowDown') { e.preventDefault(); onChange(Math.max(MIN_BRANCHES, value - 1)); }
    else if (e.key === 'Home') onChange(MIN_BRANCHES);
    else if (e.key === 'End') onChange(MAX_BRANCHES);
  };

  const ticks = Array.from({ length: MAX_BRANCHES }, (_, i) => i + 1);
  const sideStyle = (edgePct: number) => (isRTL ? { right: `${edgePct}%` } : { left: `${edgePct}%` });

  return (
    <div
      ref={trackRef}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      className="relative h-16 rounded-xl cursor-pointer select-none touch-none"
      style={{
        background: 'linear-gradient(180deg, #F4EEDB 0%, #EAE0C2 100%)',
        boxShadow: 'inset 0 0 0 1px rgba(90,56,32,0.18), inset 0 2px 5px rgba(90,56,32,0.18), 0 10px 20px -14px rgba(40,24,12,0.35)',
      }}
    >
      <div
        className="absolute inset-y-0 rounded-xl"
        style={{
          ...sideStyle(0),
          width: `${visualPct}%`,
          background: 'rgba(122, 158, 116, 0.22)',
          transition: isDragging ? 'none' : 'width 0.25s ease-out',
        }}
      />
      <div className="absolute inset-0 flex items-end justify-between px-4 pb-2 pointer-events-none">
        {ticks.map((n) => (
          <div key={n} className="flex flex-col items-center gap-1 w-4">
            <span className="block w-px bg-[#5a3820]/45" style={{ height: n % 5 === 0 ? 18 : 10 }} />
            <span className="text-[10px] tnum text-[#5a3820]/60 font-semibold">{n === MAX_BRANCHES ? '10+' : n}</span>
          </div>
        ))}
      </div>
      <div
        role="slider" tabIndex={0} aria-valuemin={MIN_BRANCHES} aria-valuemax={MAX_BRANCHES}
        aria-valuenow={value} aria-label="عدد الفروع" onKeyDown={handleKeyDown}
        className="absolute top-1/2 w-10 h-10 rounded-full grid place-items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
        style={{
          ...sideStyle(visualPct),
          transform: `translate(${isRTL ? '50%' : '-50%'}, -50%)`,
          background: 'radial-gradient(circle at 35% 30%, #EACB8B, #A9812F 60%, #7A5A1E 100%)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.45)',
          transition: isDragging ? 'none' : 'left 0.25s ease-out, right 0.25s ease-out',
        }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#5a3820]/70" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 12h16" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- signature element: the price panel as a solid wood plank.
   The CTA button now stays in the metal/wood family for BOTH plans —
   brushed bronze for the regular plan, bright brass for the
   highlighted one — instead of a cream button that read as a foreign
   material dropped onto the wood. ---------- */
function PriceTag({ plan, totalPrice }: { plan: Plan; totalPrice: number }) {
  return (
    <div
      style={WOOD_FRAME}
      className="relative p-8 sm:p-10 pt-14 h-full flex flex-col rounded-t-3xl lg:rounded-t-none lg:rounded-s-3xl"
    >
      <FrameCorner position="tl" />
      <div className="lg:hidden">
        <FrameCorner position="tr" />
      </div>
      <FrameCorner position="bl" />
      <div className="lg:hidden">
        <FrameCorner position="br" />
      </div>

      <div className="hidden lg:block absolute inset-y-10 end-0 translate-x-1/2 rtl:translate-x-1/2 pointer-events-none" aria-hidden="true">
        <div className="flex flex-col justify-between h-full">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="block w-3 h-3 rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #EACB8B, #8a662a 65%, #5f461c 100%)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      </div>

      <svg className="absolute top-0 start-10 -translate-y-1/2" width="30" height="28" viewBox="0 0 30 28" fill="none" aria-hidden="true">
        <path d="M15 28 C 7 20, 7 9, 15 5" stroke="#3d2914" strokeOpacity="0.5" strokeWidth="1.5" fill="none" />
        <circle cx="15" cy="5" r="5" fill="#8a662a" stroke="#3d2914" strokeOpacity="0.4" strokeWidth="1" />
        <circle cx="15" cy="5" r="2" fill="#3d2914" fillOpacity="0.5" />
      </svg>

      {plan.highlight && (
        <div
          className="absolute top-8 end-8 sm:end-10 w-16 h-16 rounded-full grid place-items-center text-center rotate-[-9deg] pointer-events-none"
          style={{ border: '1.5px dashed rgba(234,203,139,0.55)' }}
        >
          <span className="text-[9px] font-bold leading-tight" style={{ color: '#F3D98B' }}>
            الأكثر
            <br />
            اختيارًا
          </span>
        </div>
      )}

      <div className="relative flex items-center gap-2 mb-4">
        <h3 className="display text-2xl text-[#f7efe1]">{plan.name}</h3>
      </div>

      <div className="relative flex items-baseline gap-2 mb-2">
        <span className="text-5xl font-bold text-[#f7efe1] tnum">{totalPrice.toLocaleString('en-US')}</span>
        <span className="text-lg text-[#f7efe1]/60">جنيه / شهر</span>
      </div>
      <div className="relative text-sm text-[#f7efe1]/45 mb-6">{plan.perBranch.toLocaleString('en-US')} جنيه لكل فرع</div>

      <a
        href="#cta"
        style={
          plan.highlight
            ? {
              background: 'linear-gradient(180deg, #F3D98B 0%, #C99A3E 100%)',
              color: '#3d2914',
              boxShadow: '0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.25)',
            }
            : {
              background: 'linear-gradient(180deg, #B08C55 0%, #7A5A32 55%, #63451f 100%)',
              color: '#F7EFE1',
              boxShadow: '0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.15)',
            }
        }
        className="relative block text-center px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
      >
        ابدأ الآن
      </a>

      <div className="relative mt-6 text-xs text-[#f7efe1]/40">بدون رسوم إعداد. إلغاء في أي وقت.</div>
    </div>
  );
}

export default function PricingSection() {
  const ref = useReveal<HTMLDivElement>();
  const [branchCount, setBranchCount] = useState(3);

  const plan = useMemo(() => getPlan(branchCount), [branchCount]);
  const totalPrice = plan.perBranch * branchCount;

  return (
    <section id="pricing" className="relative py-24 sm:py-32 px-6 bg-bg-2/40">
      <div ref={ref} className="max-w-4xl mx-auto">
        <div data-reveal className="text-center mb-14">
          <div className="eyebrow mb-4">الأسعار</div>
          <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ink mb-4">
            قِس معرضك،
            <br />
            <span className="relative inline-block pb-3 text-sage">
              واعرف السعر.
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
            حرّك مقبض الشريط لتعرف سعر خطتك بناءً على عدد فروعك.
          </p>

          <svg className="mx-auto mt-1 w-10 h-12 text-gold" viewBox="0 0 40 50" fill="none" aria-hidden="true">
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

        <div data-reveal className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-ink/60">كم فرعًا لديك؟</span>
            <span className="px-4 py-1.5 rounded-full bg-sage text-bg text-sm font-bold tnum">
              {branchCount} {branchCount === 1 ? 'فرع' : branchCount === 2 ? 'فرعين' : 'فروع'}
            </span>
          </div>
          <BranchRuler value={branchCount} onChange={setBranchCount} />
        </div>

        <div data-reveal className="relative rounded-3xl bg-bg border border-ink/8 shadow-float overflow-hidden transition-all duration-500">
          {plan.highlight && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-sage to-gold z-10" />}

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-0">
            <PriceTag plan={plan} totalPrice={totalPrice} />

            <div className="p-8 sm:p-10">
              <div className="text-sm font-semibold text-ink/60 mb-4">ما الذي تحصل عليه:</div>
              <div className="space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="grid place-items-center w-6 h-6 rounded-full bg-sage/15 text-sage shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-sm text-ink/75 font-medium">{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-ink/8">
                <div className="flex gap-2">
                  {plans.map((p, i) => (
                    <button
                      key={p.name}
                      onClick={() => setBranchCount(i === 0 ? 1 : i === 1 ? 3 : 9)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${plan.name === p.name ? 'bg-sage/15 text-sage' : 'text-ink/40 hover:text-ink/70'
                        }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}