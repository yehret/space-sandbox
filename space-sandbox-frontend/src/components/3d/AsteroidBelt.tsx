import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useUIStore } from '../../store/useUiStore';

type AsteroidBeltProps = {
  distance: number;
  width: number;
  count: number;
  speed: number;
  color: string;
  orbitalInclination: number;
};

export default function AsteroidBelt({
  distance,
  width,
  count,
  speed,
  color,
  orbitalInclination,
}: AsteroidBeltProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const angleRef = useRef(0);
  const isPaused = useUIStore((state) => state.isPaused);
  const timeScale = useUIStore((state) => state.timeScale);
  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = distance + (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * (width * 0.2);

      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(
        Math.random() * 0.13 + 0.02,
        Math.random() * 0.13 + 0.02,
        Math.random() * 0.13 + 0.02,
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, distance, width]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (!isPaused) {
      angleRef.current += delta * timeScale * speed;
    }
    meshRef.current.rotation.y = angleRef.current;
  });

  return (
    <group rotation={[0, 0, orbitalInclination]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.2} />
      </instancedMesh>
    </group>
  );
}
