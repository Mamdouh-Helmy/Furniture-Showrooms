import { useReveal, useCounter } from '@/hooks/useReveal';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '@/hooks/useSmoothScroll';
import { WoodFrame } from '@/components/WoodFrame';

/* ---------- data ---------- */
const MONTHS = [
  { m: 'ينا', full: 'يناير', sales: 180, orders: 64 },
  { m: 'فبر', full: 'فبراير', sales: 210, orders: 71 },
  { m: 'مار', full: 'مارس', sales: 165, orders: 58 },
  { m: 'أبر', full: 'أبريل', sales: 245, orders: 88 },
  { m: 'ماي', full: 'مايو', sales: 198, orders: 69 },
  { m: 'يون', full: 'يونيو', sales: 275, orders: 96 },
  { m: 'يول', full: 'يوليو', sales: 230, orders: 82 },
  { m: 'أغس', full: 'أغسطس', sales: 310, orders: 108 },
  { m: 'سبت', full: 'سبتمبر', sales: 265, orders: 93 },
  { m: 'أكت', full: 'أكتوبر', sales: 340, orders: 118 },
  { m: 'نوف', full: 'نوفمبر', sales: 298, orders: 104 },
  { m: 'ديس', full: 'ديسمبر', sales: 325, orders: 112 },
];

const ICONS = {
  sales: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />,
  orders: (
    <>
      <path d="M6 3h12l1 4H5l1-4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 7h14l-1.2 12.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 7Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11h6M9 15h4" strokeLinecap="round" />
    </>
  ),
  products: (
    <>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 8v8l9 5 9-5V8M12 13v8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

const SPARK = {
  sales: [40, 55, 45, 70, 60, 85, 75],
  orders: [50, 45, 60, 55, 75, 65, 80],
  products: [60, 58, 62, 59, 65, 63, 70],
};

/* ---------- smooth path helper (catmull-rom -> bezier) ---------- */
function smoothPath(points: [number, number][]) {
  if (points.length < 2) return '';
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/* ---------- stat card (wood-framed tag) ---------- */
function StatCard({
  label, value, unit, trend, icon,
}: { label: string; value: number; unit: string; trend: string; icon: keyof typeof ICONS }) {
  const ref = useCounter(value, 2, (n) => Math.round(n).toLocaleString('en-US'));
  const spark = SPARK[icon];
  const pts = spark.map((v, i) => `${i * 10},${20 - (v / 100) * 20}`).join(' ');

  return (
    <WoodFrame>
      <div className="rounded-[14px] px-5 py-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="shrink-0 w-11 h-11 rounded-full grid place-items-center bg-gradient-to-b from-black/10 to-black/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.08)] text-gold-bright">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              {ICONS[icon]}
            </svg>
          </div>
          <div className="text-sm text-[#F7EFE1]/55">{label}</div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span ref={ref} className="text-3xl sm:text-4xl font-bold text-[#F7EFE1] tnum">0</span>
              <span className="text-sm text-[#F7EFE1]/50">{unit}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#E8C77E]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17l5-5 4 4 5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-semibold text-[#E8C77E]">{trend}</span>
            </div>
          </div>
          <svg viewBox="0 0 60 20" className="w-16 h-6 opacity-80">
            <polyline points={pts} fill="none" stroke="var(--gold-bright)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </WoodFrame>
  );
}

/* ---------- interactive line chart ---------- */
const PAD_X = 3, PAD_TOP = 10, PAD_BOTTOM = 6;
const CW = 100 - PAD_X * 2, CH = 100 - PAD_TOP - PAD_BOTTOM;

function useScaled(values: number[]) {
  return useMemo(() => {
    const min = Math.min(...values), max = Math.max(...values);
    const pts: [number, number][] = values.map((v, i) => [
      PAD_X + (i / (values.length - 1)) * CW,
      PAD_TOP + (1 - (v - min) / (max - min || 1)) * CH,
    ]);
    return { pts, min, max, avg: values.reduce((a, b) => a + b, 0) / values.length };
  }, [values]);
}

function LineChart() {
  const [metric, setMetric] = useState<'sales' | 'orders'>('sales');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const salesValues = MONTHS.map((d) => d.sales);
  const ordersValues = MONTHS.map((d) => d.orders);
  const sales = useScaled(salesValues);
  const orders = useScaled(ordersValues);
  const active = metric === 'sales' ? sales : orders;
  const rawValues = metric === 'sales' ? salesValues : ordersValues;
  const activeColor = metric === 'sales' ? 'var(--gold-bright)' : '#9FD18F';
  const avgY = PAD_TOP + (1 - (active.avg - active.min) / (active.max - active.min || 1)) * CH;

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.chart-line-draw',
        { strokeDasharray: 400, strokeDashoffset: 400 },
        { strokeDashoffset: 0, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
      );
      gsap.from('.chart-area-draw', { opacity: 0, duration: 1.2, delay: 0.4, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    const rect = chartRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const rel = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const idx = Math.min(MONTHS.length - 1, Math.max(0, Math.round(rel * (MONTHS.length - 1))));
    setHoverIdx(idx);
  };

  const linePath = smoothPath(active.pts);
  const areaPath = `${linePath} L ${active.pts[active.pts.length - 1][0]},${100 - PAD_BOTTOM} L ${active.pts[0][0]},${100 - PAD_BOTTOM} Z`;
  const hovered = hoverIdx !== null ? active.pts[hoverIdx] : null;
  const lastPt = active.pts[active.pts.length - 1];

  const currentValue = hoverIdx !== null ? rawValues[hoverIdx] : null;
  const prevValue = hoverIdx !== null && hoverIdx > 0 ? rawValues[hoverIdx - 1] : null;
  const delta = currentValue !== null && prevValue ? ((currentValue - prevValue) / prevValue) * 100 : null;

  return (
    <WoodFrame>
      <div className="rounded-[14px] p-6 overflow-visible">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm text-[#F7EFE1]/55">أداء المعرض</div>
            <div className="text-lg font-bold text-[#F7EFE1]">٢٠٢٦</div>
          </div>

          <div className="relative flex rounded-xl p-1 w-44 text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.28)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)' }}>
            <div
              className="absolute top-1 bottom-1 rounded-lg transition-all duration-300"
              style={{
                width: 'calc(50% - 4px)',
                insetInlineStart: metric === 'sales' ? '4px' : '50%',
                background: 'linear-gradient(135deg, var(--gold-bright), #b8863f)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            />
            <button onClick={() => setMetric('sales')} className={`relative z-10 flex-1 py-1.5 rounded-lg transition-colors ${metric === 'sales' ? 'text-[#2e1c0f]' : 'text-[#F7EFE1]/45'}`}>
              المبيعات
            </button>
            <button onClick={() => setMetric('orders')} className={`relative z-10 flex-1 py-1.5 rounded-lg transition-colors ${metric === 'orders' ? 'text-[#2e1c0f]' : 'text-[#F7EFE1]/45'}`}>
              الطلبات
            </button>
          </div>
        </div>

        {/* Forced LTR: the SVG plots x=0 at the physical left edge no matter
            the page direction. Without this the RTL page flips the flex
            order of the month labels and the insetInlineStart-based overlay
            math below, while the SVG never moves — causing the crosshair
            to land on the wrong month. Arabic text still renders normally. */}
        <div
          ref={chartRef}
          dir="ltr"
          className="relative mt-6 cursor-crosshair overflow-visible"
          style={{ height: 220 }}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeColor} stopOpacity="0.32" />
                <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
              </linearGradient>
              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.4" />
              </filter>
            </defs>

            {[0.25, 0.5, 0.75].map((f) => (
              <line key={f} x1={PAD_X} x2={100 - PAD_X} y1={PAD_TOP + CH * f} y2={PAD_TOP + CH * f} stroke="#FFFFFF" strokeOpacity="0.08" vectorEffect="non-scaling-stroke" />
            ))}
            <line x1={PAD_X} x2={100 - PAD_X} y1={avgY} y2={avgY} stroke="#FFFFFF" strokeOpacity="0.25" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />

            <path className="chart-area-draw" d={areaPath} fill="url(#areaGrad)" stroke="none" />
            <path d={linePath} fill="none" stroke={activeColor} strokeWidth="5" strokeOpacity="0.3" filter="url(#lineGlow)" vectorEffect="non-scaling-stroke" />
            <path className="chart-line-draw" d={linePath} fill="none" stroke={activeColor} strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

            <circle cx={lastPt[0]} cy={lastPt[1]} r="1.6" fill={activeColor} className="hotspot-pulse" />
          </svg>

          {hovered && hoverIdx !== null && (
            <>
              <div className="absolute top-0 bottom-0 w-px bg-white/15 pointer-events-none transition-all duration-150 z-10" style={{ insetInlineStart: `${hovered[0]}%` }} />
              <div
                className="absolute w-3 h-3 rounded-full border-2 pointer-events-none transition-all duration-150 z-10"
                style={{ insetInlineStart: `${hovered[0]}%`, top: `${hovered[1]}%`, borderColor: activeColor, background: 'rgba(20,12,6,0.65)', transform: 'translate(-50%,-50%)' }}
              />
              <div
                className="glass-dark absolute rounded-xl px-3.5 py-2.5 text-xs pointer-events-none transition-all duration-150 whitespace-nowrap z-20"
                style={{
                  insetInlineStart: `${hovered[0]}%`,
                  top: `${hovered[1]}%`,
                  transform: `translate(${hovered[0] > 80 ? '-90%' : hovered[0] < 20 ? '-10%' : '-50%'}, -100%) translateY(-14px)`,
                  color: '#F7EFE1',
                }}
              >
                <div className="font-semibold mb-1">{MONTHS[hoverIdx].full} ٢٠٢٦</div>
                <div className="flex items-center gap-1.5 tnum font-bold" style={{ color: activeColor }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeColor }} />
                  {metric === 'sales' ? `${currentValue} ألف جنيه` : `${currentValue} طلب`}
                </div>
                {delta !== null && (
                  <div className="text-[10px] mt-1 tnum" style={{ color: delta >= 0 ? '#BFE0B5' : '#E8B0A6' }}>
                    {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}% عن {MONTHS[hoverIdx - 1]?.full}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div dir="ltr" className="flex justify-between mt-3 px-1">
          {MONTHS.map((d, i) => (
            <span
              key={d.m}
              className={`transition-all duration-200 whitespace-nowrap ${hoverIdx === i ? 'text-[#F7EFE1] font-bold text-[10px]' : 'text-[#F7EFE1]/35 text-[9px]'}`}
            >
              {hoverIdx === i ? d.full : d.m}
            </span>
          ))}
        </div>
      </div>
    </WoodFrame>
  );
}

/* ---------- goal gauge + branches ---------- */
function GoalGauge({ percent, current, target }: { percent: number; current: string; target: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const R = 52, C = 2 * Math.PI * R;

  useEffect(() => {
    const el = wrapRef.current;
    const circle = el?.querySelector('.gauge-progress');
    if (!el || !circle) return;
    gsap.set(circle, { strokeDasharray: C, strokeDashoffset: C });
    const ctx = gsap.context(() => {
      gsap.to(circle, { strokeDashoffset: C * (1 - percent / 100), duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    }, el);
    return () => ctx.revert();
  }, [percent]);

  return (
    <div ref={wrapRef} className="flex flex-col items-center py-2">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--gold-bright)" />
              <stop offset="100%" stopColor="#9FD18F" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
          <circle className="gauge-progress" cx="60" cy="60" r={R} fill="none" stroke="url(#gaugeGrad)" strokeWidth="9" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F7EFE1] tnum">{percent}%</div>
            <div className="text-[10px] text-[#F7EFE1]/50">من الهدف</div>
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-[#F7EFE1]/55 tnum">{current} من {target}</div>
    </div>
  );
}

function SidePanel() {
  return (
    <WoodFrame>
      <div className="rounded-[14px] p-6 flex flex-col">
        <div className="text-sm text-[#F7EFE1]/55 mb-1">الهدف الشهري</div>
        <GoalGauge percent={82} current="284.5 ألف" target="345 ألف" />

        <div className="mt-2 pt-4 border-t border-white/10">
          <div className="text-sm text-[#F7EFE1]/55 mb-3">أداء الفروع</div>
          <div className="space-y-2">
            {[{ b: 'دمياط', v: 92 }, { b: 'القاهرة', v: 78 }, { b: 'الإسكندرية', v: 65 }].map((f) => (
              <div key={f.b} className="flex items-center gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--gold-bright)' }} />
                <span className="text-[#F7EFE1]/70 flex-1">{f.b}</span>
                <span className="font-bold text-[#F7EFE1] tnum">{f.v}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WoodFrame>
  );
}

/* ---------- section ---------- */
export default function DashboardSection() {
  const ref = useReveal<HTMLDivElement>();
  const dashRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, { y: -20, scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${-py * 3}deg`);
      el.style.setProperty('--ry', `${px * 3}deg`);
    };
    const onLeave = () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <section id="dashboard" className="relative py-16 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div data-reveal className="text-center mb-14">
          <div className="eyebrow mb-4">لوحة التحكم</div>
          <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ink mb-4">
            <span className="relative inline-block pb-4">
              أرقام معرضك، حية أمامك.
              <svg className="absolute left-0 bottom-0 w-full h-3 text-gold" viewBox="0 0 200 16" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path
                  d="M2 9 Q 8 4 14 9 T 26 9 T 38 9 T 50 9 T 62 9 T 74 9 T 86 9 T 98 9 T 110 9 T 122 9 T 134 9 T 146 9 T 158 9 T 170 9 T 182 9 T 194 9"
                  stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" fill="none"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-ink/55 max-w-xl mx-auto">
            حرّك الماوس فوق الرسم البياني، وبدّل بين المبيعات والطلبات في أي وقت.
          </p>

          <svg className="mx-auto mt-1 w-10 h-12 text-gold" viewBox="0 0 40 50" fill="none" aria-hidden="true">
            <path d="M14 4 C 10 14, 26 12, 22 24 C 18 34, 26 34, 26 46" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M22 40 L26 46 L30 40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        <div
          ref={dashRef}
          data-reveal
          className="relative grain rounded-3xl border border-ink/8 p-6 sm:p-8 shadow-float"
          style={{
            background: `
              repeating-linear-gradient(
                115deg,
                rgba(255,255,255,0.04) 0px,
                rgba(255,255,255,0.04) 1px,
                transparent 1px,
                transparent 3px
              ),
              linear-gradient(
                135deg,
                #4a2f1c 0%,
                #5a3820 20%,
                #402a18 38%,
                #603c22 55%,
                #3c2716 72%,
                #55351d 88%,
                #35220f 100%
              )
            `,
            boxShadow:
              'inset 0 0 0 1px rgba(0,0,0,0.4), inset 0 -3px 8px rgba(0,0,0,0.45), 0 24px 40px -16px rgba(30,18,9,0.6)',
          }}
        >
          <div ref={tiltRef} className="tilt-panel" style={{ transform: 'perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}>
            <div className="grid sm:grid-cols-3 gap-5 mb-6">
              <StatCard icon="sales" label="المبيعات" value={284500} unit="جنيه" trend="+12% هذا الشهر" />
              <StatCard icon="orders" label="الطلبات" value={126} unit="طلب" trend="+8% هذا الشهر" />
              <StatCard icon="products" label="المنتجات" value={1248} unit="منتج" trend="مخزون محدّث" />
            </div>

            <div className="grid lg:grid-cols-[1.7fr_1fr] gap-5">
              <LineChart />
              <SidePanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}