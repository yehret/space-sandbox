import { Line, Trail } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { MoonData, PlanetaryRingData, useSystemStore } from '../../store/useSystemStore';

// --- 1. ВИПРАВЛЕНИЙ СУПУТНИК ---
function Moon({
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

  useFrame((_, delta) => {
    if (!moonMeshRef.current || isPaused) return;
    angleRef.current += delta * timeScale * moon.speed;

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
    // Нахиляємо супутник на власний кут відносно локального екватора планети
    <group rotation={[0, 0, moon.orbitalInclination]}>
      <Line
        points={orbitPoints}
        color={moon.color}
        transparent
        opacity={0.1}
        dashed
        dashSize={0.2}
        gapSize={0.2}
      />
      {/* <Trail width={moon.size * 1.5} length={15} color={moon.color} attenuation={(t) => t * t}> */}
      <mesh ref={moonMeshRef}>
        <sphereGeometry args={[moon.size, 32, 32]} />
        <meshStandardMaterial color={moon.color} roughness={0.8} />
      </mesh>
      {/* </Trail> */}
    </group>
  );
}

// --- 2. НОВЕ РЕАЛІСТИЧНЕ КІЛЬЦЕ ---
function PlanetaryRing({ size, color }: { size: number; color: string }) {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Внутрішнє напівпрозоре кільце */}
      <mesh>
        <ringGeometry args={[size * 1.3, size * 1.6, 64]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Основне щільне кільце */}
      <mesh>
        <ringGeometry args={[size * 1.65, size * 2.1, 64]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Зовнішнє тонке кільце */}
      <mesh>
        <ringGeometry args={[size * 2.15, size * 2.3, 64]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// --- 3. ГОЛОВНИЙ КОМПОНЕНТ ПЛАНЕТИ ---
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
  rings?: PlanetaryRingData[]; // <-- Оновили проп
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
  rings = [], // <-- Оновили деструктуризацію
}: PlanetProps) {
  const orbitPositionRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const [colorMap, setColorMap] = useState<THREE.Texture | null>(null);

  const angleRef = useRef(Math.random() * Math.PI * 2);
  const { isPaused, timeScale } = useSystemStore();

  useEffect(() => {
    if (textureUrl) {
      new THREE.TextureLoader().load(textureUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        setColorMap(texture);
      });
    } else {
      setColorMap(null);
    }
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (!orbitPositionRef.current || !planetMeshRef.current) return;

    if (!isPaused) {
      angleRef.current += delta * timeScale * speed;
      planetMeshRef.current.rotateY(rotationSpeed * timeScale);
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
      {/* Орбіта планети */}
      <Line
        points={planetOrbitPoints}
        color={color}
        transparent
        opacity={0.15}
        dashed
        dashSize={0.4}
        gapSize={0.4}
      />

      {/* Контейнер планети */}
      <group ref={orbitPositionRef}>
        {/* Супутники тепер обертаються з урахуванням нахилу осі планети (по екватору) */}
        <group rotation={[axialTilt, 0, 0]}>
          {moons.map((moon) => (
            <Moon key={moon.id} moon={moon} timeScale={timeScale} isPaused={isPaused} />
          ))}
        </group>

        <Trail width={size * 1.5} length={15} color={color} attenuation={(t) => t * t}>
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

            {/* Використовуємо наш новий компонент кільця */}
            {rings && rings.length > 0 && (
              <group>
                {rings.map((ring) => (
                  <PlanetaryRing key={ring.id} size={size} color={ring.color} />
                ))}
              </group>
            )}
          </group>
        </Trail>
      </group>
    </group>
  );
}
