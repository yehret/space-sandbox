import * as THREE from 'three';
import { PlanetaryRingData } from '../../types';

export default function PlanetaryRing({ size, ring }: { size: number; ring: PlanetaryRingData }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size * ring.innerRadius, size * ring.outerRadius, 64]} />
      <meshStandardMaterial
        color={ring.color}
        transparent
        opacity={ring.opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
