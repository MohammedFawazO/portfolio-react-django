export default function Wall() {
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 1.5, -2]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial
          color="#0d0d0d"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Left wall */}
      <mesh position={[-3.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial
          color="#111111"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
    </>
  );
}
