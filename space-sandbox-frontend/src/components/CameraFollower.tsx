import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../store/useSystemStore';

export function CameraFollower({ controlsRef }: { controlsRef: any }) {
  const { followTargetId, followTargetTrigger } = useSystemStore();
  const lastTargetPos = useRef(new THREE.Vector3());
  const lastFollowTargetTrigger = useRef(0);

  // Function to reset camera to centered position relative to planet
  const resetCameraToDefault = (targetPos: THREE.Vector3) => {
    if (!controlsRef.current) return;

    // Set default offset (distance from planet)
    const defaultOffset = new THREE.Vector3(10, 5, 10);
    const newCameraPos = new THREE.Vector3().addVectors(targetPos, defaultOffset);

    // Reset camera position and target
    controlsRef.current.object.position.copy(newCameraPos);
    controlsRef.current.target.copy(targetPos);
    controlsRef.current.update();
  };

  useFrame((state) => {
    if (!followTargetId || !controlsRef.current) return;

    const planetMesh = state.scene.getObjectByName(followTargetId);
    if (!planetMesh) return;

    const currentTargetPos = new THREE.Vector3();
    planetMesh.getWorldPosition(currentTargetPos);

    // If target changed or user refocused, reset camera to centered view on planet
    if (lastFollowTargetTrigger.current !== followTargetTrigger) {
      resetCameraToDefault(currentTargetPos);
      lastFollowTargetTrigger.current = followTargetTrigger;
      lastTargetPos.current.copy(currentTargetPos);
      return;
    }

    // Smooth following - apply delta to keep relative distance
    const delta = new THREE.Vector3().subVectors(currentTargetPos, lastTargetPos.current);

    state.camera.position.add(delta);
    controlsRef.current.target.add(delta);

    lastTargetPos.current.copy(currentTargetPos);
    controlsRef.current.update();
  });

  return null;
}

// export function CameraFollower({ controlsRef }: { controlsRef: any }) {
//   const { followTargetId } = useSystemStore();
//   const lastTargetPos = useRef(new THREE.Vector3());

//   useFrame((state) => {
//     if (!followTargetId || !controlsRef.current) return;

//     const planetMesh = state.scene.getObjectByName(followTargetId);
//     if (!planetMesh) return;

//     const currentTargetPos = new THREE.Vector3();
//     planetMesh.getWorldPosition(currentTargetPos);

//     const delta = new THREE.Vector3().subVectors(currentTargetPos, lastTargetPos.current);

//     state.camera.position.add(delta);

//     controlsRef.current.target.add(delta);

//     lastTargetPos.current.copy(currentTargetPos);

//     controlsRef.current.update();
//   });

//   return null;
// }
