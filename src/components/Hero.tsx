import { memo, useEffect, useRef, useState } from 'react';
import { gsap } from '@/hooks/useSmoothScroll';

/* ------------------------------------------------------------------ */
/* Photos, each hung in a distinct wooden frame, gallery-wall style    */
/* ------------------------------------------------------------------ */
const photoSources = [
  'https://images.pexels.com/photos/12269764/pexels-photo-12269764.jpeg?auto=compress&cs=tinysrgb&w=500',
  'https://images.pexels.com/photos/3328224/pexels-photo-3328224.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/11112729/pexels-photo-11112729.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/30163102/pexels-photo-30163102.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/27023868/pexels-photo-27023868.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/18108651/pexels-photo-18108651.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/6968094/pexels-photo-6968094.jpeg?auto=compress&cs=tinysrgb&w=400',
];

type ScatterSeed = { x: number; y: number; rotate: number };

/* kept inside a slightly smaller spread so nothing gets clipped by the
   section edges, and the whole board sits comfortably below the navbar */
const scatterSeeds: ScatterSeed[] = [
  { x: 10, y: 10, rotate: -4 },
  { x: 205, y: -6, rotate: 3 },
  { x: 390, y: 22, rotate: -3 },
  { x: 40, y: 220, rotate: 4 },
  { x: 240, y: 200, rotate: -5 },
  { x: 420, y: 235, rotate: 2 },
  { x: 130, y: 360, rotate: -2 },
  { x: 320, y: 380, rotate: 4 },
];

/* five distinct wooden frame styles - dark walnut, pale oak, black    */
/* lacquer, rustic barnwood, reclaimed plank                          */
const frameVariants = [
  {
    name: 'walnut',
    frameBg: 'linear-gradient(155deg, #8a5f38 0%, #5c3c1f 55%, #3b2412 100%)',
    frameThickness: 14,
    matBg: '#F4EEDF',
    matThickness: 8,
  },
  {
    name: 'oak',
    frameBg: `
      repeating-linear-gradient(100deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 2px, transparent 6px),
      linear-gradient(155deg, #d8b483 0%, #b98c53 55%, #8f6534 100%)
    `,
    frameThickness: 16,
    matBg: '#FBF7EC',
    matThickness: 10,
  },
  {
    name: 'lacquer',
    frameBg: 'linear-gradient(155deg, #2c2a28 0%, #171615 60%, #060606 100%)',
    frameThickness: 10,
    matBg: '#EDEAE2',
    matThickness: 4,
  },
  {
    name: 'barnwood',
    frameBg: `
      repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 3px, transparent 18px),
      linear-gradient(155deg, #a9836a 0%, #7c5a44 55%, #4f3826 100%)
    `,
    frameThickness: 18,
    matBg: 'transparent',
    matThickness: 0,
  },
  {
    name: 'reclaimed',
    frameBg: `
      repeating-linear-gradient(96deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 2px, transparent 5px),
      linear-gradient(155deg, #6f5138 0%, #4a3320 55%, #2d1e12 100%)
    `,
    frameThickness: 12,
    matBg: '#E9E2D0',
    matThickness: 6,
  },
];

const PHOTO_W = 150;
const PHOTO_H = 190;
const PANEL_W = 600;
const PANEL_H = 560;

/* ------------------------------------------------------------------ */
/* Wood cube CTA button - real front/top/side faces via skew, so it    */
/* reads as an actual block of wood sitting on the surface.            */
/* ------------------------------------------------------------------ */
function WoodPlankButton({
  href,
  children,
  variant,
  rotate,
}: {
  href: string;
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  rotate: number;
}) {
  const isPrimary = variant === 'primary';
  const depth = 12;

  const frontColor = isPrimary
    ? 'linear-gradient(155deg, #7a5230 0%, #4e3018 55%, #331e0d 100%)'
    : 'linear-gradient(155deg, #c99a4f 0%, #9a6a2e 55%, #6e4a1e 100%)';
  const topColor = isPrimary
    ? 'linear-gradient(90deg, #a67a4a, #8f6338)'
    : 'linear-gradient(90deg, #e8c583, #cfa055)';
  const sideColor = isPrimary
    ? 'linear-gradient(180deg, #3a2412, #241407)'
    : 'linear-gradient(180deg, #7a5527, #5a3c1a)';

  return (
    <a
      href={href}
      className="group relative inline-block"
      style={{ transform: `rotate(${rotate}deg)`, paddingTop: depth, paddingRight: depth }}
    >
      {/* contact shadow on the surface - grows and softens on hover, tightens on press */}
      <span
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-200 ease-out"
        style={{
          bottom: -8,
          width: '76%',
          height: 10,
          background: 'radial-gradient(ellipse, rgba(20,14,8,0.42), transparent 72%)',
          filter: 'blur(5px)',
        }}
      />

      {/* the block itself - lifts on hover, presses down on click */}
      <span className="relative block transition-transform duration-150 ease-out group-hover:-translate-y-1 group-active:translate-y-1">
        {/* top face - catches light from above */}
        <span
          className="absolute left-0 right-0 origin-bottom transition-transform duration-150 ease-out group-active:scale-y-[0.35]"
          style={{
            top: -depth,
            height: depth,
            background: topColor,
            transform: 'skewX(-38deg)',
            transformOrigin: 'bottom left',
            marginLeft: depth * 0.7,
          }}
        />
        {/* side face - sits in natural shadow */}
        <span
          className="absolute top-0 bottom-0 origin-left transition-transform duration-150 ease-out group-active:scale-x-[0.35]"
          style={{
            right: -depth,
            width: depth,
            background: sideColor,
            transform: 'skewY(-38deg)',
            transformOrigin: 'top left',
            marginTop: -depth * 0.7,
          }}
        />

        {/* front face */}
        <span
          className="relative flex items-center justify-center gap-2 px-9 py-6 overflow-hidden rounded-[2px]"
          style={{ background: frontColor }}
        >
          {/* wood grain */}
          <span
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'repeating-linear-gradient(94deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 2px, transparent 4px), repeating-linear-gradient(94deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 3px, transparent 9px)',
            }}
          />
          {/* knots */}
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              top: '22%',
              left: '12%',
              width: 6,
              height: 8,
              background: 'radial-gradient(circle, rgba(0,0,0,0.35), transparent 75%)',
            }}
          />
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              bottom: '18%',
              right: '16%',
              width: 5,
              height: 6,
              background: 'radial-gradient(circle, rgba(0,0,0,0.28), transparent 75%)',
            }}
          />
          {/* top-left sheen */}
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 32%, transparent 65%, rgba(0,0,0,0.2) 100%)',
            }}
          />

          <span
            className="relative z-10 font-extrabold text-base sm:text-lg tracking-wide"
            style={{
              color: isPrimary ? '#F5ECD8' : '#2A1D0E',
              textShadow: isPrimary
                ? '0 1px 0 rgba(255,255,255,0.18), 0 2px 0 rgba(0,0,0,0.4)'
                : '0 1px 0 rgba(255,255,255,0.35), 1px 2px 1px rgba(0,0,0,0.25)',
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
/* Single draggable framed photo.                                      */
/*                                                                      */
/* PERF NOTE: dragging used to call setState on an array of all 8      */
/* frames on every pointermove — that re-rendered every frame's full   */
/* DOM tree (gradients, shadows, blur filters) up to 100+ times/sec     */
/* while dragging, which is what caused the slowdown.                  */
/*                                                                      */
/* Now each frame owns its own position in a ref and writes the        */
/* transform straight to the DOM node during drag. No React state      */
/* update happens while dragging, so there is no re-render at all —    */
/* only the browser's compositor moves the element. React only gets    */
/* involved again for the tiny isDragging flag (cursor/shadow), which  */
/* is local to this one component and cheap.                           */
/* ------------------------------------------------------------------ */
const PhotoFrame = memo(function PhotoFrame({
  index,
  seed,
  frame,
  src,
  topZRef,
  registerCardRef,
}: {
  index: number;
  seed: ScatterSeed;
  frame: (typeof frameVariants)[number];
  src: string;
  topZRef: React.MutableRefObject<number>;
  registerCardRef: (el: HTMLDivElement | null, i: number) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: seed.x, y: seed.y, rotate: seed.rotate });
  const draggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, origX: 0, origY: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const { x, y, rotate } = posRef.current;
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      origX: posRef.current.x,
      origY: posRef.current.y,
    };
    draggingRef.current = true;
    topZRef.current += 1;
    if (wrapperRef.current) {
      wrapperRef.current.style.zIndex = String(topZRef.current);
      wrapperRef.current.style.transition = 'none';
    }
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    posRef.current.x = dragStart.current.origX + dx;
    posRef.current.y = dragStart.current.origY + dy;
    applyTransform(); // direct DOM write, no re-render
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'transform 0.35s ease';
    }
    setIsDragging(false);
  };

  return (
    <div
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="absolute select-none group/frame"
      style={{
        left: 0,
        top: 0,
        width: PHOTO_W,
        transform: `translate(${seed.x}px, ${seed.y}px) rotate(${seed.rotate}deg)`,
        zIndex: 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        willChange: 'transform',
      }}
    >
      <div
        ref={(el) => registerCardRef(el, index)}
        className="relative transition-transform duration-300 group-hover/frame:-translate-y-1 group-hover/frame:scale-[1.03]"
      >
        {/* hanging nail */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: -7,
            width: 6,
            height: 6,
            background: 'radial-gradient(circle at 35% 30%, #cfc9bd, #55504a 70%, #2a2723)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.6)',
          }}
        />
        {/* nail shadow / small hook shadow on the wall */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full opacity-40"
          style={{ top: -4, width: 10, height: 3, background: 'rgba(0,0,0,0.3)', filter: 'blur(1px)' }}
        />

        {/* drop shadow suggesting distance from the wall */}
        <div
          className="absolute rounded-sm transition-all duration-300 group-hover/frame:opacity-70"
          style={{
            inset: 0,
            top: 6,
            left: 6,
            background: 'rgba(20,16,10,0.35)',
            filter: isDragging ? 'blur(10px)' : 'blur(6px)',
            opacity: isDragging ? 0.7 : 0.45,
          }}
        />

        {/* the frame itself */}
        <div
          className="relative rounded-[3px]"
          style={{
            padding: frame.frameThickness,
            background: frame.frameBg,
            boxShadow:
              'inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.4), 0 2px 3px rgba(0,0,0,0.25)',
          }}
        >
          {/* mat / inner border, some frames go matless straight to photo */}
          <div
            className="w-full overflow-hidden"
            style={{
              padding: frame.matThickness,
              background: frame.matBg,
            }}
          >
            <div className="w-full overflow-hidden" style={{ aspectRatio: `${PHOTO_W} / ${PHOTO_H}` }}>
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Hero section                                                        */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topZ = useRef(10);

  const registerCardRef = (el: HTMLDivElement | null, i: number) => {
    cardRefs.current[i] = el;
  };

  useEffect(() => {
    // Narrow HTMLElement | null to a non-null local before handing it to
    // gsap.context — its scope param doesn't accept null, which is what
    // sectionRef.current's type was tripping on.
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Framed photos fly in and settle onto the gallery wall.
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const fromX = gsap.utils.random(-220, 220);
        const fromY = gsap.utils.random(-160, 180);
        const startAt = i * 0.06 + gsap.utils.random(-0.02, 0.03);

        tl.fromTo(
          card,
          { opacity: 0, x: fromX, y: fromY, rotate: gsap.utils.random(-30, 30), scale: 0.4 },
          { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 0.55, ease: 'back.out(1.6)' },
          Math.max(startAt, 0),
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden grain bg-bg"
    >
      {/* Gallery wall of framed photos, each in a different wood frame.
          Pushed down below the navbar and kept within the section so
          every frame stays fully visible, none clipped at the top. */}
      <div
        className="absolute z-0 hidden md:block"
        style={{
          left: 'clamp(24px, 3vw, 56px)',
          top: 'clamp(104px, 14vh, 160px)',
          width: PANEL_W,
          height: PANEL_H,
        }}
      >
        {/* faint wall lighting so the frames read as hung on a wall, not floating */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(60% 50% at 40% 30%, rgba(200,180,150,0.12), transparent 70%)',
          }}
        />

        {scatterSeeds.map((seed, i) => (
          <PhotoFrame
            key={i}
            index={i}
            seed={seed}
            frame={frameVariants[i % frameVariants.length]}
            src={photoSources[i]}
            topZRef={topZ}
            registerCardRef={registerCardRef}
          />
        ))}
      </div>

      {/* Mobile fallback */}
      <div className="absolute inset-0 md:hidden">
        <img
          src="https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="معرض أثاث"
          className="w-full h-full object-cover opacity-25"
          loading="lazy"
        />
      </div>

      {/* Legibility overlay - opaque on the RIGHT (behind the text),
          fading to fully transparent on the LEFT (over the frames) */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none hidden md:block"
        style={{
          background:
            'linear-gradient(270deg, rgba(247,245,240,0.98) 0%, rgba(247,245,240,0.92) 42%, rgba(247,245,240,0.4) 68%, rgba(247,245,240,0.05) 100%)',
        }}
      />
      <div className="absolute inset-0 z-[2] pointer-events-none md:hidden bg-bg/75" />

      {/* Text content - pinned to the right */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 sm:pt-36 lg:pt-44 pb-20">
        <div className="relative max-w-2xl ml-auto text-right">
          <h1
            className="display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-ink mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            كل معرض أثاث
            <br />
            يستحق معرضًا
            <br />
            <span className="text-sage">رقميًا</span> يليق به.
          </h1>

          {/* washi-tape style underline strip beneath the headline */}
          <div
            className="relative h-4 mb-3 animate-fade-up"
            style={{ animationDelay: '0.15s' }}
          >
            <span
              className="absolute right-0 h-4"
              style={{
                width: '58%',
                maxWidth: '340px',
                background: 'rgba(255,103,0,0.28)',
                transform: 'rotate(-1.4deg)',
                boxShadow: '0 2px 4px rgba(32,24,16,0.12)',
              }}
            >
              {/* subtle paper fiber texture, keeps it reading as tape not a flat bar */}
              <span
                className="absolute inset-0"
                style={{
                  background:
                    'repeating-linear-gradient(100deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 1px, transparent 2px, transparent 5px)',
                  mixBlendMode: 'overlay',
                }}
              />
              {/* slightly frayed short ends, not the whole edge - keeps it believable */}
              <span
                className="absolute -left-1 top-0 bottom-0 w-2"
                style={{
                  background: 'inherit',
                  clipPath: 'polygon(100% 0%, 100% 100%, 30% 85%, 60% 55%, 20% 40%, 50% 15%)',
                }}
              />
              <span
                className="absolute -right-1 top-0 bottom-0 w-2"
                style={{
                  background: 'inherit',
                  clipPath: 'polygon(0% 0%, 0% 100%, 70% 85%, 40% 55%, 80% 40%, 50% 15%)',
                }}
              />
            </span>
          </div>

          <p
            className="text-lg sm:text-xl text-ink/65 leading-relaxed max-w-xl mb-9 animate-fade-up ml-auto"
            style={{ animationDelay: '0.2s' }}
          >
            منصة واحدة تساعد معارض الأثاث في مصر على إدارة منتجاتها وفروعها
            وعملائها ومبيعاتها من مكان واحد.
          </p>

          <div
            className="flex flex-wrap items-center justify-start gap-5 animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            <WoodPlankButton href="#cta" variant="primary" rotate={-3}>
              ابدأ الآن
            </WoodPlankButton>
            <WoodPlankButton href="#showroom" variant="secondary" rotate={2}>
              شاهد كيف تعمل المنصة
            </WoodPlankButton>
          </div>
        </div>
      </div>
    </section>
  );
}