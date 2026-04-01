import { Environment, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Book } from "./Book";

/** Igual que el Float de drei para el eje Y; rotación más lenta para poder leer en reposo. */
const FLOAT_SPEED = 1;
const ROTATION_SPEED = 0.25;
const ROTATION_INTENSITY = 0.25;
const FLOAT_INTENSITY = 1;
const floatingRange = [-0.1, 0.1];

function BookIdleMotion({ children }) {
  const ref = useRef(null);
  const offset = useRef(Math.random() * 10000);
  useFrame((state) => {
    if (!ref.current) return;
    const t = offset.current + state.clock.getElapsedTime();
    ref.current.rotation.x =
      (Math.cos((t / 4) * ROTATION_SPEED) / 8) * ROTATION_INTENSITY;
    ref.current.rotation.y =
      (Math.sin((t / 4) * ROTATION_SPEED) / 8) * ROTATION_INTENSITY;
    ref.current.rotation.z =
      (Math.sin((t / 4) * ROTATION_SPEED) / 20) * ROTATION_INTENSITY;
    let yPosition = Math.sin((t / 4) * FLOAT_SPEED) / 10;
    yPosition = THREE.MathUtils.mapLinear(
      yPosition,
      -0.1,
      0.1,
      floatingRange[0],
      floatingRange[1]
    );
    ref.current.position.y = yPosition * FLOAT_INTENSITY;
    ref.current.updateMatrix();
  });
  return (
    <group rotation-x={-Math.PI / 4}>
      <group ref={ref} matrixAutoUpdate={false}>
        {children}
      </group>
    </group>
  );
}

export const Experience = () => {
  return (
    <>
      <BookIdleMotion>
        <Book />
      </BookIdleMotion>
      <OrbitControls />
      <Environment preset="studio"></Environment>
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
