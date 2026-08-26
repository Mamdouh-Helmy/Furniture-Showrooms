import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from '@/hooks/useSmoothScroll';
import { useReveal } from '@/hooks/useReveal';

interface Hotspot {
  id: string;
  label: string;
  desc: string;
  x: number;
  y: number;
  icon: string;
}

const hotspots: Hotspot[] = [
  { id: 'products', label: 'المنتجات', desc: 'أضف منتجاتك، نظم التصنيفات، تابع المخزون.', x: 34, y: 62, icon: 'cube' },
  { id: 'branches', label: 'الفروع', desc: 'كل فروعك من شاشة واحدة مع مزامنة لحظية.', x: 72, y: 30, icon: 'store' },
  { id: 'customers', label: 'العملاء', desc: 'قاعدة عملاء موحدة وتاريخ شراء كامل.', x: 16, y: 70, icon: 'users' },
  { id: 'sales', label: 'المبيعات', desc: 'تقارير حية وأداء كل فرع في لمح البصر.', x: 56, y: 80, icon: 'chart' },
];

const HOLD_DURATION = 2.1;
const MOVE_DURATION = 0.9;
const RESUME_DELAY = 5000;

const SHOWROOM_IMAGE =
  'https://images.unsplash.com/photo-1750639258774-9a714379a093?auto=format&fit=crop&w=1200&q=65';

function useInView<T extends HTMLElement>(rootMargin = '200px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

function HotspotIcon({ name }: { name: string }) {
  const p = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'cube':
      return (
        <svg {...p}>
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
        </svg>
      );
    case 'store':
      return (
        <svg {...p}>
          <path d="M3 9l1-5h16l1 5M4 9v11h16V9M9 20v-6h6v6" />
        </svg>
      );
    case 'users':
      return (
        <svg {...p}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M18 17V9M13 17V5M8 17v-3" />
        </svg>
      );
    default:
      return null;
  }
}

function ProductGlyph({ name }: { name: 'sofa' | 'chair' | 'table' }) {
  const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'sofa') {
    return (
      <svg {...p}>
        <path d="M4 12v5a2 2 0 002 2h12a2 2 0 002-2v-5" />
        <path d="M4 12a2 2 0 012-2h12a2 2 0 012 2" />
        <path d="M6 10V8a2 2 0 012-2h8a2 2 0 012 2v2" />
        <path d="M4 16h16" />
      </svg>
    );
  }
  if (name === 'chair') {
    return (
      <svg {...p}>
        <path d="M6 4v9a2 2 0 002 2h8a2 2 0 002-2V4" />
        <path d="M8 15v5M16 15v5" />
        <path d="M6 9h12" />
      </svg>
    );
  }
  return (
    <svg {...p}>
      <ellipse cx="12" cy="7" rx="8" ry="3" />
      <path d="M4 7v3M20 7v3M12 10v10" />
      <path d="M8 20h8" />
    </svg>
  );
}

const productItems = [
  { name: 'كنبة Milano', price: '18,500 ج', glyph: 'sofa' as const },
  { name: 'كرسي Oak', price: '3,200 ج', glyph: 'chair' as const },
  { name: 'طاولة رخام', price: '6,800 ج', glyph: 'table' as const },
];

const branchItems = [
  { name: 'فرع القاهرة', city: 'القاهرة', pct: 92, top: true },
  { name: 'فرع الإسكندرية', city: 'الإسكندرية', pct: 71, top: false },
];

const customerAvatars = [
  { initial: 'س', tier: 'ذهبي' },
  { initial: 'م', tier: 'فضي' },
  { initial: 'ل', tier: 'فضي' },
];

const salesBars = [40, 55, 35, 70, 58, 85];

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- required for JSX custom-element typing
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        'camera-controls'?: boolean;
        'disable-zoom'?: boolean;
        'auto-rotate'?: boolean;
        'rotation-per-second'?: string;
        'camera-orbit'?: string;
        'shadow-intensity'?: string;
        'interaction-prompt'?: string;
        'environment-image'?: string;
        'power-preference'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'interaction' | 'manual';
        exposure?: string;
      };
    }
  }
}

interface ModelViewerElement extends HTMLElement {
  getCameraOrbit?: () => { theta: number; phi: number; radius: number };
}

const PRODUCT_MODELS = [
  {
    id: 'chair',
    label: 'كرسي مكتب كلاسيك',
    code: 'CH-014',
    price: '3,200 ج',
    material: 'خشب زان + قماش كتان',
    src: '/models/chair.glb',
    cameraOrbit: '15deg 75deg 120%',
  },
  {
    id: 'chair-gaming',
    label: 'كرسي ألعاب Racer',
    code: 'CH-027',
    price: '5,600 ج',
    material: 'جلد PU + هيكل معدني',
    src: '/models/chair-gaming.glb',
    cameraOrbit: '15deg 75deg 120%',
  },
  {
    id: 'dining-table',
    label: 'سفرة طعام',
    code: 'TB-041',
    price: '9,400 ج',
    material: 'خشب بلوط + رخام طبيعي',
    src: '/models/dining-table.glb',
    cameraOrbit: '15deg 75deg 120%',
  },
] as const;

const HotspotBody = memo(function HotspotBody({ id }: { id: string }) {
  if (id === 'products') {
    return (
      <div className="space-y-1.5">
        {productItems.map((p) => (
          <div key={p.name} className="flex items-center gap-2 rounded-lg bg-bg-2/60 px-2 py-1.5">
            <span className="grid place-items-center w-6 h-6 rounded-md bg-sage/15 text-sage shrink-0">
              <ProductGlyph name={p.glyph} />
            </span>
            <span className="text-[10.5px] font-semibold text-ink flex-1 truncate">{p.name}</span>
            <span className="text-[10px] font-bold text-ink/60 tnum shrink-0">{p.price}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'branches') {
    return (
      <div className="space-y-2">
        {branchItems.map((b) => (
          <div key={b.name} className="rounded-lg bg-bg-2/60 px-2.5 py-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <HotspotIcon name="store" />
                <span className="text-[10.5px] font-semibold text-ink">{b.name}</span>
              </div>
              {b.top && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
            </div>
            <div className="h-1.5 rounded-full bg-ink/8 overflow-hidden">
              <div className={`h-full rounded-full ${b.top ? 'bg-gold' : 'bg-sage'}`} style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'customers') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2 space-x-reverse">
          {customerAvatars.map((a) => (
            <div
              key={a.initial}
              className="w-7 h-7 rounded-full bg-sage/20 border-2 border-bg grid place-items-center text-[10px] font-bold text-sage"
            >
              {a.initial}
            </div>
          ))}
        </div>
        <span className="text-[10px] font-semibold text-ink/50">+343 عميل</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end gap-1 h-10 mb-1">
        {salesBars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-sage to-sage-light" style={{ height: `${h}%` }} />
        ))}
      </div>
      <span className="text-[10px] font-bold text-sage">+18% عن الشهر اللي فات</span>
    </div>
  );
});

function parseRestingAngle(orbit: string): number {
  const match = orbit.match(/(-?\d+(?:\.\d+)?)deg/);
  if (!match) return 0;
  const deg = parseFloat(match[1]);
  return ((deg % 360) + 360) % 360;
}

const AngleDial = memo(function AngleDial({ dialRef }: { dialRef: React.Ref<SVGGElement> }) {
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
      <circle cx="100" cy="100" r="94" fill="none" className="stroke-white/[0.08]" strokeWidth="1" />
      {ticks.map((t) => {
        const rad = (t * Math.PI) / 180;
        const inner = 86;
        const outer = t % 90 === 0 ? 76 : 82;
        const x1 = 100 + inner * Math.sin(rad);
        const y1 = 100 - inner * Math.cos(rad);
        const x2 = 100 + outer * Math.sin(rad);
        const y2 = 100 - outer * Math.cos(rad);
        return (
          <line
            key={t}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={t % 90 === 0 ? 'stroke-white/25' : 'stroke-white/10'}
            strokeWidth={t % 90 === 0 ? 1.6 : 1}
            strokeLinecap="round"
          />
        );
      })}
      <g ref={dialRef} style={{ transformOrigin: '100px 100px' }}>
        <circle cx="100" cy="14" r="3.5" className="fill-gold" />
        <line x1="100" y1="24" x2="100" y2="40" className="stroke-gold/40" strokeWidth="1.5" />
      </g>
    </svg>
  );
});

function RotateHintIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 1 3.2 6.9" />
      <path d="M3 20v-6h6" />
    </svg>
  );
}

let modelViewerLoadPromise: Promise<void> | null = null;
function loadModelViewer(): Promise<void> {
  if (customElements.get('model-viewer')) return Promise.resolve();
  if (modelViewerLoadPromise) return modelViewerLoadPromise;
  modelViewerLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return modelViewerLoadPromise;
}

function ProductSpinner() {
  const { ref: stageRef, inView } = useInView<HTMLDivElement>('150px');
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    loadModelViewer().then(() => {
      if (!cancelled) setScriptReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [inView]);

  const [modelId, setModelId] = useState<(typeof PRODUCT_MODELS)[number]['id']>('chair');
  const model = PRODUCT_MODELS.find((m) => m.id === modelId) ?? PRODUCT_MODELS[0];

  const viewerRef = useRef<ModelViewerElement>(null);
  const dialRef = useRef<SVGGElement>(null);
  const [angleLabel, setAngleLabel] = useState(() => Math.round(parseRestingAngle(model.cameraOrbit)));
  const rafPendingRef = useRef(false);

  const [loadPct, setLoadPct] = useState<number | null>(0);

  const prefetchModel = useCallback((src: string) => {
    if (typeof window === 'undefined') return;
    const already = document.head.querySelector(`link[data-prefetch="${src}"]`);
    if (already) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'fetch';
    link.href = src;
    link.crossOrigin = 'anonymous';
    link.dataset.prefetch = src;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const resting = parseRestingAngle(model.cameraOrbit);
    setAngleLabel(Math.round(resting));
    if (dialRef.current) dialRef.current.style.transform = `rotate(${resting}deg)`;
    setLoadPct(0);

    if (!scriptReady || !inView) return;
    const el = viewerRef.current;
    if (!el) return;

    const handleProgress = (e: Event) => {
      const fraction = (e as CustomEvent<{ totalProgress?: number }>).detail?.totalProgress;
      if (typeof fraction !== 'number') return;
      setLoadPct(fraction >= 1 ? null : Math.round(fraction * 100));
    };
    el.addEventListener('progress', handleProgress);

    const handleCameraChange = () => {
      if (rafPendingRef.current) return;
      rafPendingRef.current = true;
      requestAnimationFrame(() => {
        rafPendingRef.current = false;
        try {
          const orbit = typeof el.getCameraOrbit === 'function' ? el.getCameraOrbit() : null;
          if (!orbit) return;
          const deg = (orbit.theta * 180) / Math.PI;
          const normalized = ((deg % 360) + 360) % 360;
          if (dialRef.current) dialRef.current.style.transform = `rotate(${normalized}deg)`;
          setAngleLabel((prev) => {
            const rounded = Math.round(normalized);
            return rounded === prev ? prev : rounded;
          });
        } catch {
          // model-viewer not fully upgraded yet — ignore, next tick will work
        }
      });
    };

    el.addEventListener('camera-change', handleCameraChange);
    return () => {
      el.removeEventListener('camera-change', handleCameraChange);
      el.removeEventListener('progress', handleProgress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId, scriptReady, inView]);

  return (
    <div ref={stageRef} className="rounded-[28px] bg-bg border border-ink/8 shadow-float overflow-hidden">
      <div className="grid sm:grid-cols-[1fr,1.15fr]">
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="eyebrow mb-2">عرض 360°</div>
            <h3 className="display text-xl sm:text-2xl text-ink mb-2">دوّر المنتج بإيدك</h3>
            <p className="text-ink/60 leading-relaxed max-w-sm mb-6">
              اسحب على المجسم عشان تلفه على كل جوانبه — إضاءة وظلال حقيقية، بالظبط زي ما بيشوفه عميلك في التطبيق.
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {PRODUCT_MODELS.map((m) => {
              const isActive = m.id === modelId;
              return (
                <button
                  key={m.id}
                  onClick={() => setModelId(m.id)}
                  onMouseEnter={() => prefetchModel(m.src)}
                  onFocus={() => prefetchModel(m.src)}
                  aria-pressed={isActive}
                  className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-right transition-colors ${
                    isActive ? 'border-sage bg-sage/[0.06]' : 'border-ink/8 hover:border-ink/20'
                  }`}
                >
                  <span className={`w-1 self-stretch rounded-full ${isActive ? 'bg-sage' : 'bg-transparent'}`} />
                  <span className="flex-1 min-w-0">
                    <span className={`block text-[13px] font-semibold truncate ${isActive ? 'text-ink' : 'text-ink/70'}`}>
                      {m.label}
                    </span>
                    <span className="block text-[10.5px] text-ink/45 truncate">{m.material}</span>
                  </span>
                  <span className="text-[11px] font-bold text-ink/70 tnum shrink-0">{m.price}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10.5px] text-ink/40 border-t border-ink/8 pt-3">
            <span className="tnum">كود المنتج {model.code}</span>
            <span className="flex items-center gap-1.5">
              <RotateHintIcon />
              اسحب للتدوير
            </span>
          </div>
        </div>

        <div
          className="relative sm:border-r sm:border-black/10 min-h-[300px] sm:min-h-[380px] flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(155deg, #6b4a30 0%, #4a3220 48%, #2c1d13 100%)' }}
        >
          <div
            className="absolute inset-0 mix-blend-multiply opacity-70"
            style={{
              backgroundImage:
                'repeating-linear-gradient(97deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px, transparent 4px, transparent 10px)',
            }}
          />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent 0px, transparent 116px, rgba(0,0,0,0.35) 116px, rgba(0,0,0,0.35) 118px)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 0.5px, transparent 0.5px)',
              backgroundSize: '3px 3px',
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(65% 55% at 26% 10%, rgba(255,214,160,0.22), transparent 65%)' }}
          />
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 90px 26px rgba(0,0,0,0.4)' }} />

          <div className="relative w-[78%] max-w-[280px] aspect-square">
            <AngleDial dialRef={dialRef} />

            <div
              className="absolute left-1/2 bottom-[10%] -translate-x-1/2 w-[58%] h-[12%] rounded-[50%] bg-black/45 blur-md"
              aria-hidden
            />

            {scriptReady ? (
              <>
                <model-viewer
                  ref={viewerRef}
                  key={model.id}
                  src={model.src}
                  alt={`${model.label} ثلاثي الأبعاد قابل للتدوير`}
                  camera-controls
                  disable-zoom
                  auto-rotate={inView}
                  rotation-per-second="16deg"
                  camera-orbit={model.cameraOrbit}
                  shadow-intensity="0"
                  exposure="0.95"
                  interaction-prompt="none"
                  environment-image="neutral"
                  power-preference="low-power"
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                />
                {loadPct !== null && (
                  <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
                    <span className="rounded-full bg-black/40 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold text-white/80 tnum">
                      جارِ التحميل {loadPct}%
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full grid place-items-center text-white/30 text-xs">جارِ التحميل…</div>
            )}
          </div>

          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur border border-white/10 px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[11px] font-bold text-white/90 tnum tabular-nums w-9 text-center">
              {angleLabel}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveShowroom() {
  const [active, setActive] = useState<string>(hotspots[0].id);
  const ref = useReveal<HTMLDivElement>();
  const frameRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const resumeTimerRef = useRef<number | undefined>(undefined);
  const { ref: sectionInViewRef, inView: sectionInView } = useInView<HTMLElement>('100px');

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const click = (tl: gsap.core.Timeline) => {
      tl.to(rippleRef.current, { scale: 1, opacity: 0.55, duration: 0.15 })
        .to(rippleRef.current, { scale: 2.2, opacity: 0, duration: 0.4 }, '>-0.05')
        .to(cursor, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, '<');
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } });
      hotspots.forEach((h) => {
        tl.to(cursor, { left: `${h.x}%`, top: `${h.y}%`, duration: MOVE_DURATION }, '+=0.2');
        click(tl);
        tl.call(() => setActive(h.id));
        tl.to({}, { duration: HOLD_DURATION });
      });
      tlRef.current = tl;
    }, frameRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (sectionInView) {
      tlRef.current?.play();
    } else {
      tlRef.current?.pause();
    }
  }, [sectionInView]);

  const setSectionRefs = useCallback(
    (node: HTMLElement | null) => {
      (sectionInViewRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [sectionInViewRef]
  );

  const selectManually = (h: Hotspot) => {
    tlRef.current?.pause();
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { left: `${h.x}%`, top: `${h.y}%`, duration: 0.5, ease: 'power2.out' });
    }
    setActive(h.id);
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      if (sectionInView) tlRef.current?.play();
    }, RESUME_DELAY);
  };

  return (
    <section id="showroom" ref={setSectionRefs} className="relative py-16 px-6 bg-bg-2/40">
      <div ref={ref} className="max-w-6xl mx-auto space-y-8">
        <div data-reveal className="text-center mb-8">
          <div className="eyebrow mb-4">معرض تفاعلي</div>
          <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ink mb-4">
            <span className="relative inline-block pb-4">
              استكشف معرضك الرقمي
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
            اتفرج على الجولة التلقائية، أو دوس على أي نقطة تكتشف بنفسك كل جزء من معرضك.
          </p>

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

        <div
          data-reveal
          ref={frameRef}
          className="relative rounded-3xl bg-bg border border-ink/8 shadow-float"
          onMouseEnter={() => tlRef.current?.pause()}
          onMouseLeave={() => {
            if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
            if (sectionInView) tlRef.current?.play();
          }}
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden">
            <img
              src={SHOWROOM_IMAGE}
              srcSet={`${SHOWROOM_IMAGE.replace('w=1200', 'w=800')} 800w, ${SHOWROOM_IMAGE} 1200w`}
              sizes="(max-width: 768px) 100vw, 1152px"
              alt="صالة معرض أثاث"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-transparent" />
          </div>

          {hotspots.map((h) => {
            const isRight = h.x >= 55;
            const isBottom = h.y >= 55;
            const cardStyle: React.CSSProperties = {
              [isRight ? 'right' : 'left']: `${isRight ? 100 - h.x : h.x}%`,
              [isBottom ? 'bottom' : 'top']: `${isBottom ? 100 - h.y + 9 : h.y + 9}%`,
            } as React.CSSProperties;

            return (
              <div key={h.id}>
                <button
                  onClick={() => selectManually(h)}
                  className="absolute group z-10"
                  style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
                  aria-label={h.label}
                >
                  <span
                    className={`absolute rounded-full ${active === h.id ? 'bg-sage/30 hotspot-pulse' : 'bg-sage/20'}`}
                    style={{ width: 44, height: 44, left: -6, top: -6 }}
                  />
                  <span
                    className={`relative grid place-items-center w-8 h-8 rounded-full shadow-glow transition-all duration-300 group-hover:scale-110 ${
                      active === h.id ? 'bg-sage text-bg' : 'bg-bg/90 text-sage border-2 border-sage'
                    }`}
                  >
                    <HotspotIcon name={h.icon} />
                  </span>
                </button>

                <div
                  className="absolute z-40 w-48 sm:w-60 rounded-xl bg-bg/95 backdrop-blur border border-ink/8 shadow-float p-3 sm:p-3.5 transition-all duration-400"
                  style={{
                    ...cardStyle,
                    opacity: active === h.id ? 1 : 0,
                    transform: `translateY(${active === h.id ? 0 : isBottom ? 6 : -6}px)`,
                    pointerEvents: active === h.id ? 'auto' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="grid place-items-center w-6 h-6 rounded-lg bg-sage/15 text-sage shrink-0">
                      <HotspotIcon name={h.icon} />
                    </span>
                    <span className="text-xs font-bold text-ink">{h.label}</span>
                  </div>
                  <HotspotBody id={h.id} />
                </div>
              </div>
            );
          })}

          <div
            ref={cursorRef}
            className="absolute z-30 pointer-events-none"
            style={{ left: `${hotspots[0].x}%`, top: `${hotspots[0].y}%`, transform: 'translate(-3px, -3px)' }}
          >
            <div
              ref={rippleRef}
              className="absolute -inset-2.5 rounded-full border-[1.5px] border-sage opacity-0"
              style={{ transform: 'scale(0)' }}
            />
            <svg viewBox="0 0 26 26" width="26" height="26" style={{ filter: 'drop-shadow(0 2px 5px rgba(20,22,20,0.35))' }}>
              <path
                d="M2.5 1.5L21 11.2l-8.1 1.9-2.7 8.9L2.5 1.5z"
                fill="white"
                stroke="#20221f"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div data-reveal>
          <ProductSpinner />
        </div>
      </div>
    </section>
  );
}