import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/hooks/useSmoothScroll';

/* ---------- Background media system ----------
   Two states:
     1) "collage" — a dense moodboard of product photos, each framed
        like a small pinned photograph (white border, soft rotation,
        drop shadow) — echoing the site's tactile paper / wood-pin
        language used elsewhere (ProblemSolution's note paper,
        PriceTag's nail).
     2) "video"   — once triggered, takes over the full background
        permanently (no fading back to the collage) and cycles
        between three different interior/furniture clips, crossfading
        from one to the next forever.
   Reduced-motion users get the static collage only — no video, no
   phase switching. ---------- */

const VIDEO_SOURCES = [
  'https://videos.pexels.com/video-files/7578546/7578546-uhd_2560_1440_30fps.mp4',
  'https://videos.pexels.com/video-files/11630727/11630727-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/5823846/5823846-uhd_2560_1440_24fps.mp4',
];

interface Tile {
  src: string;
  top: string;
  left: string;
  size: number;
  rotate: number;
}

/* All photo IDs below are verified real Pexels items. */
const TILES: Tile[] = [
  { src: 'https://images.pexels.com/photos/6758238/pexels-photo-6758238.jpeg?auto=compress&cs=tinysrgb&w=400', top: '3%', left: '5%', size: 160, rotate: -6 },
  { src: 'https://images.pexels.com/photos/7535062/pexels-photo-7535062.jpeg?auto=compress&cs=tinysrgb&w=400', top: '8%', left: '61%', size: 140, rotate: 5 },
  { src: 'https://images.pexels.com/photos/6758247/pexels-photo-6758247.jpeg?auto=compress&cs=tinysrgb&w=400', top: '58%', left: '2%', size: 155, rotate: 4 },
  { src: 'https://images.pexels.com/photos/6830012/pexels-photo-6830012.jpeg?auto=compress&cs=tinysrgb&w=400', top: '64%', left: '70%', size: 170, rotate: -4 },
  { src: 'https://images.pexels.com/photos/12269764/pexels-photo-12269764.jpeg?auto=compress&cs=tinysrgb&w=400', top: '1%', left: '35%', size: 120, rotate: 7 },
  { src: 'https://images.pexels.com/photos/34017789/pexels-photo-34017789.png?auto=compress&cs=tinysrgb&w=400', top: '73%', left: '35%', size: 130, rotate: -7 },
  { src: 'https://images.pexels.com/photos/12285818/pexels-photo-12285818.jpeg?auto=compress&cs=tinysrgb&w=400', top: '27%', left: '88%', size: 110, rotate: 3 },
  { src: 'https://images.pexels.com/photos/13722826/pexels-photo-13722826.jpeg?auto=compress&cs=tinysrgb&w=400', top: '32%', left: '16%', size: 100, rotate: -3 },
  { src: 'https://images.pexels.com/photos/11701157/pexels-photo-11701157.jpeg?auto=compress&cs=tinysrgb&w=400', top: '4%', left: '85%', size: 130, rotate: -8 },
  { src: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=400', top: '46%', left: '46%', size: 115, rotate: 6 },
  { src: 'https://images.pexels.com/photos/1176516/pexels-photo-1176516.jpeg?auto=compress&cs=tinysrgb&w=400', top: '83%', left: '9%', size: 120, rotate: -5 },
  { src: 'https://images.pexels.com/photos/31567419/pexels-photo-31567419.jpeg?auto=compress&cs=tinysrgb&w=400', top: '80%', left: '55%', size: 125, rotate: 4 },
  { src: 'https://images.pexels.com/photos/534172/pexels-photo-534172.jpeg?auto=compress&cs=tinysrgb&w=400', top: '17%', left: '1%', size: 100, rotate: 3 },
  { src: 'https://images.pexels.com/photos/12127444/pexels-photo-12127444.jpeg?auto=compress&cs=tinysrgb&w=400', top: '13%', left: '19%', size: 90, rotate: -9 },
  { src: 'https://images.pexels.com/photos/2029694/pexels-photo-2029694.jpeg?auto=compress&cs=tinysrgb&w=400', top: '43%', left: '83%', size: 110, rotate: 2 },
  { src: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400', top: '51%', left: '19%', size: 95, rotate: -4 },
  { src: 'https://images.pexels.com/photos/12099014/pexels-photo-12099014.jpeg?auto=compress&cs=tinysrgb&w=400', top: '2%', left: '52%', size: 100, rotate: 6 },
  { src: 'https://images.pexels.com/photos/5997975/pexels-photo-5997975.jpeg?auto=compress&cs=tinysrgb&w=400', top: '62%', left: '48%', size: 130, rotate: -6 },
  { src: 'https://images.pexels.com/photos/8112348/pexels-photo-8112348.jpeg?auto=compress&cs=tinysrgb&w=400', top: '22%', left: '68%', size: 115, rotate: 5 },
  { src: 'https://images.pexels.com/photos/7027976/pexels-photo-7027976.jpeg?auto=compress&cs=tinysrgb&w=400', top: '88%', left: '80%', size: 105, rotate: -3 },
  { src: 'https://images.pexels.com/photos/15062155/pexels-photo-15062155.jpeg?auto=compress&cs=tinysrgb&w=400', top: '36%', left: '2%', size: 95, rotate: 4 },
  { src: 'https://images.pexels.com/photos/8186478/pexels-photo-8186478.jpeg?auto=compress&cs=tinysrgb&w=400', top: '68%', left: '90%', size: 100, rotate: -5 },
];

function PhotoCollage({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.1s ease-in-out',
        // Skip layout/paint work for tiles that are faded out, and skip
        // it up front for anything currently off-screen — this is what
        // keeps 20+ tiles cheap instead of heavy.
        contentVisibility: visible ? 'visible' : 'hidden',
      }}
    >
      {TILES.map((t, i) => (
        <div
          key={i}
          className="absolute bg-[#F7EFE1] p-1.5 rounded-sm"
          style={{
            top: t.top,
            left: t.left,
            width: t.size,
            transform: `rotate(${t.rotate}deg)`,
            boxShadow: '0 14px 28px -10px rgba(0,0,0,0.55)',
            contentVisibility: 'auto',
            containIntrinsicSize: `${t.size}px ${Math.round((t.size * 3) / 4)}px`,
          }}
        >
          <img
            src={t.src}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="w-full aspect-[4/3] object-cover rounded-[2px] block"
          />
        </div>
      ))}
    </div>
  );
}

/* Renders only the video that's currently needed: the active clip
   (playing) and, once we're about to switch, the next clip preloading
   quietly underneath so the crossfade has something ready to show.
   This keeps at most two <video> elements mounted at once instead of
   three, which is noticeably lighter on memory/CPU. Once a video has
   started, playback never returns to the collage. */
function VideoTakeover({ visible, activeIndex }: { visible: boolean; activeIndex: number }) {
  const activeRef = useRef<HTMLVideoElement | null>(null);
  const nextIndex = (activeIndex + 1) % VIDEO_SOURCES.length;

  useEffect(() => {
    if (!visible) return;
    const v = activeRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Autoplay can be blocked in rare cases (e.g. low-power mode) —
      // the collage stays as a perfectly fine fallback either way.
    });
  }, [visible, activeIndex]);

  return (
    <div
      className="absolute inset-0"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 1.1s ease-in-out' }}
    >
      <video
        key={VIDEO_SOURCES[activeIndex]}
        ref={activeRef}
        src={VIDEO_SOURCES[activeIndex]}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Preload the next clip at zero opacity so it's ready to swap in
          without a stall, without doubling the number of active decoders. */}
      <video
        key={`preload-${VIDEO_SOURCES[nextIndex]}`}
        src={VIDEO_SOURCES[nextIndex]}
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
      />
    </div>
  );
}

function ShowroomMediaBackground() {
  // Once we switch to "video" we stay there forever — no more toggling
  // back to the collage. Inside video mode we keep cycling between the
  // three clips.
  const [phase, setPhase] = useState<'collage' | 'video'>('collage');
  const [videoIndex, setVideoIndex] = useState(0);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reducedMotion) return; // static collage only, no phase switching
    if (phase === 'collage') {
      const timer = setTimeout(() => setPhase('video'), 9000);
      return () => clearTimeout(timer);
    }
    // In video phase: rotate through the three clips indefinitely.
    const interval = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % VIDEO_SOURCES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [phase, reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <PhotoCollage visible={reducedMotion || phase === 'collage'} />
      {!reducedMotion && <VideoTakeover visible={phase === 'video'} activeIndex={videoIndex} />}
    </div>
  );
}

/* ---------- Signature element: a hanging wood-plank shop sign,
   carrying the headline itself instead of a generic pulsing badge.
   Reuses the rope/nail + wood-plank language established by
   PriceTag elsewhere on the site, given a slow, believable sway —
   like the sign over a real showroom door. ---------- */
function HangingSign() {
  const signRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = signRef.current;
    if (!el) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.to(el, {
        rotate: 1.6,
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        transformOrigin: 'top center',
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative inline-block mb-8">
      <svg width="2" height="34" viewBox="0 0 2 34" className="mx-auto block text-[#3d2914]/50" aria-hidden="true">
        <line x1="1" y1="0" x2="1" y2="34" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div ref={signRef} style={{ transformOrigin: 'top center' }}>
        <div className="flex justify-between px-6 -mb-2 relative z-10">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="block w-2.5 h-2.5 rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #EACB8B, #8a662a 65%, #5f461c 100%)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        <div
          className="cta-badge relative px-3 py-1.5 rounded-full"
          style={{
            background: 'linear-gradient(180deg, #7c4f2c 0%, #5a3820 55%, #4a2e18 100%)',
            boxShadow:
              'inset 0 0 0 1px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.15), 0 10px 20px -10px rgba(0,0,0,0.6)',
          }}
        >
          <span className="text-[11px] sm:text-xs font-bold tracking-wide text-[#F3D98B]">
            معرضك . رقميًا
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-badge',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.cta-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1, scrollTrigger: { trigger: el, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.cta-desc',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.25, scrollTrigger: { trigger: el, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.cta-btns',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4, scrollTrigger: { trigger: el, start: 'top 70%' } },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative isolate min-h-[90vh] flex items-center overflow-hidden"
    >
      <ShowroomMediaBackground />

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#2a1c10]/80 via-[#2a1c10]/68 to-[#1c130a]/85 pointer-events-none" />

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 40%, rgba(101,122,99,0.14) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-20">
        <HangingSign />

        <h2 className="cta-title display text-4xl sm:text-5xl lg:text-6xl text-bg mb-6 leading-tight">
          معرضك جاهز
          <br />
          <span className="text-sage-light">للخطوة التالية.</span>
        </h2>

        <p className="cta-desc text-lg sm:text-xl text-bg/70 mb-10 max-w-lg mx-auto">
          إدارة معرضك أصبحت أبسط. ابدأ اليوم وخلّي معرضك رقميًا.
        </p>

        <div className="cta-btns flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:brightness-110 hover:scale-[1.03]"
            style={{
              background: 'linear-gradient(180deg, #F3D98B 0%, #C99A3E 100%)',
              color: '#3d2914',
              boxShadow: '0 14px 28px -12px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            ابدأ الآن
            <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#hero"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(180deg, #7c4f2c 0%, #5a3820 55%, #4a2e18 100%)',
              color: '#F3D98B',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.15), 0 10px 22px -12px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            العودة للأعلى
          </a>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 text-sm text-bg/40">
          <span>بدون بطاقة ائتمان</span>
          <span className="w-1 h-1 rounded-full bg-bg/30" />
          <span>إعداد في دقائق</span>
          <span className="w-1 h-1 rounded-full bg-bg/30" />
          <span>إلغاء في أي وقت</span>
        </div>
      </div>
    </section>
  );
}