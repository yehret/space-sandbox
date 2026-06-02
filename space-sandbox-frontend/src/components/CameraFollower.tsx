import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../store/useSystemStore';

export function CameraFollower({ controlsRef }: { controlsRef: any }) {
  const { followTargetId } = useSystemStore();
  const lastTargetPos = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!followTargetId || !controlsRef.current) return;

    const planetMesh = state.scene.getObjectByName(followTargetId);
    if (!planetMesh) return;

    const currentTargetPos = new THREE.Vector3();
    planetMesh.getWorldPosition(currentTargetPos);

    // Розраховуємо дельту (наскільки планета зсунулась за цей кадр)
    const delta = new THREE.Vector3().subVectors(currentTargetPos, lastTargetPos.current);

    // Зміщуємо камеру на ту саму відстань, на яку зсунулась планета
    state.camera.position.add(delta);

    // Зміщуємо target контролера
    controlsRef.current.target.add(delta);

    // Зберігаємо поточну позицію для наступного кадру
    lastTargetPos.current.copy(currentTargetPos);

    controlsRef.current.update();
  });

  return null;
}
