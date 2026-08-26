import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/hooks/useSmoothScroll';
import { useReveal } from '@/hooks/useReveal';

const features = [
  { icon: 'cube', label: 'المنتجات', desc: 'إضافة وتنظيم ومخزون' },
  { icon: 'cart', label: 'الطلبات', desc: 'متابعة كل طلبية لحظيًا' },
  { icon: 'users', label: 'العملاء', desc: 'قاعدة عملاء موحدة' },
  { icon: 'chart', label: 'المبيعات', desc: 'تقارير وإحصائيات حية' },
  { icon: 'store', label: 'الفروع', desc: 'كل الفروع في شاشة واحدة' },
];

const monthBars = [30, 45, 38, 60, 52, 75, 68, 90, 72, 85, 95, 80];

const ordersFeed = [
  { n: 'كنبة Milano', b: 'فرع دمياط', v: '18,500' },
  { n: 'كرسي Oak', b: 'فرع القاهرة', v: '3,200' },
];

// Order pipeline — how many live orders sit at each stage right now.
const orderStages = [
  { icon: 'cube', label: 'جديد', count: 4, done: true },
  { icon: 'gear', label: 'قيد التجهيز', count: 6, done: true },
  { icon: 'cart', label: 'تم الشحن', count: 3, done: false },
  { icon: 'store', label: 'تم التسليم', count: 112, done: false },
];

const customersList = [
  { name: 'سارة أحمد', tier: 'ذهبي', orders: 12, spend: '48,200' },
  { name: 'محمد عبدالله', tier: 'فضي', orders: 5, spend: '15,600' },
  { name: 'ليلى حسن', tier: 'فضي', orders: 4, spend: '11,050' },
];
const newCustomer = { name: 'يوسف كريم', tier: 'جديد' };

const branchesList = [
  { name: 'فرع القاهرة', city: 'القاهرة', sales: '112,400', pct: 92, top: true },
  { name: 'فرع الإسكندرية', city: 'الإسكندرية', sales: '86,900', pct: 71 },
  { name: 'فرع دمياط', city: 'دمياط', sales: '64,250', pct: 53 },
  { name: 'فرع الجيزة', city: 'الجيزة', sales: '41,800', pct: 34 },
];

const categoryBreakdown = [
  { label: 'كراسي', pct: 38, className: 'bg-sage' },
  { label: 'كنب', pct: 27, className: 'bg-gold' },
  { label: 'طاولات', pct: 21, className: 'bg-[#8a95a6]' },
  { label: 'إضاءة', pct: 14, className: 'bg-ink/35' },
];

const topProducts = [
  { name: 'كنبة Milano', pct: 88 },
  { name: 'كرسي Oak', pct: 64 },
  { name: 'طاولة رخام', pct: 47 },
];

// Sidebar items live outside the render loop so labels + refs stay in sync.
const sideItems = [
  { key: 'home', icon: 'grid', label: 'الرئيسية' },
  { key: 'products', icon: 'cube', label: 'المنتجات' },
  { key: 'orders', icon: 'cart', label: 'الطلبات' },
  { key: 'customers', icon: 'users', label: 'العملاء' },
  { key: 'branches', icon: 'store', label: 'الفروع' },
  { key: 'stats', icon: 'chart', label: 'الإحصائيات' },
] as const;

function Icon({ name, className = 'text-sage' }: { name: string; className?: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };
  switch (name) {
    case 'cube':
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
        </svg>
      );
    case 'cart':
      return (
        <svg {...common}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M18 17V9M13 17V5M8 17v-3" />
        </svg>
      );
    case 'store':
      return (
        <svg {...common}>
          <path d="M3 9l1-5h16l1 5M4 9v11h16V9M9 20v-6h6v6" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      );
    case 'gear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005.68 15a1.65 1.65 0 00-1.51-1H4a2 2 0 010-4h.09A1.65 1.65 0 005.68 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}

// Sidebar now reads as part of the same light surface as the rest of the
// site (bg-2), not an isolated dark wood rail — active items pick up the
// site's sage accent instead of a separate on-dark treatment.
const ACTIVE_ICON = 'side-icon is-active w-8 h-8 rounded-lg mx-auto grid place-items-center transition-colors duration-300 bg-sage text-bg shadow-[0_4px_10px_-4px_rgba(101,122,99,0.55)]';
const IDLE_ICON = 'side-icon w-8 h-8 rounded-lg mx-auto grid place-items-center transition-colors duration-300 bg-transparent text-ink/35';

// STEP_INFO drives the caption bar: which icon lights up, and the sentence
// explaining what the live demo is doing at that moment.
const STEP_INFO = [
  { icon: 'cube', text: 'إضافة منتج جديد بالصور والسعر والتصنيف' },
  { icon: 'cart', text: 'طلب جديد وصل من عميل في نفس اللحظة' },
  { icon: 'bell', text: 'إشعار فوري بكل طلب أو تحديث يحصل في المعرض' },
  { icon: 'users', text: 'متابعة كل عميل وتاريخ مشترياته في مكان واحد' },
  { icon: 'store', text: 'مقارنة أداء كل فرع لحظة بلحظة' },
  { icon: 'chart', text: 'تقارير وتحليلات مبيعات مباشرة وواضحة' },
];

export default function ShowroomToScreen() {
  const ref = useReveal<HTMLDivElement>();
  const dashRef = useRef<HTMLDivElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  const overviewRef = useRef<HTMLDivElement>(null);
  const addProductRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLDivElement>(null);
  const customersRef = useRef<HTMLDivElement>(null);
  const branchesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const sideHomeRef = useRef<HTMLDivElement>(null);
  const sideProductsRef = useRef<HTMLDivElement>(null);
  const sideOrdersRef = useRef<HTMLDivElement>(null);
  const sideCustomersRef = useRef<HTMLDivElement>(null);
  const sideBranchesRef = useRef<HTMLDivElement>(null);
  const sideStatsRef = useRef<HTMLDivElement>(null);
  const sideRefByKey: Record<(typeof sideItems)[number]['key'], React.RefObject<HTMLDivElement | null>> = {
    home: sideHomeRef,
    products: sideProductsRef,
    orders: sideOrdersRef,
    customers: sideCustomersRef,
    branches: sideBranchesRef,
    stats: sideStatsRef,
  };

  const nameFieldRef = useRef<HTMLDivElement>(null);
  const nameTextRef = useRef<HTMLSpanElement>(null);
  const priceFieldRef = useRef<HTMLDivElement>(null);
  const priceTextRef = useRef<HTMLSpanElement>(null);
  const categoryChipRef = useRef<HTMLDivElement>(null);
  const saveBtnRef = useRef<HTMLDivElement>(null);
  const successToastRef = useRef<HTMLDivElement>(null);

  const bellBtnRef = useRef<HTMLDivElement>(null);

  const captionIconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  captionIconRefs.current = [];
  const captionTextRef = useRef<HTMLSpanElement>(null);
  const stepDotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  stepDotsRef.current = [];

  const productsCountRef = useRef<HTMLDivElement>(null);
  const chartBarsRef = useRef<(HTMLDivElement | null)[]>([]);
  chartBarsRef.current = [];

  const newOrderRowRef = useRef<HTMLDivElement>(null);
  const newOrderBadgeRef = useRef<HTMLDivElement>(null);
  const newCustomerRowRef = useRef<HTMLDivElement>(null);

  const branchBarsRef = useRef<(HTMLDivElement | null)[]>([]);
  branchBarsRef.current = [];
  const categoryBarsRef = useRef<(HTMLDivElement | null)[]>([]);
  categoryBarsRef.current = [];
  const topProductBarsRef = useRef<(HTMLDivElement | null)[]>([]);
  topProductBarsRef.current = [];

  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  featureRefs.current = [];

  // Tilt on scroll — unrelated to the demo timeline, kept as-is. Purely
  // transform-driven (rotationY/X, y), so this stays GPU-cheap on its own.
  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        rotationY: 8,
        rotationX: -4,
        y: -30,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // The looping "live demo" — cursor moves on its own and tours the whole
  // dashboard: add a product, catch a new order, check the notification,
  // browse customers, compare branches, then read the stats before looping.
  useEffect(() => {
    const area = mainAreaRef.current;
    const cursor = cursorRef.current;
    if (!area || !cursor) return;

    let ctx: gsap.Context | null = null;
    let resizeTimer: number | undefined;

    // Builds (or rebuilds) the entire timeline. Wrapped in its own function
    // so it can be re-run once on mount and again — cheaply — on a real
    // window resize, since target positions below are now snapshotted
    // once per build instead of recomputed on every animation frame.
    const build = () => {
      ctx?.revert();

      ctx = gsap.context(() => {
        const panels = [overviewRef, addProductRef, ordersRef, customersRef, branchesRef, statsRef];

        const setActiveIcon = (activeEl: HTMLDivElement | null) => {
          [sideHomeRef, sideProductsRef, sideOrdersRef, sideCustomersRef, sideBranchesRef, sideStatsRef].forEach((r) => {
            if (r.current) r.current.className = r.current === activeEl ? ACTIVE_ICON : IDLE_ICON;
          });
        };

        // Wood-tag cards get a lifted, gold-ringed "active" treatment instead
        // of a background swap, since the wood texture is already the surface.
        const setActiveFeature = (index: number | null) => {
          featureRefs.current.forEach((el, i) => {
            if (!el) return;
            el.classList.toggle('wood-card-active', i === index);
          });
        };

        const setStep = (index: number) => {
          const info = STEP_INFO[index];
          captionIconRefs.current.forEach((el, i) => {
            if (!el) return;
            el.style.opacity = i === index ? '1' : '0';
            el.style.transform = i === index ? 'scale(1)' : 'scale(0.6)';
          });
          if (captionTextRef.current) captionTextRef.current.textContent = info.text;
          stepDotsRef.current.forEach((d, i) => {
            if (!d) return;
            d.className =
              i === index
                ? 'h-1.5 w-5 rounded-full bg-sage transition-all duration-300'
                : 'h-1.5 w-1.5 rounded-full bg-ink/15 transition-all duration-300';
          });
        };
        setStep(5);

        const goToPanel = (target: React.RefObject<HTMLDivElement | null>) => (tl: gsap.core.Timeline) => {
          panels.forEach((p) => {
            if (p !== target && p.current) tl.to(p.current, { opacity: 0, duration: 0.3 }, '+=0.05');
          });
          if (target.current) tl.to(target.current, { opacity: 1, duration: 0.3 }, '<');
        };

        // Snapshot a target's position relative to the demo area ONCE, at
        // build time — not on every animation frame. getBoundingClientRect()
        // forces a synchronous layout recalculation; the previous version
        // called it via a function-based tween getter (`x: () => ...`),
        // which GSAP invokes on *every tick*. With ~10 cursor moves per
        // loop at 60fps over ~0.6–0.8s each, that was hundreds of forced
        // reflows per loop — repeating forever while this section is on
        // screen. The mockup's internal layout doesn't change once
        // mounted (aside from a real window resize, handled by rebuilding
        // below), so one snapshot per build is exactly as correct and
        // effectively free at animation time.
        const snapshotPos = (target: HTMLElement | null) => {
          if (!target) return { x: 0, y: 0 };
          const c = area.getBoundingClientRect();
          const r = target.getBoundingClientRect();
          return { x: r.left - c.left + r.width / 2 - 11, y: r.top - c.top + r.height / 2 - 11 };
        };

        const click = (tl: gsap.core.Timeline) => {
          tl.to(rippleRef.current, { scale: 1, opacity: 0.55, duration: 0.15 })
            .to(rippleRef.current, { scale: 2.2, opacity: 0, duration: 0.4 }, '>-0.05')
            .to(cursor, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, '<');
        };

        const moveTo = (tl: gsap.core.Timeline, target: HTMLElement | null, duration = 0.7, gap = '+=0.2') => {
          const pos = snapshotPos(target);
          tl.to(cursor, { x: pos.x, y: pos.y, duration }, gap);
        };

        const typeInto = (span: HTMLSpanElement | null, text: string, dur: number) => {
          const obj = { i: 0 };
          return gsap.to(obj, {
            i: text.length,
            duration: dur,
            ease: 'none',
            onUpdate: () => {
              if (span) span.textContent = text.slice(0, Math.round(obj.i));
            },
          });
        };

        const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power2.inOut' } });

        // Rest on the overview for a moment before the demo starts moving.
        tl.to({}, { duration: 1.2 });

        // → move to "products" in the sidebar and open the add-product form
        moveTo(tl, sideProductsRef.current, 0.8, '+=0');
        click(tl);
        tl.call(() => setActiveIcon(sideProductsRef.current));
        tl.call(() => setActiveFeature(0));
        tl.call(() => setStep(0));
        goToPanel(addProductRef)(tl);

        // → click the name field and type a product name
        moveTo(tl, nameFieldRef.current, 0.7);
        click(tl);
        tl.add(typeInto(nameTextRef.current, 'كرسي أوك عصري', 1.1), '+=0.1');

        // → click the price field and type a price
        moveTo(tl, priceFieldRef.current, 0.6);
        click(tl);
        tl.add(typeInto(priceTextRef.current, '3,200 ج', 0.7), '+=0.1');

        // → the system auto-suggests a category
        tl.fromTo(
          categoryChipRef.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.35 },
          '+=0.2',
        );

        // → click save
        moveTo(tl, saveBtnRef.current, 0.6);
        click(tl);

        // → form closes, success toast, products counter ticks up
        tl.to(addProductRef.current, { opacity: 0, duration: 0.3 }, '+=0.1');
        tl.to(overviewRef.current, { opacity: 1, duration: 0.3 }, '<');
        tl.call(() => {
          if (nameTextRef.current) nameTextRef.current.textContent = '';
          if (priceTextRef.current) priceTextRef.current.textContent = '';
          if (categoryChipRef.current) gsap.set(categoryChipRef.current, { opacity: 0, y: 6 });
          if (productsCountRef.current) productsCountRef.current.textContent = '1,249';
        });
        tl.fromTo(
          successToastRef.current,
          { opacity: 0, y: 8, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35 },
        );
        tl.to(successToastRef.current, { opacity: 0, y: -6, duration: 0.35 }, '+=1.1');

        // → move to "orders": a new order arrives
        moveTo(tl, sideOrdersRef.current, 0.8);
        click(tl);
        tl.call(() => setActiveIcon(sideOrdersRef.current));
        tl.call(() => setActiveFeature(1));
        tl.call(() => setStep(1));
        goToPanel(ordersRef)(tl);
        tl.fromTo(newOrderRowRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 }, '+=0.3');
        tl.to({}, { duration: 0.9 });

        // → the bell gets clicked: same order shows up as a live notification
        moveTo(tl, bellBtnRef.current, 0.6);
        click(tl);
        tl.call(() => setStep(2));
        tl.fromTo(
          newOrderBadgeRef.current,
          { opacity: 0, scale: 0.9, y: -6 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35 },
        );
        tl.to({}, { duration: 1.1 });
        tl.to(newOrderBadgeRef.current, { opacity: 0, duration: 0.3 }, '+=0.1');

        // → move to "customers": a new customer joins
        moveTo(tl, sideCustomersRef.current, 0.8);
        click(tl);
        tl.call(() => setActiveIcon(sideCustomersRef.current));
        tl.call(() => setActiveFeature(2));
        tl.call(() => setStep(3));
        goToPanel(customersRef)(tl);
        tl.fromTo(newCustomerRowRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 }, '+=0.3');
        tl.to({}, { duration: 1.2 });

        // → move to "branches": compare performance
        moveTo(tl, sideBranchesRef.current, 0.8);
        click(tl);
        tl.call(() => setActiveIcon(sideBranchesRef.current));
        tl.call(() => setActiveFeature(4));
        tl.call(() => setStep(4));
        goToPanel(branchesRef)(tl);
        tl.fromTo(
          branchBarsRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out', transformOrigin: 'right center' },
          '+=0.15',
        );
        tl.to({}, { duration: 1.2 });

        // → move to "stats": the numbers behind the whole month
        moveTo(tl, sideStatsRef.current, 0.8);
        click(tl);
        tl.call(() => setActiveIcon(sideStatsRef.current));
        tl.call(() => setActiveFeature(3));
        tl.call(() => setStep(5));
        goToPanel(statsRef)(tl);
        tl.fromTo(
          categoryBarsRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, stagger: 0.07, ease: 'power2.out', transformOrigin: 'right center' },
          '+=0.15',
        );
        tl.fromTo(
          topProductBarsRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', transformOrigin: 'right center' },
          '-=0.3',
        );
        tl.to({}, { duration: 1.3 });

        // → back to the dashboard / overview
        moveTo(tl, sideHomeRef.current, 0.8);
        click(tl);
        tl.call(() => setActiveIcon(sideHomeRef.current));
        tl.call(() => setActiveFeature(null));
        tl.call(() => setStep(5));
        goToPanel(overviewRef)(tl);
        tl.fromTo(
          chartBarsRef.current,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.7, stagger: 0.035, ease: 'power2.out' },
          '+=0.1',
        );
        tl.to({}, { duration: 1.4 });

        // reset for the next loop
        tl.call(() => {
          setActiveIcon(sideHomeRef.current);
          setActiveFeature(null);
          if (newOrderRowRef.current) gsap.set(newOrderRowRef.current, { opacity: 0, y: -10 });
          if (newCustomerRowRef.current) gsap.set(newCustomerRowRef.current, { opacity: 0, y: -10 });
          if (productsCountRef.current) productsCountRef.current.textContent = '1,248';
        });

        // Created inside gsap.context(), so ScrollTrigger.create() below is
        // automatically tracked and killed by ctx.revert() — no separate
        // cleanup needed.
        ScrollTrigger.create({
          trigger: dashRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(),
          onLeave: () => tl.pause(),
          onLeaveBack: () => tl.pause(),
        });
      }, area);
    };

    build();

    // Positions are now snapshotted once per build instead of tracked live,
    // so a genuine layout change (e.g. a responsive breakpoint on resize)
    // needs an explicit rebuild to stay accurate. Debounced so a resize
    // drag doesn't rebuild the whole timeline dozens of times.
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      ctx?.revert();
    };
  }, []);

  return (
    <section id="dashboard-intro" className="relative py-16 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div data-reveal className="relative order-2 lg:order-1">
            <div className="eyebrow mb-4">من معرضك إلى الشاشة</div>
            <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ink mb-6 leading-[1.6]">
              حوّل معرضك من مكان
              <br />
              يزوره العميل...
              <br />
              <span className="relative inline-block text-sage pb-4">
                إلى تجربة
                <svg
                  className="absolute left-0 bottom-0 w-full h-3 text-gold"
                  viewBox="0 0 120 16"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9 Q 8 4 14 9 T 26 9 T 38 9 T 50 9 T 62 9 T 74 9 T 86 9 T 98 9 T 110 9 T 118 9"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>{' '}
              يقدر يعيشها من أي مكان.
            </h2>
            <p className="text-lg text-ink/60 leading-relaxed mb-8 max-w-md">
              كل ما تحتاجه لإدارة معرضك في لوحة واحدة أنيقة — المنتجات، الطلبات،
              العملاء، المبيعات، والفروع، مع إشعارات لحظية بكل ما يحصل وتقارير
              توضح لك أداء كل فرع على حدة.
            </p>

            <div className="relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {features.map((f, i) => (
                  <div
                    key={f.label}
                    ref={(el) => { featureRefs.current[i] = el; }}
                    className="wood-card relative rounded-2xl p-4"
                  >
                    <span className="wood-rivet" aria-hidden="true" />
                    <div className="wood-icon-plate mb-3">
                      <Icon name={f.icon} className="text-bg/90" />
                    </div>
                    <div className="font-semibold text-bg text-sm">{f.label}</div>
                    <div className="text-[11px] text-bg/55 mt-0.5 leading-snug">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div data-reveal className="order-1 lg:order-2 relative" style={{ perspective: '1200px' }}>
            <div
              ref={dashRef}
              className="relative rounded-3xl bg-bg shadow-float border border-ink/8 overflow-hidden"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="flex items-center gap-2 px-5 py-3 border-b border-ink/8 bg-bg-2/50">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-ink/10" />
                  <span className="w-3 h-3 rounded-full bg-ink/10" />
                  <span className="w-3 h-3 rounded-full bg-ink/10" />
                </div>
                <div className="flex-1 text-center text-xs font-semibold text-ink/40">dashboard.ma3rd.com</div>
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                    <span className="text-[9px] font-semibold text-ink/35">عرض مباشر</span>
                  </span>
                  <div className="relative">
                    <div ref={bellBtnRef} className="w-7 h-7 rounded-lg bg-bg-2 grid place-items-center" title="الإشعارات">
                      <Icon name="bell" className="text-ink/45" />
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold ring-2 ring-bg" />
                    </div>
                    <div
                      ref={newOrderBadgeRef}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 z-30 w-48 glass rounded-xl p-2.5 shadow-float opacity-0 origin-top"
                    >
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-bg/80" />
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-sage/20 grid place-items-center shrink-0">
                          <Icon name="cart" className="text-sage w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 text-right">
                          <div className="text-[9px] text-ink/45">طلب جديد وصل الآن</div>
                          <div className="text-[11px] font-bold text-ink truncate">كنبة Milano — 18,500 ج</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-sage to-sage-light grid place-items-center text-[9px] font-bold text-bg"
                    title="ريم — صاحبة المعرض"
                  >
                    ريم
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-ink/6 bg-bg-2/30">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-6 h-6 rounded-md bg-sage/12 shrink-0">
                    {STEP_INFO.map((s, i) => (
                      <span
                        key={s.icon}
                        ref={(el) => { captionIconRefs.current[i] = el; }}
                        className="absolute inset-0 grid place-items-center transition-all duration-300"
                        style={{ opacity: i === 5 ? 1 : 0, transform: i === 5 ? 'scale(1)' : 'scale(0.6)' }}
                      >
                        <Icon name={s.icon} className="text-sage w-3.5 h-3.5" />
                      </span>
                    ))}
                  </div>
                  <span ref={captionTextRef} className="text-[11px] font-semibold text-ink/70 truncate">
                    تقارير وتحليلات مبيعات مباشرة وواضحة
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {STEP_INFO.map((s, i) => (
                    <span
                      key={s.icon}
                      ref={(el) => { stepDotsRef.current[i] = el; }}
                      className={i === 5 ? 'h-1.5 w-5 rounded-full bg-sage transition-all duration-300' : 'h-1.5 w-1.5 rounded-full bg-ink/15 transition-all duration-300'}
                    />
                  ))}
                </div>
              </div>

              <div className="flex">
                <div className="w-16 sm:w-20 bg-bg-2/60 border-l border-ink/6 py-3 px-2 flex flex-col items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full grid place-items-center mb-1"
                    style={{
                      background: 'radial-gradient(circle at 35% 30%, #f0dcae, #b79b68 55%, #7a5f36 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.3)',
                    }}
                    title="ma3rd.com"
                  >
                    <span className="text-[11px] font-bold" style={{ color: '#3a2717' }}>م</span>
                  </div>

                  {sideItems.map((item) => (
                    <div key={item.key} className="w-full">
                      <div ref={sideRefByKey[item.key]} className={item.key === 'home' ? ACTIVE_ICON : IDLE_ICON} title={item.label}>
                        <Icon name={item.icon} className="" />
                      </div>
                      <span className="side-label">{item.label}</span>
                    </div>
                  ))}

                  <div className="mt-auto w-full" title="الإعدادات">
                    <div className="side-icon w-8 h-8 rounded-lg mx-auto grid place-items-center text-ink/30">
                      <Icon name="gear" className="" />
                    </div>
                    <span className="side-label">الإعدادات</span>
                  </div>
                </div>

                <div ref={mainAreaRef} className="relative flex-1 h-[440px] sm:h-[470px]">
                  <div ref={overviewRef} className="absolute inset-0 p-4 sm:p-5 bg-bg overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-ink/40">لوحة التحكم</div>
                        <div className="text-sm font-bold text-ink">نظرة عامة على المعرض</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="px-2.5 h-7 rounded-lg bg-bg-2 grid place-items-center text-[9px] font-semibold text-ink/45">هذا الأسبوع</div>
                        <div className="px-2.5 h-7 rounded-lg bg-sage/20 grid place-items-center text-[9px] font-semibold text-sage">هذا الشهر</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                      {[
                        { l: 'المبيعات', v: '284K', s: '+12%', c: 'text-sage' },
                        { l: 'الطلبات', v: '126', s: '+8%', c: 'text-sage' },
                        { l: 'المنتجات', v: '1,248', s: 'ثابت', c: 'text-ink/40' },
                      ].map((s) => (
                        <div key={s.l} className="rounded-2xl bg-bg-2/50 p-3">
                          <div className="text-[10px] text-ink/45 mb-1">{s.l}</div>
                          <div
                            ref={s.l === 'المنتجات' ? productsCountRef : undefined}
                            className="text-base font-bold text-ink tnum"
                          >
                            {s.v}
                          </div>
                          <div className={`text-[10px] font-semibold ${s.c}`}>{s.s}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl bg-bg-2/40 p-4">
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="text-xs font-semibold text-ink/60">المبيعات الشهرية</div>
                        <div className="text-[9px] text-ink/35">آخر ١٢ شهر</div>
                      </div>
                      <div className="flex items-end gap-1.5 h-24">
                        {monthBars.map((h, i) => (
                          <div
                            key={i}
                            ref={(el) => { chartBarsRef.current[i] = el; }}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-sage to-sage-light hover:from-gold hover:to-gold/70 transition-colors cursor-pointer"
                            style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-[8px] text-ink/35">
                        {['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'].map((m) => (
                          <span key={m}>{m}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {ordersFeed.map((o) => (
                        <div key={o.n} className="flex items-center justify-between rounded-xl bg-bg-2/30 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-sage/20" />
                            <div>
                              <div className="text-[11px] font-semibold text-ink">{o.n}</div>
                              <div className="text-[9px] text-ink/40">{o.b}</div>
                            </div>
                          </div>
                          <div className="text-[11px] font-bold text-ink tnum">{o.v} ج</div>
                        </div>
                      ))}
                    </div>

                    <div
                      ref={successToastRef}
                      className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-xl bg-bg text-ink border border-ink/8 px-4 py-2.5 opacity-0 shadow-float"
                    >
                      <div className="w-6 h-6 rounded-lg bg-sage grid place-items-center shrink-0">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-bg" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-xs font-semibold">تمت إضافة المنتج بنجاح</div>
                    </div>
                  </div>

                  <div ref={addProductRef} className="absolute inset-0 p-4 sm:p-5 bg-bg opacity-0">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/6">
                      <div>
                        <div className="text-xs text-ink/40">المنتجات</div>
                        <div className="text-sm font-bold text-ink">إضافة منتج جديد</div>
                      </div>
                      <div className="text-[9px] font-semibold text-sage bg-sage/10 rounded-full px-2.5 py-1">مسودة</div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg bg-gradient-to-br from-[#a67c58]/35 to-[#6b4a34]/45 border border-ink/8 grid place-items-center"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-bg/70" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <circle cx="9" cy="9" r="1.5" />
                            <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      ))}
                      <div className="aspect-square rounded-lg border border-dashed border-ink/15 bg-bg-2/30 grid place-items-center text-ink/30">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-ink/40 mb-3">
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="9" cy="9" r="1.5" />
                        <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[9px] font-semibold">3 صور مرفوعة</span>
                    </div>

                    <div className="space-y-2.5">
                      <div ref={nameFieldRef} className="rounded-xl bg-bg-2/60 border border-ink/8 px-3.5 py-2.5">
                        <div className="text-[9px] text-ink/40 mb-1">اسم المنتج</div>
                        <div className="text-xs font-semibold text-ink h-4">
                          <span ref={nameTextRef} />
                          <span className="inline-block w-[1px] h-3 bg-ink/40 align-middle animate-pulse mr-0.5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div ref={priceFieldRef} className="rounded-xl bg-bg-2/60 border border-ink/8 px-3.5 py-2.5">
                          <div className="text-[9px] text-ink/40 mb-1">السعر</div>
                          <div className="text-xs font-semibold text-ink h-4">
                            <span ref={priceTextRef} />
                            <span className="inline-block w-[1px] h-3 bg-ink/40 align-middle animate-pulse mr-0.5" />
                          </div>
                        </div>
                        <div className="rounded-xl bg-bg-2/60 border border-ink/8 px-3.5 py-2.5">
                          <div className="text-[9px] text-ink/40 mb-1">التصنيف</div>
                          <div ref={categoryChipRef} className="flex items-center gap-1 opacity-0">
                            <span className="text-[9px] font-semibold text-sage bg-sage/10 rounded-full px-2 py-0.5">كراسي</span>
                            <span className="text-[8px] text-ink/35">تلقائي</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      ref={saveBtnRef}
                      className="mt-4 rounded-xl bg-sage text-bg text-center text-xs font-semibold py-2.5 shadow-[0_6px_16px_-6px_rgba(143,168,118,0.6)]"
                    >
                      حفظ المنتج
                    </div>
                  </div>

                  <div ref={ordersRef} className="absolute inset-0 p-4 sm:p-5 bg-bg opacity-0">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink/6">
                      <div>
                        <div className="text-xs text-ink/40">إدارة الطلبات</div>
                        <div className="text-sm font-bold text-ink">كل الطلبات في مكان واحد</div>
                      </div>
                      <div className="text-[9px] font-semibold text-ink/40 bg-bg-2/60 rounded-full px-2.5 py-1">٤ طلبات اليوم</div>
                    </div>

                    <div className="relative mb-4 px-2 pt-1">
                      <div className="absolute left-6 right-6 top-[15px] h-[2px] bg-ink/8 rounded-full" />
                      <div
                        className="absolute right-6 top-[15px] h-[2px] bg-gradient-to-l from-sage to-sage-light rounded-full"
                        style={{ width: '38%' }}
                      />
                      <div className="relative flex justify-between">
                        {orderStages.map((s) => (
                          <div key={s.label} className="flex flex-col items-center gap-1.5">
                            <div
                              className={`w-[30px] h-[30px] rounded-full grid place-items-center ring-4 ring-bg ${s.done ? 'bg-sage text-bg' : 'bg-bg-2 text-ink/35'
                                }`}
                            >
                              <Icon name={s.icon} className="w-3.5 h-3.5" />
                            </div>
                            <div className="text-[12px] font-bold text-ink tnum">{s.count}</div>
                            <div className="text-[8px] text-ink/45">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div
                        ref={newOrderRowRef}
                        className="flex items-center justify-between rounded-xl bg-sage/10 border border-sage/25 px-3 py-2.5 opacity-0"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-sage/25" />
                          <div>
                            <div className="text-[11px] font-semibold text-ink">كنبة Milano</div>
                            <div className="text-[9px] text-ink/40">فرع دمياط</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-sage bg-sage/15 rounded-full px-2 py-0.5">جديد</span>
                          <div className="text-[11px] font-bold text-ink tnum">18,500 ج</div>
                        </div>
                      </div>

                      {[
                        { n: 'كرسي Oak', b: 'فرع القاهرة', v: '3,200', status: 'مؤكد', tone: 'text-sage bg-sage/10' },
                        { n: 'طاولة طعام', b: 'فرع الإسكندرية', v: '9,800', status: 'قيد الشحن', tone: 'text-gold bg-gold/10' },
                      ].map((o) => (
                        <div key={o.n} className="flex items-center justify-between rounded-xl bg-bg-2/30 px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-bg-2" />
                            <div>
                              <div className="text-[11px] font-semibold text-ink">{o.n}</div>
                              <div className="text-[9px] text-ink/40">{o.b}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-semibold rounded-full px-2 py-0.5 ${o.tone}`}>{o.status}</span>
                            <div className="text-[11px] font-bold text-ink tnum">{o.v} ج</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div ref={customersRef} className="absolute inset-0 p-4 sm:p-5 bg-bg opacity-0">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink/6">
                      <div>
                        <div className="text-xs text-ink/40">قاعدة العملاء</div>
                        <div className="text-sm font-bold text-ink">كل عملائك في مكان واحد</div>
                      </div>
                      <div className="text-[9px] font-semibold text-ink/40 bg-bg-2/60 rounded-full px-2.5 py-1">٣٤٦ عميل</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 mb-3">
                      {[
                        { l: 'عملاء جدد', v: '18', c: 'text-sage' },
                        { l: 'متكررون', v: '61%', c: 'text-sage' },
                        { l: 'متوسط الطلب', v: '2,450', c: 'text-ink/60' },
                      ].map((s) => (
                        <div key={s.l} className="rounded-2xl bg-bg-2/50 p-2.5">
                          <div className="text-[9px] text-ink/45 mb-1">{s.l}</div>
                          <div className={`text-[13px] font-bold tnum ${s.c}`}>{s.v}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div
                        ref={newCustomerRowRef}
                        className="flex items-center justify-between rounded-xl bg-sage/10 border border-sage/25 px-3 py-2.5 opacity-0"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-sage/25 grid place-items-center text-[9px] font-bold text-sage">
                            {newCustomer.name[0]}
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold text-ink">{newCustomer.name}</div>
                            <div className="text-[9px] text-ink/40">انضم الآن</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-sage bg-sage/15 rounded-full px-2 py-0.5">{newCustomer.tier}</span>
                      </div>

                      {customersList.map((c) => (
                        <div key={c.name} className="flex items-center justify-between rounded-xl bg-bg-2/30 px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-bg-2 grid place-items-center text-[9px] font-bold text-ink/50">
                              {c.name[0]}
                            </div>
                            <div>
                              <div className="text-[11px] font-semibold text-ink">{c.name}</div>
                              <div className="text-[9px] text-ink/40">{c.orders} طلبات</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-semibold rounded-full px-2 py-0.5 ${c.tier === 'ذهبي' ? 'text-gold bg-gold/10' : 'text-ink/45 bg-ink/6'
                                }`}
                            >
                              {c.tier}
                            </span>
                            <div className="text-[11px] font-bold text-ink tnum">{c.spend} ج</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div ref={branchesRef} className="absolute inset-0 p-4 sm:p-5 bg-bg opacity-0">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink/6">
                      <div>
                        <div className="text-xs text-ink/40">أداء الفروع</div>
                        <div className="text-sm font-bold text-ink">قارن كل فرع لحظة بلحظة</div>
                      </div>
                      <div className="text-[9px] font-semibold text-ink/40 bg-bg-2/60 rounded-full px-2.5 py-1">٤ فروع نشطة</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {branchesList.map((b, i) => (
                        <div key={b.name} className="relative rounded-2xl bg-bg-2/40 p-3">
                          {b.top && (
                            <span className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-gold hotspot-pulse" title="الأعلى مبيعًا" />
                          )}
                          <div className="flex items-center gap-1.5 mb-2">
                            <Icon name="store" className="text-sage w-3.5 h-3.5" />
                            <div className="text-[11px] font-semibold text-ink">{b.name}</div>
                          </div>
                          <div className="text-[13px] font-bold text-ink tnum mb-1.5">{b.sales} ج</div>
                          <div className="h-1.5 rounded-full bg-ink/8 overflow-hidden">
                            <div
                              ref={(el) => { branchBarsRef.current[i] = el; }}
                              className={`h-full rounded-full ${b.top ? 'bg-gold' : 'bg-sage'}`}
                              style={{ width: `${b.pct}%`, transformOrigin: 'right center' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div ref={statsRef} className="absolute inset-0 p-4 sm:p-5 bg-bg opacity-0">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink/6">
                      <div>
                        <div className="text-xs text-ink/40">تحليلات المبيعات</div>
                        <div className="text-sm font-bold text-ink">إحصائيات هذا الشهر</div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-sage bg-sage/10 rounded-full px-2.5 py-1">
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M4 17l6-6 4 4 6-8" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>+18%</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-bg-2/40 p-3.5 mb-3">
                      <div className="text-[10px] font-semibold text-ink/55 mb-2.5">المبيعات حسب الفئة</div>
                      <div className="flex h-3 rounded-full overflow-hidden mb-2.5">
                        {categoryBreakdown.map((c, i) => (
                          <div
                            key={c.label}
                            ref={(el) => { categoryBarsRef.current[i] = el; }}
                            className={c.className}
                            style={{ width: `${c.pct}%`, transformOrigin: 'right center' }}
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {categoryBreakdown.map((c) => (
                          <span key={c.label} className="flex items-center gap-1 text-[9px] text-ink/50">
                            <span className={`w-1.5 h-1.5 rounded-full ${c.className}`} />
                            {c.label} {c.pct}%
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-bg-2/40 p-3.5">
                      <div className="text-[10px] font-semibold text-ink/55 mb-2.5">الأكثر مبيعًا</div>
                      <div className="space-y-2">
                        {topProducts.map((p, i) => (
                          <div key={p.name}>
                            <div className="flex items-center justify-between text-[10px] mb-1">
                              <span className="font-semibold text-ink/70">{p.name}</span>
                              <span className="text-ink/40 tnum">{p.pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-ink/8 overflow-hidden">
                              <div
                                ref={(el) => { topProductBarsRef.current[i] = el; }}
                                className="h-full rounded-full bg-gradient-to-l from-sage to-sage-light"
                                style={{ width: `${p.pct}%`, transformOrigin: 'right center' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    ref={cursorRef}
                    className="absolute top-0 left-0 z-20 pointer-events-none"
                    style={{ transform: 'translate(60px, 40px)', willChange: 'transform' }}
                  >
                    <div ref={rippleRef} className="absolute -inset-2 rounded-full bg-sage opacity-0" style={{ transform: 'scale(0)' }} />
                    <svg viewBox="0 0 22 22" width="22" height="22" className="drop-shadow-md">
                      <path d="M2 2l7 17 2.5-6.5L18 10 2 2z" fill="white" stroke="#20221f" strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

        <svg
  className="hidden lg:block absolute inset-0 w-full h-full text-gold pointer-events-none"
  viewBox="0 0 100 100"
  preserveAspectRatio="none"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M39 88
       C 41.2 85.7, 42.8 85.7, 44 87.3
       C 45.2 89, 46.8 89, 48 87
       C 49.2 85, 51 84.6, 52.7 81.8"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    fill="none"
    vectorEffect="non-scaling-stroke"
  />
  <path
    d="M50.2 81.3 L52.7 81.8 L51.5 84.2"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    vectorEffect="non-scaling-stroke"
  />
</svg>
        </div>
      </div>
    </section>
  );
}