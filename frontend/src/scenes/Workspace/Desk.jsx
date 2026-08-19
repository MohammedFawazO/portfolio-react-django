export default function Desk() {
  return (
    <group>
      {/* Desktop surface */}
      <mesh position={[0, 0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.05, 1.2]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Front edge detail */}
      <mesh position={[0, 0.725, 0.6]}>
        <boxGeometry args={[2.4, 0.02, 0.02]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-1.05, 0.375, 0]} castShadow>
        <boxGeometry args={[0.06, 0.75, 0.06]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Right leg */}
      <mesh position={[1.05, 0.375, 0]} castShadow>
        <boxGeometry args={[0.06, 0.75, 0.06]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Back support beam */}
      <mesh position={[0, 0.5, -0.55]}>
        <boxGeometry args={[2.1, 0.04, 0.04]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
