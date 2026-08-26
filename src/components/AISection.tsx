import { useState, useEffect, useRef, useId } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { gsap } from '@/hooks/useSmoothScroll';

interface Message {
  role: 'user' | 'ai';
  text: string;
  chart?: boolean;
}

const conversation: Message[] = [
  { role: 'user', text: 'ما أكثر المنتجات مبيعًا هذا الشهر؟' },
  {
    role: 'ai',
    text: 'الكنبة موديل Milano حققت 37 عملية بيع هذا الشهر، بزيادة 18% عن الشهر السابق. تليها الكرسي Oak بـ 24 عملية.',
    chart: true,
  },
  { role: 'user', text: 'أي فرع أداؤه أفضل؟' },
  {
    role: 'ai',
    text: 'فرع دمياط حقق أعلى مبيعات بـ 92 ألف جنيه، بزيادة 15% عن الشهر الماضي. فرع القاهرة في المركز الثاني.',
  },
];

/* backend that holds the Anthropic API key — see server/index.js */
const CHAT_API_URL = 'http://localhost:3001/api/chat';
const FALLBACK_REPLY = 'حصل خطأ بسيط، جرّب تاني أو تواصل مع فريقنا مباشرة.';

const FEATURES = [
  {
    label: 'تحليل المبيعات بالأرقام',
    icon: <path d="M4 20V11M10 20V4M16 20v-8M22 20V7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: 'مقارنة أداء الفروع',
    icon: (
      <>
        <circle cx="6" cy="6.5" r="2" strokeLinecap="round" />
        <circle cx="18" cy="17.5" r="2" strokeLinecap="round" />
        <path d="M6 8.5V15a3 3 0 003 3h6.2M18 15.5V9a3 3 0 00-3-3H8.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: 'تنبيهات المخزون الذكية',
    icon: (
      <>
        <path d="M12 3a5 5 0 00-5 5v3.6c0 .7-.28 1.36-.78 1.85L4.6 15a1.5 1.5 0 001.06 2.56h12.68A1.5 1.5 0 0019.4 15l-1.62-1.55a2.6 2.6 0 01-.78-1.85V8a5 5 0 00-5-5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 20a2.5 2.5 0 005 0" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'توصيات لزيادة الأرباح',
    icon: (
      <>
        <path d="M4 17l5-5 4 4 7-7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 8h5v5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- signature element: quiet neural constellation ---------- */
function NeuralField({ active }: { active: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const done = useRef(false);

  const nodes = [
    { x: 40, y: 40, r: 3.4, tone: 'gold' },
    { x: 140, y: 22, r: 2.2, tone: 'sage' },
    { x: 230, y: 70, r: 3, tone: 'sage' },
    { x: 330, y: 30, r: 2.4, tone: 'gold' },
    { x: 70, y: 150, r: 2.6, tone: 'sage' },
    { x: 190, y: 175, r: 3.6, tone: 'gold' },
    { x: 300, y: 140, r: 2.2, tone: 'sage' },
    { x: 370, y: 210, r: 3, tone: 'sage' },
    { x: 20, y: 240, r: 2.4, tone: 'gold' },
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [3, 6], [6, 7], [4, 8],
  ];

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !active || done.current) return;
    done.current = true;

    const lines = svg.querySelectorAll('.nf-edge');
    const dots = svg.querySelectorAll('.nf-node');

    if (reducedMotion()) {
      gsap.set(lines, { strokeDashoffset: 0, opacity: 0.22 });
      gsap.set(dots, { opacity: 0.7, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      lines.forEach((line) => {
        const len = (line as SVGPathElement).getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.22 });
      });
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(lines, { strokeDashoffset: 0, duration: 1.1, stagger: 0.08, ease: 'power2.out' })
        .fromTo(dots, { opacity: 0, scale: 0 }, { opacity: 0.75, scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(2)' }, '-=0.7')
        .add(() => {
          dots.forEach((dot, i) => {
            gsap.to(dot, {
              opacity: 0.35,
              scale: 1.25,
              duration: 1.6 + (i % 3) * 0.4,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: i * 0.18,
            });
          });
        });
    }, svg);

    return () => ctx.revert();
  }, [active]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 270"
      className="pointer-events-none absolute -inset-x-6 -top-10 -bottom-10 w-[calc(100%+3rem)] h-[calc(100%+5rem)] opacity-70"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <path
          key={i}
          className="nf-edge"
          d={`M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`}
          stroke={nodes[a].tone === 'gold' ? 'var(--gold-bright)' : 'currentColor'}
          strokeWidth="1"
          fill="none"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          className="nf-node"
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={n.tone === 'gold' ? 'var(--gold-bright)' : 'currentColor'}
          opacity="0"
        />
      ))}
    </svg>
  );
}

/* ---------- chat header avatar ---------- */
function OrbAvatar() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to('.orb-ring', { rotation: 360, transformOrigin: '50% 50%', duration: 9, repeat: -1, ease: 'none' });
      gsap.to(['.orb-pulse-1', '.orb-pulse-2'], {
        scale: 1.6,
        opacity: 0,
        duration: 2.2,
        repeat: -1,
        ease: 'power1.out',
        stagger: 1.1,
        transformOrigin: '50% 50%',
      });
    }, svg);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-10 h-10 shrink-0">
      <svg ref={ref} viewBox="0 0 40 40" className="absolute inset-0 w-full h-full overflow-visible">
        <circle className="orb-pulse-1 text-sage" cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
        <circle className="orb-pulse-2 text-sage" cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
        <circle className="orb-ring" cx="20" cy="20" r="18.5" fill="none" stroke="var(--gold-bright)" strokeWidth="1.2" strokeDasharray="3 6" strokeLinecap="round" opacity="0.8" />
      </svg>
      <div className="absolute inset-[3px] rounded-2xl bg-gradient-to-br from-sage to-sage-light grid place-items-center shadow-glow">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-bg" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a4 4 0 014 4v1a4 4 0 014 4v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3a4 4 0 014-4V6a4 4 0 014-4z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="13" r="1" fill="currentColor" />
          <circle cx="15" cy="13" r="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- typing indicator ---------- */
function TypingDots() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dots = ref.current?.querySelectorAll('.dot');
    if (!dots || !dots.length) return;
    if (reducedMotion()) {
      gsap.set(dots, { opacity: 0.8 });
      return;
    }
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(dots, { y: -5, opacity: 1, duration: 0.32, stagger: 0.14, ease: 'sine.out' })
      .to(dots, { y: 0, opacity: 0.4, duration: 0.32, stagger: 0.14, ease: 'sine.in' }, '-=0.18');
    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={ref} className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="dot w-2 h-2 rounded-full bg-sage" style={{ opacity: 0.4 }} />
      ))}
    </div>
  );
}

/* ---------- mini sales chart inside AI bubble ---------- */
function MiniBarChart() {
  const clipId = useId();
  const data = [85, 60, 42, 95, 72, 55, 38];
  const wrapRef = useRef<SVGSVGElement>(null);
  const W = 140, H = 44, BAR_W = 12, GAP = (W - BAR_W * data.length) / (data.length - 1);

  useEffect(() => {
    const svg = wrapRef.current;
    if (!svg) return;
    const bars = svg.querySelectorAll('.bc-bar');
    const shimmer = svg.querySelector('.bc-shimmer');

    if (reducedMotion()) {
      gsap.set(bars, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleY: 0, transformOrigin: '50% 100%' },
        { scaleY: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.6)', delay: 0.15 }
      );
      if (shimmer) {
        gsap.fromTo(shimmer, { xPercent: -120 }, { xPercent: 220, duration: 2.2, repeat: -1, repeatDelay: 1, ease: 'power1.inOut', delay: 1 });
      }
    }, svg);
    return () => ctx.revert();
  }, []);

  return (
    <div className="mt-3 rounded-xl bg-bg/15 p-3 overflow-hidden">
      <svg ref={wrapRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-12" preserveAspectRatio="none">
        <defs>
          <clipPath id={clipId}>
            {data.map((h, i) => {
              const x = i * (BAR_W + GAP);
              const y = H - (h / 100) * H;
              return <rect key={i} x={x} y={y} width={BAR_W} height={(h / 100) * H} rx="2" />;
            })}
          </clipPath>
        </defs>
        {data.map((h, i) => {
          const x = i * (BAR_W + GAP);
          const y = H - (h / 100) * H;
          return (
            <rect
              key={i}
              className="bc-bar"
              x={x}
              y={y}
              width={BAR_W}
              height={(h / 100) * H}
              rx="2"
              fill="currentColor"
              opacity="0.4"
            />
          );
        })}
        <g clipPath={`url(#${clipId})`}>
          <rect className="bc-shimmer" x="-30" y="0" width="30" height={H} fill="rgba(255,255,255,0.35)" />
        </g>
      </svg>
      <div className="text-[10px] text-bg/70 mt-1.5">مبيعات المنتجات — هذا الشهر</div>
    </div>
  );
}

/* ---------- feature row with self-drawing icon ---------- */
function FeatureList({ active }: { active: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !active || done.current) return;
    done.current = true;

    const icons = wrap.querySelectorAll('.feature-icon path');
    const rows = wrap.querySelectorAll('.feature-row');

    if (reducedMotion()) {
      gsap.set(icons, { strokeDashoffset: 0 });
      gsap.set(rows, { opacity: 1, x: 0 });
      return;
    }

    icons.forEach((p) => {
      const len = (p as SVGPathElement).getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(rows, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' })
        .to(icons, { strokeDashoffset: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, '-=0.6');
    }, wrap);
    return () => ctx.revert();
  }, [active]);

  return (
    <div ref={wrapRef} className="space-y-3">
      {FEATURES.map((f) => (
        <div key={f.label} className="feature-row flex items-center gap-3 text-ink/70">
          <span className="feature-icon grid place-items-center w-8 h-8 rounded-full bg-sage/15 text-sage shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              {f.icon}
            </svg>
          </span>
          <span className="text-sm font-medium">{f.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- section ---------- */
export default function AISection() {
  const ref = useReveal<HTMLDivElement>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [decorActive, setDecorActive] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animatedCount = useRef(0);
  const timeouts = useRef<number[]>([]);

  /* --- scripted demo playback: plays the fixed conversation once, in order --- */
  const playDemo = (i: number) => {
    if (i >= conversation.length) return;
    const msg = conversation[i];
    const delay = i === 0 ? 500 : 700;

    const id = window.setTimeout(() => {
      if (msg.role === 'ai') {
        setTyping(true);
        const typingId = window.setTimeout(() => {
          setTyping(false);
          setMessages((m) => [...m, msg]);
          playDemo(i + 1);
        }, 1200);
        timeouts.current.push(typingId);
      } else {
        setMessages((m) => [...m, msg]);
        playDemo(i + 1);
      }
    }, delay);
    timeouts.current.push(id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          setDecorActive(true);
          playDemo(0);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      timeouts.current.forEach(clearTimeout);
    };
  }, [ref]);

  /* --- animate only newly-added bubbles, never on unrelated re-renders --- */
  useEffect(() => {
    for (let i = animatedCount.current; i < messages.length; i++) {
      const el = bubbleRefs.current[i];
      if (!el) continue;
      if (reducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y: 18, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }
        );
      }
    }
    animatedCount.current = messages.length;
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  /* --- real reply from the backend (which holds the Anthropic API key) --- */
  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || typing) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setInputValue('');
    setTyping(true);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setTyping(false);
      setMessages((m) => [...m, { role: 'ai', text: data.reply ?? FALLBACK_REPLY }]);
    } catch {
      setTyping(false);
      setMessages((m) => [...m, { role: 'ai', text: FALLBACK_REPLY }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="ai" className="relative py-16 px-6 bg-bg-2/40 overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div data-reveal className="relative">
            <NeuralField active={decorActive} />
            <div className="relative">
              <div className="eyebrow mb-4">المساعد الذكي</div>
              <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ink mb-6 leading-tight">
                المعرض
                <br />
                <span className="relative inline-block text-sage pb-2">
                  يفهم أرقامك.
                  <svg className="absolute left-0 bottom-0 w-full h-2.5 text-gold" viewBox="0 0 160 14" preserveAspectRatio="none" fill="none" aria-hidden="true">
                    <path
                      d="M2 8 Q 6 3 11 8 T 21 8 T 31 8 T 41 8 T 51 8 T 61 8 T 71 8 T 81 8 T 91 8 T 101 8 T 111 8 T 121 8 T 131 8 T 141 8 T 151 8 T 158 8"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-lg text-ink/60 leading-relaxed mb-8 max-w-md">
                اسأل بالعربي عن أي شيء في معرضك — أكثر المنتجات مبيعًا، أداء الفروع،
                حالة المخزون — واحصل على إجابة فورية.
              </p>
              <FeatureList active={decorActive} />
            </div>
          </div>

          <div data-reveal>
            <div className="rounded-3xl bg-bg border border-ink/8 shadow-float overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-ink/8 bg-bg-2/30">
                <OrbAvatar />
                <div>
                  <div className="font-bold text-ink text-sm">مساعد معرض</div>
                  <div className="text-xs text-ink/45">متصل الآن</div>
                </div>
                <div className="mr-auto flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                </div>
              </div>

              <div ref={scrollRef} className="p-5 h-80 overflow-y-auto space-y-4 bg-bg-2/10">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div
                      ref={(el) => { bubbleRefs.current[i] = el; }}
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-bg-2 text-ink rounded-tr-md'
                          : 'bg-sage text-bg rounded-tl-md shadow-glow'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      {msg.role === 'ai' && msg.chart && <MiniBarChart />}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tl-md bg-sage/20 px-4 py-2">
                      <TypingDots />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 px-4 py-3 border-t border-ink/8 bg-bg">
                <div className="flex-1 flex items-center gap-2 rounded-xl bg-bg-2/50 px-4 py-2.5 focus-within:ring-2 focus-within:ring-sage/40 transition-shadow">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink/30 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={typing}
                    placeholder="اكتب سؤالك..."
                    className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink/35 outline-none disabled:opacity-60"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || typing}
                  className="grid place-items-center w-10 h-10 rounded-xl bg-sage text-bg hover:bg-sage/90 disabled:opacity-40 disabled:hover:bg-sage transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}