export default function Keyboard() {
  return (
    <group position={[0, 0.78, 0.2]}>
      {/* Keyboard body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.02, 0.22]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      {/* Key rows */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 12 }).map((_, col) => (
          <mesh
            key={`key-${row}-${col}`}
            position={[
              -0.24 + col * 0.042,
              0.012,
              -0.07 + row * 0.048,
            ]}
          >
            <boxGeometry args={[0.035, 0.008, 0.04]} />
            <meshStandardMaterial
              color="#222222"
              roughness={0.6}
              metalness={0.3}
            />
          </mesh>
        ))
      )}
    </group>
  );
}
