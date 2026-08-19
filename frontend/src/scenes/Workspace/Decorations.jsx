import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function CoffeeMug() {
  const steamRef = useRef();

  useFrame((state) => {
    if (steamRef.current) {
      const t = state.clock.getElapsedTime();
      steamRef.current.position.y = 0.15 + Math.sin(t * 2) * 0.02;
      steamRef.current.material.opacity = 0.15 + Math.sin(t * 3) * 0.05;
    }
  });

  return (
    <group position={[-0.7, 0.75, 0.15]}>
      {/* Mug body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.08, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Handle */}
      <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.025, 0.005, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#222222" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Steam */}
      <mesh ref={steamRef} position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Plant() {
  return (
    <group position={[0.8, 0.75, -0.2]}>
      {/* Pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.045, 0.07, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.01, 12]} />
        <meshStandardMaterial color="#1a0f0a" roughness={1.0} />
      </mesh>

      {/* Leaves */}
      {[0, 1.2, 2.5, 3.8, 5.1].map((rot, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(rot) * 0.025,
            0.06 + i * 0.015,
            Math.sin(rot) * 0.025,
          ]}
          rotation={[0.3, rot, 0.5]}
        >
          <boxGeometry args={[0.01, 0.04, 0.025]} />
          <meshStandardMaterial
            color="#0a3a0a"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Notebook() {
  return (
    <group position={[-0.4, 0.78, -0.15]} rotation={[0, 0.3, 0]}>
      {/* Notebook cover */}
      <mesh castShadow>
        <boxGeometry args={[0.15, 0.005, 0.2]} />
        <meshStandardMaterial color="#111111" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Pages edge */}
      <mesh position={[0.075, 0.001, 0]}>
        <boxGeometry args={[0.002, 0.004, 0.19]} />
        <meshStandardMaterial color="#f5f0e8" roughness={1.0} />
      </mesh>
    </group>
  );
}

function PenHolder() {
  return (
    <group position={[0.65, 0.75, -0.35]}>
      {/* Holder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.1, 12]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* Pens */}
      {[0, 0.8, 1.6, 2.4].map((rot, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(rot) * 0.015,
            0.06 + i * 0.005,
            Math.sin(rot) * 0.015,
          ]}
          rotation={[0.1, 0, 0.05 * (i - 1.5)]}
        >
          <cylinderGeometry args={[0.003, 0.003, 0.12, 8]} />
          <meshStandardMaterial
            color={["#222222", "#1a1a2e", "#0a2a1a", "#2a1a1a"][i]}
            roughness={0.6}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Decorations() {
  return (
    <>
      <CoffeeMug />
      <Plant />
      <Notebook />
      <PenHolder />
    </>
  );
}
