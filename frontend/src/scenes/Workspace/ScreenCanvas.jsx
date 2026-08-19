import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import * as THREE from "three";

export default function ScreenCanvas({ position = [0, 0, 0] }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(512, 288) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
          vec2 uv = vUv;
          
          vec3 col = vec3(0.02, 0.02, 0.05);
          
          float grid = step(0.98, fract(uv.x * 20.0)) + step(0.98, fract(uv.y * 12.0));
          col += vec3(0.0, 0.15, 0.3) * grid * 0.3;
          
          float scanline = sin(uv.y * 200.0 + uTime * 2.0) * 0.02;
          col += scanline;
          
          float block = step(0.5, random(floor(uv * 40.0) + floor(uTime * 4.0)));
          col += vec3(0.0, 0.3, 0.5) * block * 0.05;
          
          float vignette = 1.0 - length(uv - 0.5) * 1.2;
          col *= vignette;
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1.3, 0.75]} />
      <shaderMaterial
        ref={materialRef}
        args={[shader]}
        toneMapped={false}
      />
    </mesh>
  );
}
