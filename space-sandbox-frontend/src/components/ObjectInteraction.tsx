import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSystemStore } from '../store/useSystemStore';

export function ObjectInteraction() {
  const setFollowTarget = useSystemStore((state) => state.setFollowTarget);
  const setHoveredObject = useSystemStore((state) => state.setHoveredObject);
  const hoveredObjectId = useSystemStore((state) => state.hoveredObjectId);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useFrame((state) => {
    // Find all planet meshes in the scene (they have names like planet IDs)
    const planetMeshes: THREE.Mesh[] = [];
    state.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.name && obj.name.startsWith('p-')) {
        planetMeshes.push(obj);
      }
    });

    if (planetMeshes.length === 0) {
      setHoveredObject(null);
      return;
    }

    // Perform raycasting
    raycasterRef.current.setFromCamera(mouseRef.current, state.camera);
    const intersects = raycasterRef.current.intersectObjects(planetMeshes, false);

    if (intersects.length > 0) {
      const closestIntersection = intersects[0];
      const mesh = closestIntersection.object as THREE.Mesh;
      setHoveredObject(mesh.name);
    } else {
      setHoveredObject(null);
    }
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const canvas = (event.target as any).closest('canvas');
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = () => {
      if (hoveredObjectId) {
        setFollowTarget(hoveredObjectId);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [hoveredObjectId, setFollowTarget]);

  return <>{hoveredObjectId && <HoverGlowAtPosition planetId={hoveredObjectId} />}</>;
}

function HoverGlowAtPosition({ planetId }: { planetId: string }) {
  const glowRef = useRef<THREE.Group>(null);
  const positionRef = useRef(new THREE.Vector3());

  useFrame((state) => {
    const mesh = state.scene.getObjectByName(planetId);
    if (mesh) {
      mesh.getWorldPosition(positionRef.current);
      if (glowRef.current) {
        glowRef.current.position.copy(positionRef.current);
      }
    }
  });

  return (
    <group ref={glowRef}>
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.15} />
      </mesh>
      <Html position={[0, 2.5, 0]} center distanceFactor={1}>
        <div
          className="text-cyan-400 text-2xl font-bold pointer-events-none whitespace-nowrap select-none"
          style={{
            textShadow: '0 0 10px rgba(34, 211, 238, 0.8)',
            animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}>
          ◯
        </div>
      </Html>
    </group>
  );
}
