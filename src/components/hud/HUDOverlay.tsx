'use client';

import { motion } from 'framer-motion';

export default function HUDOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-40 p-6 flex flex-col justify-between font-mono text-xs md:text-sm text-os-cyan/80 uppercase">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div>KAUSHAL.OS v2.0</div>
          <div className="text-os-cyan/50 mt-1">SYS_STATUS: NOMINAL</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="flex flex-col items-end gap-2"
        >
          <div className="pointer-events-auto flex gap-4">
            <button className="hover:text-white transition-colors">[AUDIO: ON]</button>
            <button className="hover:text-white transition-colors">[MODE: PLAYABLE]</button>
          </div>
          <div className="text-os-cyan/50 text-right">
            PWR: 100%<br/>
            CPU: 42%
          </div>
        </motion.div>
      </div>

      {/* Crosshair (Center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0V15M20 40V25M0 20H15M40 20H25" stroke="currentColor" strokeWidth="1"/>
          <circle cx="20" cy="20" r="2" fill="currentColor"/>
        </svg>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="flex gap-2 items-center">
            <div className="flex flex-col gap-1 text-[10px] bg-os-cyan/10 p-2 rounded">
              <div className="flex gap-1 justify-center"><span className="border border-os-cyan/30 px-1">W</span></div>
              <div className="flex gap-1"><span className="border border-os-cyan/30 px-1">A</span><span className="border border-os-cyan/30 px-1">S</span><span className="border border-os-cyan/30 px-1">D</span></div>
            </div>
            <div className="ml-2">THRUST / MANEUVER</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-right"
        >
          <div className="text-os-magenta font-bold mb-1">WARNING: UNKNOWN ENTITY DETECTED</div>
          <div>Virocity.ai / Core systems online</div>
        </motion.div>
      </div>
    </div>
  );
}
