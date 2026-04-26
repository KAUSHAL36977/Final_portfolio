'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { Physics } from '@react-three/rapier';

import SpaceshipExploded from './SpaceshipExploded';
import NebulaBackground from './NebulaBackground';

export default function MainExperience() {
  return (
    <Canvas
      camera={{ position: [0, 5, 20], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={['#030305']} />
      <fog attach="fog" args={['#030305', 10, 50]} />

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

          {/* Floor grid */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]} receiveShadow>
            <planeGeometry args={[100, 100, 50, 50]} />
            <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.05} />
          </mesh>
        </Physics>

        <OrbitControls
          enablePan={false}
          minDistance={10}
          maxDistance={40}
          maxPolarAngle={Math.PI / 1.5}
        />

        {/* Postprocessing */}
        <EffectComposer >
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
