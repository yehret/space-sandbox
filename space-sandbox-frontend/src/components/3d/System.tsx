import { Grid } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../../store/useSystemStore';
import AsteroidBelt from './AsteroidBelt';
import Planet from './Planet';
import Skydome from './Skydome';

export default function System() {
  // Отримуємо список усіх космічних систем та ID активної наразі системи
  const systems = useSystemStore((state) => state.systems);
  const activeSystemId = useSystemStore((state) => state.activeSystemId);

  // Знаходимо поточну активну систему та її планети
  const activeSystem = systems.find((sys) => sys.id === activeSystemId);
  const planets = activeSystem?.planets || [];
  const belts = activeSystem?.belts || [];

  // Якщо систему не знайдено, використовуємо безпечні дефолтні параметри зірки
  const star = activeSystem?.star || { size: 3, color: '#FDB813' };

  // HDR-колір для Bloom: помножуємо інтенсивність базового кольору вдвічі,
  // щоб змусити світитися лише саму зірку, не пересвічуючи планети.
  const hdrStarColor = useMemo(() => {
    // Зміни multiplyScalar(2) на multiplyScalar(5) або навіть 8!
    return new THREE.Color(star.color).multiplyScalar(5);
  }, [star.color]);

  return (
    <>
      {/* 1. Космічне тло та нескінченний простір зірок */}
      <Skydome />

      {/* 2. Загальне розсіяне світло (м'яко підсвічує тіньову сторону планет) */}
      <ambientLight intensity={0.5} />

      {/* 3. Напівсферичне світло (додає глибини космосу: синій відтінок зверху, темний знизу) */}
      <hemisphereLight args={['#4466ff', '#111111', 0.5]} />

      {/* 4. Головне точкове джерело світла, яке випромінює сама зірка */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2000}
        color={star.color}
        distance={200}
        decay={2}
      />

      {/* 5. Координатна радарна сітка для відчуття масштабу і простору */}
      <Grid
        position={[0, -0.2, 0]} // Зміщення вниз на -0.2 запобігає миготливому перетину з орбітами
        infiniteGrid // Нескінченне розширення сітки при русі камери
        fadeDistance={150} // Плавне розчинення ліній сітки вдалині
        cellSize={2}
        sectionSize={10}
        cellColor="#1a2035"
        sectionColor="#2a3a55"
        cellThickness={0.4}
        sectionThickness={0.8}
      />

      {/* 6. 3D-модель центральної зірки (Сонця) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[star.size, 64, 64]} />
        {/* toneMapped={false} вимикає ліміти яскравості для цього матеріалу */}
        <meshBasicMaterial color={hdrStarColor} toneMapped={false} />
      </mesh>

      {/* 7. Динамічний рендеринг усіх планет, що належать до цієї космічної системи */}
      {planets.map((planet) => (
        <Planet
          key={planet.id}
          distance={planet.distance}
          speed={planet.speed}
          size={planet.size}
          color={planet.color}
          textureUrl={planet.textureUrl}
          rotationSpeed={planet.rotationSpeed}
          axialTilt={planet.axialTilt}
          orbitalInclination={planet.orbitalInclination}
          rings={planet.rings}
          moons={planet.moons}
        />
      ))}

      {belts.map((belt) => (
        <AsteroidBelt
          key={belt.id}
          distance={belt.distance}
          width={belt.width}
          count={belt.count}
          speed={belt.speed}
          color={belt.color}
          orbitalInclination={belt.orbitalInclination}
        />
      ))}

      {/* 8. Ефекти постпроцесингу: розмитий кінематографічний ореол (Bloom) навколо зірки */}
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1} />
      </EffectComposer>
    </>
  );
}
