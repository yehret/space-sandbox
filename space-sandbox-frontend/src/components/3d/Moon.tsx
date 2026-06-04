import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useUIStore } from '../../store/useUIStore';
import { MoonData } from '../../types';

export default function Moon({
  moon,
  timeScale,
  isPaused,
}: {
  moon: MoonData;
  timeScale: number;
  isPaused: boolean;
}) {
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const [colorMap, setColorMap] = useState<THREE.Texture | null>(null);

  const showOrbits = useUIStore((state) => state.showOrbits);

  useEffect(() => {
    if (!moon.textureUrl) {
      setColorMap(null);
      return;
    }

    let isActive = true;
    const loader = new THREE.TextureLoader();

    loader.load(
      moon.textureUrl,
      (texture) => {
        if (!isActive) return;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        setColorMap(texture);
      },
      undefined,
      (error) => {
        console.error(`Failed to load moon texture: ${moon.textureUrl}`, error);
      },
    );

    return () => {
      isActive = false;
    };
  }, [moon.textureUrl]);

  useFrame((_, delta) => {
    if (!moonMeshRef.current || isPaused) return;

    // Clamp delta for consistent animation across frame rates
    const safeDelta = Math.min(delta, 0.1);

    angleRef.current += safeDelta * timeScale * moon.speed;

    moonMeshRef.current.position.x = Math.cos(angleRef.current) * moon.distance;
    moonMeshRef.current.position.z = Math.sin(angleRef.current) * moon.distance;
  });

  const orbitPoints = useMemo(() => {
    return Array.from({ length: 65 }).map((_, i) => {
      const angle = (i / 64) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * moon.distance, 0, Math.sin(angle) * moon.distance);
    });
  }, [moon.distance]);

  return (
    <group rotation={[0, 0, moon.orbitalInclination]}>
      {showOrbits && (
        <Line
          points={orbitPoints}
          color={moon.color}
          transparent
          opacity={0.1}
          dashed
          dashSize={0.2}
          gapSize={0.2}
        />
      )}

      <mesh ref={moonMeshRef} castShadow receiveShadow>
        <sphereGeometry args={[moon.size, 16, 16]} />
        <meshStandardMaterial
          key={colorMap ? 'textured' : 'solid'}
          color={colorMap ? '#ffffff' : moon.color}
          map={colorMap}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
