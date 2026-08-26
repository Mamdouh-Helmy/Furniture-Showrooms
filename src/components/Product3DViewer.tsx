import { Component, Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls, useGLTF, useProgress, PerspectiveCamera } from '@react-three/drei';

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
}

function ModelLoadingOverlay() {
  const { progress, active } = useProgress();

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#efe4cf] transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <span className="text-xs font-semibold text-wood">جاري تحميل النموذج…</span>
      <div className="w-32 h-1.5 rounded-full bg-wood/15 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-[width] duration-200 ease-out"
          style={{ width: `${Math.round(progress)}%` }}
        />
      </div>
      <span className="text-[11px] text-ink/40 tnum">{Math.round(progress)}%</span>
    </div>
  );
}

interface ModelErrorBoundaryProps {
  onError: () => void;
  children: ReactNode;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

interface Product3DViewerProps {
  src: string;
  onError: () => void;
}

export default function Product3DViewer({ src, onError }: Product3DViewerProps) {
  return (
    <ModelErrorBoundary onError={onError}>
      <div className="relative w-full h-full">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          className="cursor-grab active:cursor-grabbing"
        >
          <PerspectiveCamera makeDefault fov={32} position={[0, 0, 6]} />

          <Suspense fallback={null}>
            <Stage
              adjustCamera={1.35}
              intensity={0.6}
              environment="city"
              shadows={{ type: 'contact', opacity: 0.45, blur: 2.4 }}
            >
              <Model src={src} />
            </Stage>
          </Suspense>

          <OrbitControls
            autoRotate
            autoRotateSpeed={1.2}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={9}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            enableDamping
            dampingFactor={0.08}
            makeDefault
          />
        </Canvas>

        <ModelLoadingOverlay />
      </div>
    </ModelErrorBoundary>
  );
}