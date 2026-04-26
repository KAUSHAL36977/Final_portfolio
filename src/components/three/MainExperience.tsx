'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { Physics, RigidBody } from '@react-three/rapier';

import SpaceshipExploded from './SpaceshipExploded';
import DroneBike from './DroneBike';
import NebulaBackground from './NebulaBackground';
import { useExperienceStore } from '@/lib/experience/store';

export default function MainExperience() {
  const mode = useExperienceStore(state => state.mode);

  return (
    <Canvas
      camera={{ position: [0, 5, 20], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={['#030305']} />
      <fog attach="fog" args={['#030305', 15, 60]} />

      <Suspense fallback={null}>
        {/* Environment */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#00E5FF" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#FF2D87" />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <NebulaBackground />

        {/* Physical World */}
        <Physics gravity={[0, -9.81, 0]}>
          <SpaceshipExploded />
          <DroneBike />

          {/* Floor grid */}
          <RigidBody type="fixed" friction={1}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
              <planeGeometry args={[200, 200, 100, 100]} />
              <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.05} />
            </mesh>
          </RigidBody>

          {/* Invisible boundaries to keep player in the arena */}
          <RigidBody type="fixed" position={[0, 5, -100]}>
             <mesh><boxGeometry args={[200, 10, 1]}/><meshBasicMaterial visible={false}/></mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[0, 5, 100]}>
             <mesh><boxGeometry args={[200, 10, 1]}/><meshBasicMaterial visible={false}/></mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[-100, 5, 0]}>
             <mesh><boxGeometry args={[1, 10, 200]}/><meshBasicMaterial visible={false}/></mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[100, 5, 0]}>
             <mesh><boxGeometry args={[1, 10, 200]}/><meshBasicMaterial visible={false}/></mesh>
          </RigidBody>

        </Physics>

        {mode === 'cinematic' && (
          <OrbitControls
            enablePan={false}
            minDistance={10}
            maxDistance={50}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate
            autoRotateSpeed={0.5}
          />
        )}

        {/* Postprocessing */}
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
