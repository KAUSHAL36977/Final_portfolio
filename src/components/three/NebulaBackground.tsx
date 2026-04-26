'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec2 vUv;

  // Simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Fractional Brownian Motion
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * noise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 p = vUv * 3.0 - vec2(1.5);

    // Animate coordinates
    vec2 q = vec2(fbm(p + time * 0.1), fbm(p - time * 0.15));
    vec2 r = vec2(fbm(p + q + time * 0.2), fbm(p + q - time * 0.1));

    float f = fbm(p + r);

    // Colors
    vec3 color1 = vec3(0.0, 0.9, 1.0); // Cyan
    vec3 color2 = vec3(1.0, 0.17, 0.53); // Magenta
    vec3 bg = vec3(0.02, 0.02, 0.05); // Dark Space

    vec3 color = mix(bg, color1, f * f);
    color = mix(color, color2, length(q) * 0.5);

    // Add some soft glow
    float glow = exp(-length(p) * 1.5) * 0.5;
    color += color2 * glow;

    // Fade edges
    float alpha = smoothstep(1.5, 0.0, length(p));

    gl_FragColor = vec4(color, alpha * 0.6);
  }
`;

export default function NebulaBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -40]} scale={[100, 100, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
