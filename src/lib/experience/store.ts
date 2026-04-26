import { create } from 'zustand';

type AppMode = 'playable' | 'cinematic';

interface ExperienceState {
  mode: AppMode;
  audioEnabled: boolean;
  setMode: (mode: AppMode) => void;
  toggleAudio: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  mode: 'playable',
  audioEnabled: false,
  setMode: (mode) => set({ mode }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
}));
