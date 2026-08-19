import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { easing } from "maath";

export default function CameraRig() {
  const group = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    easing.damp3(
      state.camera.position,
      [
        Math.sin(t * 0.15) * 0.3 + 2.5,
        1.5 + Math.sin(t * 0.1) * 0.1,
        4 + Math.cos(t * 0.15) * 0.2,
      ],
      0.5,
      delta
    );

    state.camera.lookAt(0, 0.3, 0);
  });

  return <group ref={group} />;
}
