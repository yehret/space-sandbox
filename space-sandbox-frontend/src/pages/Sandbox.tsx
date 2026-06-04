import { Loader, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as THREE from 'three';
import System from '../components/3d/System';
import { CameraFollower } from '../components/CameraFollower';
import { ObjectInteraction } from '../components/ObjectInteraction';
import UI from '../components/UI';
import { useSystemStore } from '../store/useSystemStore';
import { useUIStore } from '../store/useUIStore';

function CameraResetter({ controlsRef }: { controlsRef: any }) {
  const cameraResetTrigger = useUIStore((state) => state.cameraResetTrigger);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 200, 1);

      controlsRef.current.target.set(0, 0, 0);

      controlsRef.current.update();
    }
  }, [cameraResetTrigger]);

  return null;
}

export default function Sandbox() {
  const controlsRef = useRef<any>(null);
  const { id } = useParams<{ id: string }>();
  const fetchSystemById = useSystemStore((state) => state.fetchSystemById);
  const isLoading = useSystemStore((state) => state.isLoading);
  const activeSystemId = useSystemStore((state) => state.activeSystemId);

  useEffect(() => {
    if (id) {
      fetchSystemById(id);
    }
  }, [id, fetchSystemById]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        useUIStore.getState().setFollowTarget(null);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, []);

  if (isLoading || !activeSystemId) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black text-white">
        <div className="text-xl animate-pulse">Loading Universe...</div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          camera={{ position: [0, 200, 1], fov: 45, far: 5000 }}
          dpr={[1, 1.5]}
          gl={{
            logarithmicDepthBuffer: true,
            antialias: false,
            toneMapping: THREE.ReinhardToneMapping,
            toneMappingExposure: 0.8,
          }}>
          <Suspense fallback={null}>
            <System />
            <ObjectInteraction />
            <OrbitControls
              ref={controlsRef}
              enableZoom={true}
              enablePan={true}
              maxDistance={500}
              minDistance={15}
            />
            <CameraResetter controlsRef={controlsRef} />
            <CameraFollower controlsRef={controlsRef} />

            {/* <Stats showPanel={0} className="stats" /> */}
          </Suspense>
        </Canvas>
      </div>

      <UI />
      <Loader
        containerStyles={{ background: '#030308' }}
        innerStyles={{ background: 'rgba(255, 255, 255, 0.1)', width: '300px' }}
        barStyles={{ background: '#3b82f6', height: '4px' }}
        dataInterpolation={(p) => `Loading Universe ${p.toFixed(0)}%`}
        dataStyles={{
          color: '#ffffff',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
}
