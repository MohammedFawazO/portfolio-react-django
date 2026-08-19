export default function Mouse() {
  return (
    <group position={[0.55, 0.78, 0.25]}>
      {/* Mouse body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.025, 0.06, 8, 16]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Scroll wheel */}
      <mesh position={[0, 0.02, -0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.015, 16]} />
        <meshStandardMaterial
          color="#333333"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Mouse pad */}
      <mesh position={[0, -0.002, 0.02]}>
        <boxGeometry args={[0.2, 0.003, 0.25]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}
