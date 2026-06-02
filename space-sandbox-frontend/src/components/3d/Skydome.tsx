import { Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function Skydome() {
  const starsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  // Примусово рухаємо зірки за позицією камери
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
        radius={100} // Тепер радіус не має значення, бо вони рухаються за камерою
        depth={50}
        count={20000}
        factor={4}
        saturation={0}
        fade={true}
        speed={0}
      />
    </>
  );
}
