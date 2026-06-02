import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import System from '../components/3d/System';
import UI from '../components/UI';
import { useSystemStore } from '../store/useSystemStore';

function CameraResetter({ controlsRef }: { controlsRef: any }) {
  const cameraResetTrigger = useSystemStore((state) => state.cameraResetTrigger);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 200, 1);

      controlsRef.current.target.set(0, 0, 0);

      controlsRef.current.update();
    }
  }, [cameraResetTrigger]);

  return null;
}

export default function Home() {
  const controlsRef = useRef<any>(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 200, 1], fov: 45, far: 5000 }}
          dpr={[1, 2]}
          gl={{
            logarithmicDepthBuffer: true,
            antialias: true,
            toneMapping: THREE.ReinhardToneMapping,
            toneMappingExposure: 0.8,
          }}>
          <System />
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={true}
            maxDistance={500}
            minDistance={15}
          />
          <CameraResetter controlsRef={controlsRef} />
        </Canvas>
      </div>

      <UI />
    </div>
  );
}
