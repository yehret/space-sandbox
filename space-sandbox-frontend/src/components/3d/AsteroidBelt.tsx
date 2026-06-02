import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../../store/useSystemStore';

type AsteroidBeltProps = {
  distance: number; // Відстань від зірки (центр кільця)
  width: number; // Ширина самого поясу
  count: number; // Кількість астероїдів
  speed: number; // Швидкість обертання поясу
  color: string;
  orbitalInclination: number; // Нахил поясу
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
  const { isPaused, timeScale } = useSystemStore();

  // Генеруємо координати при зміні параметрів (кількості, ширини чи дистанції)
  useEffect(() => {
    if (!meshRef.current) return;

    // Пустушка для прорахунку матриць трансформації (щоб не створювати тисячі реальних об'єктів)
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      // Випадковий кут по всьому колу (360 градусів)
      const angle = Math.random() * Math.PI * 2;

      // Випадковий радіус у межах товщини кільця
      const radius = distance + (Math.random() - 0.5) * width;

      // Випадкова висота (пояс зазвичай плаский, тому розкид по Y робимо невеликим)
      const y = (Math.random() - 0.5) * (width * 0.2);

      // Виставляємо позицію, поворот і розмір для конкретного камінця
      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      // Розмір: від малесенького пилу (0.02) до більших каменів (0.15)
      const scale = Math.random() * 0.13 + 0.02;
      dummy.scale.set(scale, scale, scale);

      // Оновлюємо матрицю пустушки і записуємо її в наш InstancedMesh під індексом i
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    // Даємо сигнал відеокарті, що дані змінилися і їх треба перемалювати
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, distance, width]);

  // Плавне обертання всього поясу
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (!isPaused) {
      angleRef.current += delta * timeScale * speed;
    }
    // Замість розрахунку орбіти, ми просто крутимо всю групу по осі Y
    meshRef.current.rotation.y = angleRef.current;
  });

  return (
    <group rotation={[0, 0, orbitalInclination]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        {/* Dodecahedron - ідеальна низькополігональна форма для космічних каменів */}
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.2} />
      </instancedMesh>
    </group>
  );
}
