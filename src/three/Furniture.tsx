import { useMemo } from 'react';
import * as THREE from 'three';

const WOOD = '#8A6245';
const WOOD_DARK = '#6B4A32';
const FABRIC = '#657A63';
const FABRIC_LIGHT = '#DDE4D7';
const GOLD = '#B79B68';
const METAL = '#3A3D38';

export function Sofa(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.5, 1.0]} />
        <meshStandardMaterial color={FABRIC} roughness={0.85} metalness={0} />
      </mesh>
      {[-0.7, 0, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.62, 0.02]} castShadow>
          <boxGeometry args={[0.66, 0.22, 0.9]} />
          <meshStandardMaterial color={FABRIC_LIGHT} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.85, -0.42]} castShadow>
        <boxGeometry args={[2.2, 0.7, 0.22]} />
        <meshStandardMaterial color={FABRIC} roughness={0.85} />
      </mesh>
      {[-0.7, 0, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.92, -0.3]} castShadow>
          <boxGeometry args={[0.64, 0.5, 0.16]} />
          <meshStandardMaterial color={FABRIC_LIGHT} roughness={0.9} />
        </mesh>
      ))}
      {[-1.05, 1.05].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.6, 0]} castShadow>
            <boxGeometry args={[0.18, 0.7, 1.0]} />
            <meshStandardMaterial color={FABRIC} roughness={0.85} />
          </mesh>
          <mesh position={[x, 0.95, 0]} castShadow>
            <boxGeometry args={[0.22, 0.16, 1.0]} />
            <meshStandardMaterial color={WOOD} roughness={0.6} />
          </mesh>
        </group>
      ))}
      {[
        [-0.95, -0.42],
        [0.95, -0.42],
        [-0.95, 0.42],
        [0.95, 0.42],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.06, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.12, 10]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function Armchair(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.0, 0.42, 0.9]} />
        <meshStandardMaterial color={GOLD} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.68, 0.02]} castShadow>
        <boxGeometry args={[0.86, 0.18, 0.78]} />
        <meshStandardMaterial color={FABRIC_LIGHT} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.95, -0.36]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.2]} />
        <meshStandardMaterial color={GOLD} roughness={0.8} />
      </mesh>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.7, 0]} castShadow>
          <boxGeometry args={[0.16, 0.56, 0.9]} />
          <meshStandardMaterial color={GOLD} roughness={0.8} />
        </mesh>
      ))}
      {[
        [-0.4, -0.38],
        [0.4, -0.38],
        [-0.4, 0.38],
        [0.4, 0.38],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.16, 8]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function CoffeeTable(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.4, 0.12, 0.7]} />
        <meshStandardMaterial color={WOOD} roughness={0.55} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.56, 0]} receiveShadow>
        <boxGeometry args={[1.3, 0.04, 0.62]} />
        <meshStandardMaterial color={FABRIC_LIGHT} roughness={0.95} />
      </mesh>
      {[
        [-0.62, -0.28],
        [0.62, -0.28],
        [-0.62, 0.28],
        [0.62, 0.28],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.25, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0.4, 0.66, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.04, 0.16, 12]} />
        <meshStandardMaterial color={FABRIC} roughness={0.7} />
      </mesh>
      <mesh position={[-0.3, 0.6, 0.1]} castShadow>
        <boxGeometry args={[0.3, 0.04, 0.2]} />
        <meshStandardMaterial color={GOLD} roughness={0.7} />
      </mesh>
      <mesh position={[-0.28, 0.64, 0.1]} castShadow>
        <boxGeometry args={[0.28, 0.04, 0.18]} />
        <meshStandardMaterial color={FABRIC} roughness={0.7} />
      </mesh>
    </group>
  );
}

export function TVUnit(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.6, 0.45]} />
        <meshStandardMaterial color={WOOD} roughness={0.55} metalness={0.08} />
      </mesh>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.3, 0.23]}>
          <boxGeometry args={[0.02, 0.5, 0.01]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
        </mesh>
      ))}
      {[-0.25, 0.25].map((x) => (
        <mesh key={x} position={[x, 0.3, 0.24]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.2]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.1, -0.05]} castShadow>
        <boxGeometry args={[1.6, 0.9, 0.06]} />
        <meshStandardMaterial color={METAL} roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh position={[0, 1.1, -0.02]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial
          color="#1a1d18"
          roughness={0.2}
          metalness={0.1}
          emissive={FABRIC}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0.8, 0.66, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.05, 0.12, 12]} />
        <meshStandardMaterial color={FABRIC} roughness={0.7} />
      </mesh>
    </group>
  );
}

export function FloorLamp(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.04, 16]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 1.74, 8]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.78, 0]} castShadow>
        <coneGeometry args={[0.18, 0.22, 18, 1, true]} />
        <meshStandardMaterial
          color={FABRIC_LIGHT}
          roughness={0.8}
          side={THREE.DoubleSide}
          emissive={FABRIC}
          emissiveIntensity={0.15}
        />
      </mesh>
      <pointLight position={[0, 1.7, 0]} intensity={0.5} distance={3} color="#F4E9D6" />
    </group>
  );
}

export function Plant(props: JSX.IntrinsicElements['group']) {
  const leaves = useMemo(() => {
    const items: { pos: [number, number, number]; rot: number; s: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      items.push({
        pos: [Math.cos(a) * 0.08, 0.5 + Math.sin(i) * 0.06, Math.sin(a) * 0.08],
        rot: a + Math.PI / 2,
        s: 0.9 + (i % 3) * 0.12,
      });
    }
    return items;
  }, []);

  return (
    <group {...props}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.1, 0.24, 16]} />
        <meshStandardMaterial color={GOLD} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.15, 0.14, 0.03, 16]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      {leaves.map((l, i) => (
        <mesh
          key={i}
          position={l.pos}
          rotation={[0.3, l.rot, 0]}
          scale={l.s}
          castShadow
        >
          <coneGeometry args={[0.06, 0.28, 6]} />
          <meshStandardMaterial color={FABRIC} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 0.56, 0]} castShadow>
        <coneGeometry args={[0.05, 0.2, 6]} />
        <meshStandardMaterial color={FABRIC} roughness={0.8} />
      </mesh>
    </group>
  );
}

export function Rug(props: JSX.IntrinsicElements['group']) {
  return (
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[3.4, 2.2]} />
      <meshStandardMaterial color={FABRIC_LIGHT} roughness={0.95} />
    </mesh>
  );
}

export function Frame(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.8, 0.04]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[0.52, 0.72]} />
        <meshStandardMaterial color={FABRIC_LIGHT} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.1, 0.03]}>
        <circleGeometry args={[0.12, 24]} />
        <meshStandardMaterial color={FABRIC} roughness={0.8} />
      </mesh>
      <mesh position={[-0.1, -0.1, 0.03]}>
        <planeGeometry args={[0.2, 0.3]} />
        <meshStandardMaterial color={GOLD} roughness={0.7} />
      </mesh>
    </group>
  );
}

export function ShowroomFloor(props: JSX.IntrinsicElements['mesh']) {
  return (
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#E8E2D6" roughness={0.9} metalness={0} />
    </mesh>
  );
}

export function WoodParticles({ count = 14, area = 7 }: { count?: number; area?: number }) {
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * area,
        Math.random() * 4 + 0.5,
        (Math.random() - 0.5) * area,
      ]);
    }
    return arr;
  }, [count, area]);

  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.random(), Math.random(), 0]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? GOLD : WOOD}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
