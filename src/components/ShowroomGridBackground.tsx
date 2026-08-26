/* ---------- Ambient wood-grain background: pulls the same material
   language used everywhere else on the site (PriceTag's WOOD_FRAME,
   ProblemSolution's wood plank) into a very quiet backdrop behind
   ProblemSolution + PricingSection. No external assets, no fetch, no
   animation library — just a few layered SVG grain lines + a warm
   radial glow, all at very low opacity so it reads as texture, not
   as a competing shape. A single slow drift keeps it from feeling
   static without asking for attention. ---------- */

function GrainLines({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  // A handful of long, gently wavy horizontal strokes — like the
  // natural grain lines running through a wood plank.
  const rows = [
    'M-50 40 Q 150 20 350 45 T 750 35 T 1150 50',
    'M-50 90 Q 200 70 400 95 T 800 85 T 1150 100',
    'M-50 150 Q 180 130 380 155 T 780 145 T 1150 158',
    'M-50 210 Q 220 195 420 215 T 820 205 T 1150 218',
    'M-50 270 Q 160 250 360 275 T 760 265 T 1150 278',
  ];

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 1100 300"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {rows.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={i % 2 === 0 ? 1.4 : 0.9}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export default function ShowroomGridBackground() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none text-[#5a3820]"
      aria-hidden="true"
    >
      {/* warm ambient glow, same family as the wood tones elsewhere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 15% 10%, rgba(133,87,47,0.05) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 55% 40% at 85% 90%, rgba(122,158,116,0.04) 0%, transparent 60%)',
        }}
      />

      {/* layered grain — three passes at different scale/opacity/drift
          speed so it has quiet depth instead of looking like one flat
          repeated pattern */}
      <GrainLines
        className="absolute w-[140%] h-[55%] opacity-[0.05]"
        style={{ top: '-4%', left: '-15%', animation: 'grain-drift-a 46s ease-in-out infinite' }}
      />
      <GrainLines
        className="absolute w-[150%] h-[50%] opacity-[0.035]"
        style={{ top: '38%', left: '-25%', animation: 'grain-drift-b 60s ease-in-out infinite' }}
      />
      <GrainLines
        className="absolute w-[140%] h-[55%] opacity-[0.045]"
        style={{ top: '72%', left: '-10%', animation: 'grain-drift-a 52s ease-in-out infinite' }}
      />

      <style>{`
        @keyframes grain-drift-a {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-1.5%) translateY(0.6%); }
        }
        @keyframes grain-drift-b {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(1.5%) translateY(-0.5%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="grain-drift"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}