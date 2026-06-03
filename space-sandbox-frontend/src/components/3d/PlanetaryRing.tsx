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

  const tiltAngle = ring.tiltAngle || 0;
  const tiltDirection = ring.tiltDirection || 0;

  return (
    <group rotation={[0, tiltDirection, 0]}>
      <group rotation={[tiltAngle, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
          <ringGeometry
            args={[inner, outer, 64]}
            onUpdate={(geometry) => {
              const pos = geometry.attributes.position;
              const uv = geometry.attributes.uv;

              for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const radius = Math.sqrt(x * x + y * y);
                const u = (radius - inner) / (outer - inner);
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
            alphaTest={0.01}
          />
        </mesh>
      </group>
    </group>
  );
}
