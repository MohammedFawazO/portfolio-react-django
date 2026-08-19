export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.15} />

      <spotLight
        position={[3, 5, 2]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#ffd4a0"
      />

      <pointLight
        position={[-2, 3, -1]}
        intensity={0.4}
        color="#a0c4ff"
      />

      <pointLight position={[0, 0.5, 0]} intensity={0.3} color="#ffffff" />
    </>
  );
}
