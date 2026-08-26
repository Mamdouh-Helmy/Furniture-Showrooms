import { lazy, Suspense, useCallback, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

/* The 3D viewer (react-three-fiber + three.js) is its own bundle chunk —
   it only downloads the first time any card is actually activated. */
const Product3DViewer = lazy(() => import('./Product3DViewer'));

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */
interface Product {
  name: string;
  model: string;
  price: string;
  branches: number;
  available: boolean;
  /** path to the .glb asset — served from /public/models */
  modelSrc: string;
}

const products: Product[] = [
  {
    name: 'كنبة سكشنال',
    model: 'موديل Milano',
    price: '18,500',
    branches: 3,
    available: true,
    modelSrc: '/models/sectional-sofa.glb',
  },
  {
    name: 'مكتب خشب',
    model: 'موديل Oak',
    price: '3,200',
    branches: 5,
    available: true,
    modelSrc: '/models/office.glb',
  },
  {
    name: 'دولاب ملابس',
    model: 'موديل Nordic',
    price: '6,800',
    branches: 2,
    available: false,
    modelSrc: '/models/desk-drawer.glb',
  },
];

/* ------------------------------------------------------------------ */
/*  Same wood-joinery frame language as ScrollStorytelling's StepCard  */
/* ------------------------------------------------------------------ */
const WOOD_FRAME = {
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

function LoadingPulse() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-wood/15 animate-pulse" />
    </div>
  );
}

/* Idle state for every card except the active one — a clear call to
   action instead of an unexplained blank box. */
function ViewPrompt({ onClick, failed }: { onClick: () => void; failed: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={failed}
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 disabled:cursor-not-allowed"
    >
      <div className="w-14 h-14 rounded-full bg-wood/15 grid place-items-center transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-wood" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-xs font-semibold text-wood">
        {failed ? 'تعذر تحميل النموذج' : 'اضغط لعرض 360°'}
      </span>
    </button>
  );
}

function ProductCard({
  product,
  active,
  onActivate,
  onClose,
}: {
  product: Product;
  active: boolean;
  onActivate: () => void;
  onClose: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const onModelError = useCallback(() => setFailed(true), []);

  return (
    <div className="group relative rounded-[22px] p-3 sm:p-3.5" style={WOOD_FRAME}>
      <FrameCorner position="tl" />
      <FrameCorner position="tr" />
      <FrameCorner position="bl" />
      <FrameCorner position="br" />

      <div className="relative rounded-[14px] overflow-hidden bg-[#efe4cf] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(0,0,0,0.2)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          {active ? (
            <>
              <Suspense fallback={<LoadingPulse />}>
                <Product3DViewer src={product.modelSrc} onError={onModelError} />
              </Suspense>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق العرض"
                className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-ink/70 text-bg grid place-items-center text-sm"
              >
                ✕
              </button>
            </>
          ) : (
            <ViewPrompt onClick={onActivate} failed={failed} />
          )}

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#efe4cf] to-transparent pointer-events-none" />

          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${product.available ? 'bg-gold/15 text-gold' : 'bg-ink/10 text-ink/50'
              }`}
          >
            {product.available ? 'متوفر' : 'غير متوفر'}
          </span>

          {!failed && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-wood/20 text-wood">
              360°
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="display text-xl text-ink mb-1">{product.name}</h3>
          <p className="text-sm text-ink/45">{product.model}</p>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#e2d5b8]/70 px-4 py-2.5">
            <div>
              <span className="text-lg font-bold text-ink tnum">{product.price}</span>
              <span className="text-xs text-ink/50 mr-1">جنيه</span>
            </div>
            <span className="text-[11px] text-ink/45">
              متوفرة في {product.branches} {product.branches > 2 ? 'فروع' : 'فرع'}
            </span>
          </div>

          <button className="mt-4 w-full py-2.5 rounded-xl bg-ink/5 text-ink text-sm font-semibold hover:bg-wood hover:text-bg transition-all duration-300">
            عرض المنتج
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const ref = useReveal<HTMLDivElement>();
  // Lifted here (not per-card) so it's structurally impossible for more
  // than one card to hold a 3D viewer — and therefore more than one
  // WebGL context — at the same time.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="products" className="relative py-16 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div data-reveal className="text-center mb-14">
          <div className="eyebrow mb-4">المنتجات</div>
          <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ink mb-4">
            <span className="relative inline-block pb-4">
              كل قطعة أثاث في معرضك
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
            اعرض منتجاتك بشكل تفاعلي — السعر، التوفر، وتوفرها في الفروع.
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
        <div data-reveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <ProductCard
              key={p.name}
              product={p}
              active={activeIndex === i}
              onActivate={() => setActiveIndex(i)}
              onClose={() => setActiveIndex((cur) => (cur === i ? null : cur))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}