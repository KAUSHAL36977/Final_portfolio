'use client';

import { useState } from 'react';
import BootSequence from '@/components/hud/BootSequence';
import MainExperience from '@/components/three/MainExperience';
import HUDOverlay from '@/components/hud/HUDOverlay';

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="w-full h-screen relative">
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      {booted && (
        <>
          <HUDOverlay />
          <div className="absolute inset-0 z-0">
             <MainExperience />
          </div>
        </>
      )}
    </main>
  );
}
