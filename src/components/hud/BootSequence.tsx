'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const sequence = [
      { text: "> kos boot --user kaushal --year 2026", delay: 800 },
      { text: "Mounting /avionics... OK", delay: 1400 },
      { text: "Spinning reactor... OK", delay: 1700 },
      { text: "Calibrating creator-economy thrusters... OK", delay: 2000 },
      { text: "Initiating dimensional punch-through...", delay: 2400 }
    ];

    const timeouts: NodeJS.Timeout[] = [];

    sequence.forEach(({ text, delay }) => {
      timeouts.push(
        setTimeout(() => {
          setLines((prev) => [...prev, text]);
          // Optional: Add sound effect trigger here later
        }, delay)
      );
    });

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 400);

    // Glitch effect before complete
    timeouts.push(
      setTimeout(() => {
        setGlitch(true);
      }, 3000)
    );

    // Complete
    timeouts.push(
      setTimeout(() => {
        onComplete();
      }, 3500)
    );

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(cursorInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: 'easeIn' }}
      className={`absolute inset-0 bg-os-black text-os-cyan font-mono p-8 md:p-16 z-50 flex flex-col justify-end ${glitch ? 'animate-pulse' : ''}`}
    >
      <div className="max-w-2xl">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-2 text-sm md:text-base lg:text-lg"
          >
            {line}
          </motion.div>
        ))}
        <div className="h-6">
          <span className={`inline-block w-3 h-5 bg-os-cyan ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
    </motion.div>
  );
}
