import { Environment, Grid } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../../store/useSystemStore';
import AsteroidBelt from './AsteroidBelt';
import Planet from './Planet';
import Skydome from './Skydome';

export default function System() {
  const showGrid = useSystemStore((state) => state.showGrid);
  const systems = useSystemStore((state) => state.systems);
  const activeSystemId = useSystemStore((state) => state.activeSystemId);

  const activeSystem = systems.find((sys) => sys.id === activeSystemId);
  const planets = activeSystem?.planets || [];
  const belts = activeSystem?.belts || [];
  const star = activeSystem?.star || { size: 3, color: '#FDB813' };

  // Boost star color for bloom effect
  const hdrStarColor = useMemo(() => {
    return new THREE.Color(star.color).multiplyScalar(5);
  }, [star.color]);

  return (
    <>
      <Skydome />

      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#4466ff', '#111111', 0.5]} />

      <pointLight
        position={[0, 0, 0]}
        intensity={2000}
        color={star.color}
        distance={200}
        decay={2}
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
        <sphereGeometry args={[star.size, 64, 64]} />
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

      <Environment preset="city" />
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1} />
      </EffectComposer>
    </>
  );
}
