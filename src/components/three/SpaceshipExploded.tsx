'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, Icosahedron, Cylinder, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

export default function SpaceshipExploded() {
  const groupRef = useRef<THREE.Group>(null);

  // In cinematic mode, we might want to rotate the whole group, but for gameplay,
  // it's better if they are static stations the player can drive up to.
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle bobbing instead of full rotation so they are easier to approach
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  const materialProps = {
    color: '#111118',
    emissive: '#000000',
    metalness: 0.9,
    roughness: 0.2,
  };

  const emissiveProps = {
    color: '#00E5FF',
    emissive: '#00E5FF',
    emissiveIntensity: 2,
    toneMapped: false,
  };

  return (
    <group ref={groupRef}>

      {/* Central Core (Reactor / Now) */}
      <RigidBody type="fixed" colliders="hull" position={[0, 2, 0]}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <group>
            <Icosahedron args={[3, 1]}>
              <meshStandardMaterial {...materialProps} wireframe />
            </Icosahedron>
            <Icosahedron args={[2.5, 2]}>
              <meshStandardMaterial {...emissiveProps} emissive="#FF2D87" emissiveIntensity={3} />
            </Icosahedron>
            <Html position={[3.5, 2, 0]} center className="text-os-magenta font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-magenta/30 backdrop-blur pointer-events-none">
              [REACTOR CORE] <br/> <span className="text-[10px]">LIVE TELEMETRY</span>
            </Html>
            <pointLight color="#FF2D87" intensity={5} distance={15} />
          </group>
        </Float>
      </RigidBody>

      {/* Comms Array (Hero) */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 8, -25]}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={2}>
          <group>
            <Cylinder args={[0.2, 0.2, 8]} rotation={[Math.PI/2, 0, 0]}>
              <meshStandardMaterial {...materialProps} />
            </Cylinder>
            <Torus args={[2, 0.1, 16, 32]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, -4]}>
              <meshStandardMaterial {...emissiveProps} />
            </Torus>
            <Html position={[2.5, 0, -4]} center className="text-os-cyan font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-cyan/30 pointer-events-none">
              [COMMS ARRAY] <br/> <span className="text-[10px]">IDENTITY_SIGNAL</span>
            </Html>
          </group>
        </Float>
      </RigidBody>

      {/* Avionics (About) */}
      <RigidBody type="fixed" colliders="cuboid" position={[-20, 3, -10]}>
        <Float speed={3} rotationIntensity={1} floatIntensity={1.5}>
          <group>
            <Box args={[3, 3, 3]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
            <Box args={[3.2, 3.2, 3.2]}>
              <meshBasicMaterial color="#00E5FF" wireframe />
            </Box>
            <Html position={[0, 4, 0]} center className="text-os-cyan font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-cyan/30 pointer-events-none">
              [AVIONICS] <br/> <span className="text-[10px]">NEURAL_MESH</span>
            </Html>
          </group>
        </Float>
      </RigidBody>

      {/* Cargo Bay (Projects) */}
      <RigidBody type="fixed" colliders="cuboid" position={[20, 2, 10]}>
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
          <group>
            <Box args={[6, 4, 8]}>
              <meshStandardMaterial {...materialProps} color="#1A1A22" />
            </Box>
            <Html position={[0, 4, 0]} center className="text-os-cyan font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-cyan/30 pointer-events-none">
              [CARGO BAY] <br/> <span className="text-[10px]">CASE_STUDIES</span>
            </Html>
            {/* Floating Crates */}
            <Box args={[1.5, 1.5, 1.5]} position={[-2, 3, 2]} rotation={[0.5, 0.5, 0]}>
              <meshStandardMaterial {...materialProps} emissive="#FFB020" emissiveIntensity={0.2} />
            </Box>
            <Box args={[1.2, 1.2, 1.2]} position={[2, 2, -2]} rotation={[-0.2, 0.8, 0.1]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
          </group>
        </Float>
      </RigidBody>

      {/* Propulsion (Skills) */}
      <RigidBody type="fixed" colliders="hull" position={[0, 2, 25]}>
        <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
          <group>
            {[[-4,0], [-2,0], [0,0], [2,0], [4,0]].map((pos, i) => (
              <group key={i} position={[pos[0] * 1.5, 0, 0]}>
                <Cylinder args={[1.5, 0.5, 4]} rotation={[Math.PI/2, 0, 0]}>
                  <meshStandardMaterial {...materialProps} />
                </Cylinder>
                <pointLight position={[0,0,2]} color="#00E5FF" intensity={2} distance={8} />
                <mesh position={[0,0,2.5]}>
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} />
                </mesh>
              </group>
            ))}
            <Html position={[0, 4, 0]} center className="text-os-cyan font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-cyan/30 pointer-events-none">
              [PROPULSION] <br/> <span className="text-[10px]">STACK_THRUSTERS</span>
            </Html>
          </group>
        </Float>
      </RigidBody>

    </group>
  );
}
