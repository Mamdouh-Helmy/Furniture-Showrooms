import { useEffect, useRef } from 'react';
import { gsap } from '@/hooks/useSmoothScroll';

const steps = [
  {
    tag: 'الخطوة ١',
    title: 'قطعة أثاث',
    desc: 'كل شيء يبدأ من قطعة. الكاميرا تدور حول المنتج ليراه العميل من كل زاوية.',
    img: 'https://images.pexels.com/photos/12269764/pexels-photo-12269764.jpeg?auto=compress&cs=tinysrgb&w=500',
    imgAlt: 'كرسي بني أنيق',
  },
  {
    tag: 'الخطوة ٢',
    title: 'بطاقة منتج',
    desc: 'تتحول القطعة تلقائيًا إلى بطاقة منتج كاملة بالسعر والمواصفات والتوفر.',
    img: 'https://images.pexels.com/photos/34017789/pexels-photo-34017789.png?auto=compress&cs=tinysrgb&w=500',
    imgAlt: 'غرفة معاصرة فاخرة',
  },
  {
    tag: 'الخطوة ٣',
    title: 'لوحة تحكم',
    desc: 'البطاقة تصبح جزءًا من لوحة تحكم — المنتجات والمخزون والطلبات في شاشة واحدة.',
    img: 'https://images.pexels.com/photos/12285818/pexels-photo-12285818.jpeg?auto=compress&cs=tinysrgb&w=500',
    imgAlt: 'صالون فاخر',
  },
  {
    tag: 'الخطوة ٤',
    title: 'منصة متكاملة',
    desc: 'الكاميرا تبتعد ليكشف معرضًا رقميًا كاملًا، ومنصة SaaS جاهزة لإدارة كل شيء.',
    img: 'https://images.pexels.com/photos/13722826/pexels-photo-13722826.jpeg?auto=compress&cs=tinysrgb&w=500',
    imgAlt: 'معرض أثاث متكامل',
  },
];

// خلفية خشبية أبسط بكتير من غير repeating-linear-gradient (كانت أغلى حاجة في الـ paint)
// وبـ box-shadow واحد بس بدل 3 طبقات.
const WOOD_FRAME: React.CSSProperties = {
  background:
    'linear-gradient(135deg, #6b4226 0%, #7c4f2c 30%, #603c22 65%, #55351d 100%)',
  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35), 0 10px 18px -10px rgba(40,24,12,0.5)',
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

function StepCard({
  img,
  imgAlt,
  tag,
  title,
  desc,
  stepNumber,
}: {
  img: string;
  imgAlt: string;
  tag: string;
  title: string;
  desc: string;
  stepNumber: number;
}) {
  return (
    <div
      className="relative w-[340px] sm:w-[400px] shrink-0 rounded-[22px] p-3 sm:p-3.5"
      style={WOOD_FRAME}
    >
      <FrameCorner position="tl" />
      <FrameCorner position="tr" />
      <FrameCorner position="bl" />
      <FrameCorner position="br" />

      <div className="relative rounded-[14px] overflow-hidden bg-[#efe4cf] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={img}
            alt={imgAlt}
            width={400}
            height={300}
            className="w-full h-full object-cover"
            loading={stepNumber === 1 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={stepNumber === 1 ? 'high' : 'auto'}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#efe4cf] to-transparent" />
        </div>

        <div className="p-5">
          <div className="eyebrow mb-2">{tag}</div>
          <h3 className="display text-xl text-ink mb-2">{title}</h3>
          <p className="text-sm text-ink/55 leading-relaxed">{desc}</p>

          {stepNumber === 1 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#e2d5b8]/70 px-4 py-2.5">
              <div>
                <div className="text-xs font-bold text-ink">زاوية العرض</div>
                <div className="text-[10px] text-ink/45">تدوير كامل للمنتج</div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-sage/80 grid place-items-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-bg" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {stepNumber === 2 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#e2d5b8]/70 px-4 py-2.5">
              <div>
                <div className="text-xs font-bold text-ink">كنبة مودرن</div>
                <div className="text-[10px] text-ink/45">موديل Milano</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-ink tnum">18,500 ج</div>
                <div className="text-[10px] text-sage">متوفر في 3 فروع</div>
              </div>
            </div>
          )}

          {stepNumber === 3 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { l: 'المبيعات', v: '284K' },
                { l: 'الطلبات', v: '126' },
                { l: 'المنتجات', v: '1,248' },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-[#e2d5b8]/70 p-2.5 text-center">
                  <div className="text-[9px] text-ink/45">{s.l}</div>
                  <div className="text-sm font-bold text-ink tnum">{s.v}</div>
                </div>
              ))}
            </div>
          )}

          {stepNumber === 4 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-ink text-bg px-4 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-sage grid place-items-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-xs font-semibold">منصة متكاملة جاهزة لإدارة معرضك</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ScrollStorytelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let currentStep = -1;

    const updateActiveStep = (index: number) => {
      if (index === currentStep) return;
      currentStep = index;

      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        if (i === index) {
          dot.style.backgroundColor = 'var(--sage)';
          dot.style.width = '2rem';
        } else {
          dot.style.backgroundColor = 'rgba(32, 34, 31, 0.2)';
          dot.style.width = '0.5rem';
        }
      });
    };

    const ctx = gsap.context(() => {
      // matchMedia: التأثير المثبّت (pin) بيتفعّل بس على الشاشات الكبيرة.
      // على الموبايل ده كان أكبر سبب في البطء لأن pin + scrub بيعملوا
      // reflow متكرر مع الـ scroll الطبيعي بتاع الموبايل.
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance() * 1.6}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (steps.length - 1),
              duration: 0.4,
              ease: 'power2.inOut',
            },
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              const stepIndex = Math.min(
                steps.length - 1,
                Math.floor(self.progress * steps.length),
              );
              updateActiveStep(stepIndex);
            },
          },
        });

        tl.fromTo(
          track,
          { x: 0 },
          { x: () => getDistance(), ease: 'none', duration: 1 },
        );

        // نظف will-change بعد انتهاء التمرير عشان المتصفح
        // ميفضلش شايل layer إضافي في الذاكرة طول الوقت.
        return () => {
          track.style.willChange = 'auto';
        };
      });

      // موبايل: سكرول أفقي بسيط بالـ CSS snap من غير pin ولا scrub —
      // خفيف جدًا على الأداء وسلس بالحركة الطبيعية للمس.
      mm.add('(max-width: 767px)', () => {
        track.style.transform = 'none';
        if (progressRef.current) progressRef.current.style.transform = 'scaleX(1)';
        updateActiveStep(0);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="relative h-screen overflow-hidden bg-bg">
      <div className="absolute top-0 inset-x-0 z-30 pt-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="eyebrow whitespace-nowrap">رحلة المنتج</span>
            <div className="flex-1 h-1 rounded-full bg-ink/10 overflow-hidden">
              <div
                ref={progressRef}
                className="h-full w-full rounded-full bg-sage origin-right"
                style={{ transform: 'scaleX(0)', willChange: 'transform' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {steps.map((_, i) => (
              <div
                key={i}
                ref={(el) => { dotsRef.current[i] = el; }}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === 0 ? 'var(--sage)' : 'rgba(32, 34, 31, 0.2)',
                  width: i === 0 ? '2rem' : '0.5rem',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center">
        <div
          ref={trackRef}
          className="flex gap-6 pr-6 sm:pr-12 lg:pr-16 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none"
          style={{ width: 'max-content', willChange: 'transform' }}
        >
          {steps.map((s, i) => (
            <div key={i} className="snap-center">
              <StepCard
                img={s.img}
                imgAlt={s.imgAlt}
                tag={s.tag}
                title={s.title}
                desc={s.desc}
                stepNumber={i + 1}
              />
            </div>
          ))}
          <div className="shrink-0" style={{ width: '4rem' }} />
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(221,228,215,0.35) 0%, transparent 60%)',
        }}
      />
    </section>
  );
}