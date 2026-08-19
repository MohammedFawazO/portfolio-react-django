import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import Lights from "./Lights";
import Desk from "./Desk";
import MonitorLeft from "./MonitorLeft";
import MonitorCenter from "./MonitorCenter";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import Wall from "./Wall";
import Floor from "./Floor";

export default function WorkspaceScene({ className }) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.5, 2, 4], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#0a0a0a"]} />

        <Lights />

        <PerspectiveCamera makeDefault position={[2.5, 2, 4]} fov={40} />

        <group position={[0, -1, 0]}>
          <Desk />
          <MonitorLeft />
          <MonitorCenter />
          <Keyboard />
          <Mouse />
        </group>

        <Wall />
        <Floor />
      </Canvas>
    </div>
  );
}
