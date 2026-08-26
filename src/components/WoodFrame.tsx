export const WOOD_FRAME = {
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

export function FrameCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
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

export function WoodFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative rounded-[22px] p-3 sm:p-3.5 ${className ?? ''}`} style={WOOD_FRAME}>
      <FrameCorner position="tl" />
      <FrameCorner position="tr" />
      <FrameCorner position="bl" />
      <FrameCorner position="br" />
      {children}
    </div>
  );
}