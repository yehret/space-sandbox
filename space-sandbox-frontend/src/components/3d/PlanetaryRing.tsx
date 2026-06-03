import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { PlanetaryRingData } from '../../types';

export default function PlanetaryRing({ size, ring }: { size: number; ring: PlanetaryRingData }) {
  const [colorMap, setColorMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!ring.textureUrl) {
      setColorMap(null);
      return;
    }

    let isActive = true;
    const loader = new THREE.TextureLoader();

    loader.load(
      ring.textureUrl,
      (texture) => {
        if (!isActive) return;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        setColorMap(texture);
      },
      undefined,
      (error) => {
        console.error(`❌ Помилка завантаження текстури кільця: ${ring.textureUrl}`, error);
      },
    );

    return () => {
      isActive = false;
    };
  }, [ring.textureUrl]);

  // Заздалегідь вираховуємо фізичні радіуси
  const inner = size * ring.innerRadius;
  const outer = size * ring.outerRadius;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
      <ringGeometry
        args={[inner, outer, 64]}
        onUpdate={(geometry) => {
          // Ця функція викликається при створенні геометрії.
          // Вона бере стандартні координати і "закручує" текстуру по колу.
          const pos = geometry.attributes.position;
          const uv = geometry.attributes.uv;

          for (let i = 0; i < pos.count; i++) {
            // Беремо X та Y кожної точки кільця
            const x = pos.getX(i);
            const y = pos.getY(i);

            // Визначаємо відстань цієї точки від центру
            const radius = Math.sqrt(x * x + y * y);

            // Перетворюємо цю відстань у відсотки від 0 (внутрішній край) до 1 (зовнішній)
            const u = (radius - inner) / (outer - inner);

            // Застосовуємо нові координати:
            // u - розтягує текстуру зліва направо відповідно до радіусу
            // v - 0.5, беремо середину нашої текстури-смужки
            uv.setXY(i, u, 0.5);
          }

          uv.needsUpdate = true;
        }}
      />
      <meshStandardMaterial
        key={colorMap ? 'textured' : 'solid'}
        color={colorMap ? '#ffffff' : ring.color}
        map={colorMap}
        transparent={true}
        opacity={ring.opacity}
        side={THREE.DoubleSide}
        alphaTest={0.01} // Відсікає повністю прозорі пікселі, щоб тіні падали правильно
      />
    </mesh>
  );
}
