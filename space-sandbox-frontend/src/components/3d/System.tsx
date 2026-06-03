import { Grid } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../../store/useSystemStore';
import AsteroidBelt from './AsteroidBelt';
import Planet from './Planet';
import Space from './Space';

export default function System() {
  const showGrid = useSystemStore((state) => state.showGrid);
  const systems = useSystemStore((state) => state.systems);
  const activeSystemId = useSystemStore((state) => state.activeSystemId);

  const activeSystem = systems.find((sys) => sys.id === activeSystemId);
  const planets = activeSystem?.planets || [];
  const belts = activeSystem?.belts || [];
  const star = activeSystem?.star || { size: 3, color: '#FDB813' };

  const hdrStarColor = useMemo(() => {
    return new THREE.Color(star.color).multiplyScalar(10);
  }, [star.color]);

  return (
    <>
      <Space />

      <ambientLight intensity={0.2} color="#e6f2ff" />
      <hemisphereLight args={['#4466ff', '#111111', 0.2]} />

      <pointLight
        position={[0, 0, 0]}
        intensity={300}
        color={star.color}
        distance={5000}
        decay={1}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.001}
      />

      {showGrid && (
        <Grid
          position={[0, -0.2, 0]}
          infiniteGrid
          fadeDistance={500}
          cellSize={2}
          sectionSize={10}
          cellColor="#1a2035"
          sectionColor="#2a3a55"
          cellThickness={0.25}
          sectionThickness={0.5}
        />
      )}

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[star.size, 32, 32]} />
        <meshBasicMaterial color={hdrStarColor} toneMapped={false} />
      </mesh>

      {planets.map((planet) => (
        <Planet
          key={planet.id}
          id={planet.id}
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

      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} mipmapBlur intensity={0.8} />
      </EffectComposer>
    </>
  );
}
