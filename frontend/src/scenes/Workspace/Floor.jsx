export default function Floor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
    >
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial
        color="#080808"
        roughness={0.85}
        metalness={0.1}
      />
    </mesh>
  );
}
