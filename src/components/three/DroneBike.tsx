'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceStore } from '@/lib/experience/store';

// We'll set up keyboard controls at the canvas level later,
// for now we'll just listen to keydown events directly for simplicity
const keys = { forward: false, backward: false, left: false, right: false, boost: false };

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.forward = true;
    if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.backward = true;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') keys.boost = true;
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.forward = false;
    if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.backward = false;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.boost = false;
  });
}

export default function DroneBike() {
  const bodyRef = useRef<RapierRigidBody>(null);
  const droneMeshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const mode = useExperienceStore(state => state.mode);

  // Constants
  const SPEED = 20;
  const TURN_SPEED = 2;
  const HOVER_HEIGHT = 1;
  const CAMERA_OFFSET = new THREE.Vector3(0, 3, 8);

  const targetVelocity = new THREE.Vector3();
  const currentVelocity = new THREE.Vector3();
  const lookDirection = new THREE.Vector3(0, 0, -1);
  const cameraPosition = new THREE.Vector3();
  const cameraLookAt = new THREE.Vector3();

  useFrame((state, delta) => {
    if (!bodyRef.current || mode !== 'playable') return;

    // 1. Get current state
    const translation = bodyRef.current.translation();
    const rotation = bodyRef.current.rotation();

    // Convert quaternion to Euler for easier Y-axis rotation logic
    const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));

    // 2. Handle Rotation (Steering)
    let turnInput = 0;
    if (keys.left) turnInput += 1;
    if (keys.right) turnInput -= 1;

    euler.y += turnInput * TURN_SPEED * delta;

    // Apply rotation
    const newQuat = new THREE.Quaternion().setFromEuler(euler);
    bodyRef.current.setNextKinematicRotation(newQuat);

    // Update look direction based on new rotation
    lookDirection.set(0, 0, -1).applyQuaternion(newQuat);

    // 3. Handle Movement (Thrust)
    let moveInput = 0;
    if (keys.forward) moveInput += 1;
    if (keys.backward) moveInput -= 0.5; // Back up slower

    const currentSpeed = keys.boost ? SPEED * 2 : SPEED;

    targetVelocity.copy(lookDirection).multiplyScalar(moveInput * currentSpeed);

    // Smooth velocity
    currentVelocity.lerp(targetVelocity, 0.1);

    // Apply movement (kinematic rigid body doesn't use forces, we set position directly)
    const newPos = new THREE.Vector3(
      translation.x + currentVelocity.x * delta,
      HOVER_HEIGHT + Math.sin(state.clock.elapsedTime * 2) * 0.1, // Hover effect
      translation.z + currentVelocity.z * delta
    );

    bodyRef.current.setNextKinematicTranslation(newPos);

    // Visual tilt based on turning
    if (droneMeshRef.current) {
        droneMeshRef.current.rotation.z = THREE.MathUtils.lerp(droneMeshRef.current.rotation.z, turnInput * 0.3, 0.1);
        droneMeshRef.current.rotation.x = THREE.MathUtils.lerp(droneMeshRef.current.rotation.x, moveInput * 0.1, 0.1);
    }

    // 4. Camera Follow Logic
    const idealCameraPos = newPos.clone().add(
      CAMERA_OFFSET.clone().applyQuaternion(newQuat)
    );

    cameraPosition.lerp(idealCameraPos, 0.1);
    camera.position.copy(cameraPosition);

    // Look slightly ahead of the drone
    const lookAhead = newPos.clone().add(lookDirection.clone().multiplyScalar(5));
    cameraLookAt.lerp(lookAhead, 0.1);
    camera.lookAt(cameraLookAt);
  });

  if (mode !== 'playable') return null;

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={[0, HOVER_HEIGHT, 15]}
      colliders="hull"
    >
      <group ref={droneMeshRef}>
        {/* Placeholder Drone Geometry */}
        <Box args={[1, 0.2, 2]}>
          <meshStandardMaterial color="#1A1A22" metalness={0.8} roughness={0.2} />
        </Box>
        <Box args={[0.2, 0.4, 0.5]} position={[0, 0.3, -0.5]}>
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.5} />
        </Box>
        {/* Engine Glow */}
        <mesh position={[0, 0, 1]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#FF2D87" transparent opacity={keys.forward ? 0.8 : 0.2} />
        </mesh>
        {keys.forward && (
          <pointLight position={[0, 0, 1.5]} color="#FF2D87" intensity={2} distance={5} />
        )}
      </group>
    </RigidBody>
  );
}
