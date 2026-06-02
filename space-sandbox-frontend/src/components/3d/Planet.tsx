import { Line, Trail } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../../store/useSystemStore';
import { MoonData, PlanetaryRingData } from '../../types';
import Moon from './Moon';
import PlanetaryRing from './PlanetaryRing';

type PlanetProps = {
  distance: number;
  speed: number;
  size: number;
  color: string;
  textureUrl?: string;
  rotationSpeed: number;
  axialTilt: number;
  orbitalInclination: number;
  moons?: MoonData[];
  rings?: PlanetaryRingData[];
};

export default function Planet({
  distance,
  speed,
  size,
  color,
  textureUrl,
  rotationSpeed,
  axialTilt,
  orbitalInclination,
  moons = [],
  rings = [],
}: PlanetProps) {
  const orbitPositionRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const [colorMap, setColorMap] = useState<THREE.Texture | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);
  const angleRef = useRef(initialAngle);

  const isPaused = useSystemStore((state) => state.isPaused);
  const timeScale = useSystemStore((state) => state.timeScale);
  const showOrbits = useSystemStore((state) => state.showOrbits);
  const showTrails = useSystemStore((state) => state.showTrails);

  const initialX = Math.cos(initialAngle) * distance;
  const initialZ = Math.sin(initialAngle) * distance;

  useLayoutEffect(() => {
    if (orbitPositionRef.current && planetMeshRef.current) {
      orbitPositionRef.current.position.x = initialX;
      orbitPositionRef.current.position.z = initialZ;
      orbitPositionRef.current.updateMatrixWorld(true);
      setIsReady(true);
    }
  }, [initialX, initialZ]);

  useEffect(() => {
    if (textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(
        textureUrl,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          setColorMap(texture);
        },
        undefined,
        (error) => console.error('Failed to load texture:', error),
      );
    } else {
      setColorMap(null);
    }
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (!orbitPositionRef.current || !planetMeshRef.current) return;

    // Clamp delta to prevent jumps when tab is unfocused
    const safeDelta = Math.min(delta, 0.1);

    if (!isPaused) {
      angleRef.current += safeDelta * timeScale * speed;
      planetMeshRef.current.rotateY(rotationSpeed * timeScale * safeDelta * 50);
    }

    orbitPositionRef.current.position.x = Math.cos(angleRef.current) * distance;
    orbitPositionRef.current.position.z = Math.sin(angleRef.current) * distance;
  });

  const planetOrbitPoints = useMemo(() => {
    return Array.from({ length: 65 }).map((_, i) => {
      const angle = (i / 64) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);
    });
  }, [distance]);

  return (
    <group rotation={[0, 0, orbitalInclination]}>
      {showOrbits && (
        <Line
          points={planetOrbitPoints}
          color={color}
          transparent
          opacity={0.15}
          dashed
          dashSize={0.4}
          gapSize={0.4}
        />
      )}

      <group ref={orbitPositionRef} position={[initialX, 0, initialZ]}>
        <group rotation={[axialTilt, 0, 0]}>
          {moons.map((moon) => (
            <Moon key={moon.id} moon={moon} timeScale={timeScale} isPaused={isPaused} />
          ))}
        </group>

        {isReady && showTrails && (
          <Trail
            key={`${distance}-${size}-${color}`}
            target={orbitPositionRef as any}
            local={false}
            width={size * 1.5}
            length={25}
            color={color}
            attenuation={(t) => t * t}
          />
        )}

        <group rotation={[axialTilt, 0, 0]}>
          <mesh ref={planetMeshRef}>
            <sphereGeometry args={[size, 64, 64]} />
            <meshStandardMaterial
              color={colorMap ? '#ffffff' : color}
              map={colorMap}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {rings && rings.length > 0 && (
            <group>
              {rings.map((ring) => (
                <PlanetaryRing key={ring.id} size={size} ring={ring} />
              ))}
            </group>
          )}
        </group>
      </group>
    </group>
  );
}
