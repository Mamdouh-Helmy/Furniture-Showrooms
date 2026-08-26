import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sofa,
  Armchair,
  CoffeeTable,
  TVUnit,
  FloorLamp,
  Plant,
  Rug,
  Frame,
  ShowroomFloor,
  WoodParticles,
} from '@/three/Furniture';

function CameraRig({
  mouse,
  scrollProgress,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: React.MutableRefObject<number>;
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame((_, delta) => {
    const sp = scrollProgress.current;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    const baseAngle = -0.35 + sp * 0.9;
    const radius = 6.5 + sp * 2.5;
    const height = 2.2 + sp * 1.8 + my * 0.4;

    const desiredX = Math.sin(baseAngle) * radius + mx * 0.6;
    const desiredZ = Math.cos(baseAngle) * radius;
    const desiredY = height;

    camera.position.x += (desiredX - camera.position.x) * Math.min(1, delta * 2.2);
    camera.position.y += (desiredY - camera.position.y) * Math.min(1, delta * 2.2);
    camera.position.z += (desiredZ - camera.position.z) * Math.min(1, delta * 2.2);

    target.current.set(mx * 0.3, 1.1 + my * 0.2, 0);
    camera.lookAt(target.current);
  });

  return null;
}

function ShowroomGroup({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      const sp = scrollProgress.current;
      group.current.rotation.y += delta * (0.04 + sp * 0.06);
    }
  });

  return (
    <group ref={group}>
      <Rug position={[0, 0, 0]} />
      <Sofa position={[0, 0, 0.15]} />
      <CoffeeTable position={[0, 0, 1.5]} />
      <Armchair position={[1.7, 0, 1.6]} rotation={[0, -0.5, 0]} />
      <TVUnit position={[0, 0, -1.6]} />
      <FloorLamp position={[-2.2, 0, 1.2]} />
      <Plant position={[2.2, 0, -0.8]} />
      <Frame position={[-2.4, 1.8, 0.1]} rotation={[0, 0.3, 0]} />
      <WoodParticles count={14} area={7} />
    </group>
  );
}

function FloatingAccents() {
  const items = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 10,
          Math.random() * 3 + 1,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        s: 0.15 + Math.random() * 0.12,
        kind: i % 3,
      })),
    [],
  );

  return (
    <group>
      {items.map((it, i) => (
        <Float key={i} speed={1 + Math.random() * 0.6} rotationIntensity={0.3} floatIntensity={0.8}>
          <mesh position={it.pos} scale={it.s}>
            {it.kind === 0 && <boxGeometry args={[1, 1, 1]} />}
            {it.kind === 1 && <sphereGeometry args={[0.5, 16, 16]} />}
            {it.kind === 2 && <coneGeometry args={[0.5, 1, 6]} />}
            <meshStandardMaterial
              color={i % 2 ? '#B79B68' : '#657A63'}
              roughness={0.6}
              metalness={0.1}
              transparent
              opacity={0.35}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export interface HeroSceneProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: React.MutableRefObject<number>;
  reduced?: boolean;
}

export default function HeroScene({ mouse, scrollProgress, reduced = false }: HeroSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <PerspectiveCamera makeDefault position={[5, 2.4, 6]} fov={42} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 8, 3]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.35} color="#F4E9D6" />

      <Suspense fallback={null}>
        <ShowroomGroup scrollProgress={scrollProgress} />
        {!reduced && <FloatingAccents />}
        <Environment preset="apartment" environmentIntensity={0.4} />
      </Suspense>

      <ShowroomFloor position={[0, 0, 0]} />
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.45}
        scale={12}
        blur={2.4}
        far={4}
        color="#3a3328"
      />
      <fog attach="fog" args={['#F7F5F0', 9, 20]} />

      <CameraRig mouse={mouse} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
