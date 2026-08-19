export default function MonitorLeft() {
  return (
    <group position={[-0.85, 1.15, -0.3]}>
      {/* Screen bezel */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.7, 0.04]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Screen panel */}
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[1.0, 0.6]} />
        <meshStandardMaterial
          color="#000000"
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[0.06, 0.2, 0.06]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Stand base */}
      <mesh position={[0, -0.62, 0.05]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.03, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
