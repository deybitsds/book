import { Environment, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Book } from "./Book";
import { zoomPulseAtom } from "./UI";

const bookTarget = new THREE.Vector3(0, 0.12, 0);
/** Por cada clic: acercar ~6%, alejar ~6% (inverso). */
const DOLLY_IN_FACTOR = 0.94;
const DOLLY_OUT_FACTOR = 1 / DOLLY_IN_FACTOR;
const MIN_CAMERA_DISTANCE = 0.72;
const MAX_CAMERA_DISTANCE = 200;

function CameraZoom() {
  const pulse = useAtomValue(zoomPulseAtom);
  const { camera } = useThree();
  const prevN = useRef(0);

  useEffect(() => {
    if (pulse.n === prevN.current) return;
    prevN.current = pulse.n;

    const offset = camera.position.clone().sub(bookTarget);
    const dist = offset.length();
    if (dist < 1e-5) return;

    const factor = pulse.dir > 0 ? DOLLY_IN_FACTOR : DOLLY_OUT_FACTOR;
    const newDist = THREE.MathUtils.clamp(
      dist * factor,
      MIN_CAMERA_DISTANCE,
      MAX_CAMERA_DISTANCE
    );
    offset.normalize().multiplyScalar(newDist);
    camera.position.copy(bookTarget).add(offset);
  }, [pulse.n, pulse.dir, camera]);

  return null;
}

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
      <CameraZoom />
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
