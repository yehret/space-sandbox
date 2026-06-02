import { Line, Trail } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type PlanetProps = {
  distance: number;
  speed: number;
  size: number;
  color: string;
};

export default function Planet({ distance, speed, size, color }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);

  // Вираховуємо точки для орбіти лише один раз при створенні планети (оптимізація)
  const orbitPoints = useMemo(() => {
    const points = [];
    // Робимо коло з 64 сегментів
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      points.push(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
    }
    return points;
  }, [distance]);

  useFrame(({ clock }) => {
    if (!planetRef.current) return;

    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * speed;

    planetRef.current.position.x = Math.cos(angle) * distance;
    planetRef.current.position.z = Math.sin(angle) * distance;
  });

  return (
    <group>
      {/* 1. Статична орбіта (Пунктирна лінія) */}
      <Line
        points={orbitPoints}
        color={color}
        transparent
        opacity={0.03} // Дуже прозора, щоб не засмічувати екран
        dashed={true}
        dashSize={0.8} // Довжина одного штриха
        gapSize={0.8} // Відстань між штрихами
      />

      {/* 2. Динамічний трейс (Хвіст, що летить за планетою) */}
      <Trail
        width={size * 1.5} // Ширина трейсу трохи більша за планету
        length={100} // Наскільки довгим буде хвіст
        color={color}
        attenuation={(t) => t * t} // Математика згасання: хвіст плавно розчиняється і звужується
      >
        {/* Сама планета */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
        </mesh>
      </Trail>
    </group>
  );
}
