import { Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function Skydome() {
  const starsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.position.copy(camera.position);
    }
  });

  return (
    <>
      <color attach="background" args={['#030308']} />

      <Stars
        ref={starsRef}
        radius={100}
        depth={150}
        count={15000}
        factor={4}
        saturation={0}
        fade={true}
        speed={0.2}
      />
    </>
  );
}
