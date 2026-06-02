import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import System from '../components/3d/System';
import UI from '../components/UI';

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 80, 1], fov: 45, far: 5000 }}
          dpr={[1, 2]}
          gl={{
            logarithmicDepthBuffer: true,
            antialias: true,
            toneMapping: THREE.ReinhardToneMapping,
            toneMappingExposure: 0.8,
          }}>
          <System />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            // autoRotate
            // autoRotateSpeed={0.1}
            maxDistance={500}
            minDistance={15}
          />
        </Canvas>
      </div>

      <UI />
    </div>
  );
}
