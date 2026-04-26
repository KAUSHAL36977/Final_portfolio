'use client';

import { useEffect } from 'react';
import { useExperienceStore } from '@/lib/experience/store';
import { audioManager } from '@/lib/audio/manager';

export default function AudioController() {
  const audioEnabled = useExperienceStore(state => state.audioEnabled);

  useEffect(() => {
    // We register placeholder sounds here
    // In a real scenario, these would point to /audio/engine.webm, /audio/bgm.webm etc.
    audioManager.register('engine', 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA', { loop: true, volume: 0.2 });
    audioManager.register('ui_click', 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA', { volume: 0.5 });
  }, []);

  useEffect(() => {
    audioManager.setMute(audioEnabled); // true = audio is ON
  }, [audioEnabled]);

  return null; // This component just manages logic, no UI
}
