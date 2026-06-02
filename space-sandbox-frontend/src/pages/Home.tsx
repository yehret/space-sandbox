import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import SolarSystem from '../components/3d/SolarSystem';

export default function Home() {
  return (
    // Головний контейнер на весь екран
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      {/* 1. Шар 3D (Фон) - абсолютно спозиційований на задньому плані */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 80, 1], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2, // Трохи піднімаємо загальну експозицію
          }}>
          <SolarSystem />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            // autoRotate
            // autoRotateSpeed={0.1}
            maxDistance={200}
            minDistance={15}
          />
        </Canvas>
      </div>

      {/* <UI /> */}
    </div>
  );
}
