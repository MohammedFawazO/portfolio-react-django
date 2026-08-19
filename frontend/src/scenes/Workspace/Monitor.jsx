import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import ScreenCanvas from "./ScreenCanvas";

export default function Monitor() {
  const screenRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity =
        0.3 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group position={[0, 1.15, -0.3]}>
      {/* Screen bezel */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.85, 0.04]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Screen panel */}
      <mesh ref={screenRef} position={[0, 0, 0.021]}>
        <planeGeometry args={[1.3, 0.75]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#112244"
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Screen content overlay */}
      <ScreenCanvas position={[0, 0, 0.025]} />

      {/* Stand neck */}
      <mesh position={[0, -0.55, 0]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Stand base */}
      <mesh position={[0, -0.68, 0.05]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.03, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Status LED */}
      <mesh position={[0, -0.42, 0.021]}>
        <sphereGeometry args={[0.008, 16, 16]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}
