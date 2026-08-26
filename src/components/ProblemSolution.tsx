import { useEffect, useRef } from 'react';
import { gsap } from '@/hooks/useSmoothScroll';
import { useReveal } from '@/hooks/useReveal';

interface Item {
  problem: string;
  solution: string;
}

const items: Item[] = [
  { problem: 'المنتجات موزعة بين Excel و WhatsApp', solution: 'كل المنتجات في قاعدة بيانات واحدة منظمة' },
  { problem: 'بيانات الفروع غير متزامنة', solution: 'مزامنة لحظية بين كل الفروع' },
  { problem: 'متابعة العملاء يدويًا', solution: 'قاعدة عملاء موحدة مع تاريخ شراء كامل' },
  { problem: 'صعوبة معرفة المنتجات الأكثر مبيعًا', solution: 'تقارير حية تكشف الأكثر مبيعًا في لحظة' },
];

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- shared "wood plank" material — same language as the
   Egypt map section, reused here so the card's end-state reads as
   the same physical material as the rest of the site ---------- */
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

/* ---------- "note paper" material for the problem side — lined,
   faintly rotated, dashed edge: the opposite material of wood ---------- */
const PAPER_STYLE: React.CSSProperties = {
  backgroundColor: '#FBFAF6',
  backgroundImage: `repeating-linear-gradient(
    180deg,
    rgba(90, 56, 32, 0.07) 0px,
    rgba(90, 56, 32, 0.07) 1px,
    transparent 1px,
    transparent 30px
  )`,
  boxShadow: 'inset 0 0 0 1px rgba(90,56,32,0.12), 0 10px 22px -16px rgba(40,24,12,0.35)',
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
    <div className={`absolute ${placement} w-5 h-5 pointer-events-none`} style={{ transform: `rotate(${rotation})` }}>
      <svg viewBox="0 0 20 20" className="w-full h-full">
        <line x1="0" y1="0" x2="20" y2="20" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
        <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function ProblemSolution() {
  const ref = useReveal<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll<HTMLElement>('[data-row]');

      rows.forEach((row) => {
        const paper = row.querySelector('[data-paper]');
        const wood = row.querySelector('[data-wood]');
        const xIcon = row.querySelector('[data-x]');
        const checkIcon = row.querySelector('[data-check]');
        const checkText = row.querySelector('[data-check-text]');

        if (reducedMotion()) {
          // Respect reduced motion: show the resolved (wood/solution) state
          // directly, no scroll-scrubbed transform.
          gsap.set(paper, { opacity: 0 });
          gsap.set(wood, { opacity: 1 });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: 0.8,
          },
        });

        tl.to(paper, { opacity: 0, rotate: -4, y: -10, scale: 0.96, duration: 0.4 }, 0.1)
          .to(xIcon, { scale: 0.6, rotate: -90, duration: 0.4 }, 0.1)
          .fromTo(wood, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0.35)
          .fromTo(checkIcon, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.35 }, 0.55)
          .fromTo(checkText, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.35 }, 0.6);
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" className="relative py-16 px-6">
      <div ref={ref} className="max-w-4xl mx-auto">
        <div data-reveal className="text-center mb-14">
          <div className="eyebrow mb-4">المشكلة والحل</div>
          <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ink mb-4">
            من فوضى الأوراق...
            <br />
            <span className="relative inline-block pb-3 text-sage">
              إلى نظام واحد.
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
            مرّر للأسفل وشوف كيف تحل المنصة كل مشكلة من مشاكل إدارة المعرض.
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

        <div ref={containerRef} className="space-y-5">
          {items.map((item, i) => (
            <div key={i} data-row className="relative min-h-[104px]">
              {/* problem layer — "note paper" */}
              <div
                data-paper
                style={PAPER_STYLE}
                className="absolute inset-0 rounded-2xl grid grid-cols-[auto_1fr] gap-4 items-center p-6 sm:p-8 -rotate-[0.4deg]"
              >
                <span
                  data-x
                  className="grid place-items-center w-11 h-11 rounded-full bg-[#5a3820]/8 text-[#5a3820]/55 shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                  </svg>
                </span>
                <p className="text-lg text-[#5a3820]/70 line-through decoration-[#5a3820]/25">{item.problem}</p>
              </div>

              {/* solution layer — wood plank */}
              <div data-wood style={WOOD_FRAME} className="absolute inset-0 rounded-2xl opacity-0">
                <FrameCorner position="tl" />
                <FrameCorner position="tr" />
                <FrameCorner position="bl" />
                <FrameCorner position="br" />
                <div className="relative h-full grid grid-cols-[auto_1fr] gap-4 items-center p-6 sm:p-8">
                  <span
                    data-check
                    className="grid place-items-center w-11 h-11 rounded-full bg-gradient-to-b from-black/10 to-black/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] text-gold-bright shrink-0"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p data-check-text className="text-lg font-semibold text-[#f7efe1]">
                    {item.solution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}