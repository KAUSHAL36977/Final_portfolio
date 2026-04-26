'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, Icosahedron, Cylinder, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

export default function SpaceshipExploded() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
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
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group position={[0, 0, 0]}>
          <Icosahedron args={[2, 1]}>
            <meshStandardMaterial {...materialProps} wireframe />
          </Icosahedron>
          <Icosahedron args={[1.8, 2]}>
            <meshStandardMaterial {...emissiveProps} emissive="#FF2D87" emissiveIntensity={3} />
          </Icosahedron>
          <Html position={[2.5, 0, 0]} center className="text-os-magenta font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-magenta/30 backdrop-blur">
            [REACTOR CORE] <br/> <span className="text-[10px]">LIVE TELEMETRY</span>
          </Html>
        </group>
      </Float>

      {/* Comms Array (Hero) */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={2}>
        <group position={[0, 6, -2]}>
          <Cylinder args={[0.1, 0.1, 4]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial {...materialProps} />
          </Cylinder>
          <Torus args={[1, 0.05, 16, 32]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, -2]}>
            <meshStandardMaterial {...emissiveProps} />
          </Torus>
          <Html position={[1.5, 0, -2]} center className="text-os-cyan font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-cyan/30">
            [COMMS ARRAY] <br/> <span className="text-[10px]">IDENTITY_SIGNAL</span>
          </Html>
        </group>
      </Float>

      {/* Avionics (About) */}
      <Float speed={3} rotationIntensity={1} floatIntensity={1.5}>
        <group position={[-5, 2, 3]}>
          <Box args={[1.5, 1.5, 1.5]}>
            <meshStandardMaterial {...materialProps} />
          </Box>
          <Box args={[1.6, 1.6, 1.6]}>
            <meshBasicMaterial color="#00E5FF" wireframe />
          </Box>
          <Html position={[-1, 1.5, 0]} center className="text-os-cyan font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-cyan/30">
            [AVIONICS] <br/> <span className="text-[10px]">NEURAL_MESH</span>
          </Html>
        </group>
      </Float>

      {/* Cargo Bay (Projects) */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
        <group position={[6, -2, 2]}>
          <Box args={[3, 2, 4]}>
            <meshStandardMaterial {...materialProps} color="#1A1A22" />
          </Box>
          <Html position={[2, 1.5, 0]} center className="text-os-cyan font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-cyan/30">
            [CARGO BAY] <br/> <span className="text-[10px]">CASE_STUDIES</span>
          </Html>
          {/* Floating Crates */}
          <Box args={[0.8, 0.8, 0.8]} position={[-1, 2, 0]} rotation={[0.5, 0.5, 0]}>
            <meshStandardMaterial {...materialProps} emissive="#FFB020" emissiveIntensity={0.2} />
          </Box>
          <Box args={[0.6, 0.6, 0.6]} position={[1, 1.5, 1]} rotation={[-0.2, 0.8, 0.1]}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        </group>
      </Float>

      {/* Propulsion (Skills) */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <group position={[0, -4, -6]}>
          {[[-2,0], [-1,0], [0,0], [1,0], [2,0]].map((pos, i) => (
            <group key={i} position={[pos[0] * 1.5, 0, 0]}>
              <Cylinder args={[0.8, 0.3, 2]} rotation={[Math.PI/2, 0, 0]}>
                <meshStandardMaterial {...materialProps} />
              </Cylinder>
              <pointLight position={[0,0,1]} color="#00E5FF" intensity={2} distance={5} />
              <mesh position={[0,0,1.2]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} />
              </mesh>
            </group>
          ))}
          <Html position={[0, -2, 0]} center className="text-os-cyan font-mono text-xs whitespace-nowrap bg-os-black/80 px-2 py-1 border border-os-cyan/30">
            [PROPULSION] <br/> <span className="text-[10px]">STACK_THRUSTERS</span>
          </Html>
        </group>
      </Float>

      {/* Connecting Lines (Simulated with thin cylinders for now) */}
      <Cylinder args={[0.02, 0.02, 8]} position={[0, 3, -1]} rotation={[Math.PI/2, 0, 0]}>
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 6]} position={[-2.5, 1, 1.5]} rotation={[0, 0, Math.PI/2]}>
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 6]} position={[3, -1, 1]} rotation={[0, 0, -Math.PI/4]}>
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} />
      </Cylinder>

    </group>
  );
}
