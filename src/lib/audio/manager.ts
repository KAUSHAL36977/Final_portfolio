import { Howl, Howler } from 'howler';

class AudioManager {
  private static instance: AudioManager;
  private sounds: Record<string, Howl> = {};

  private constructor() {
    // We will load actual assets in the next phase,
    // for now we set up the structure to handle the state.
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public register(key: string, url: string, options: Record<string, unknown> = {}) {
    if (!this.sounds[key]) {
      this.sounds[key] = new Howl({ src: [url], ...options });
    }
  }

  public play(key: string) {
    if (this.sounds[key]) {
      this.sounds[key].play();
    }
  }

  public setMute(mute: boolean) {
    Howler.mute(!mute); // If mute argument is false, we want audio off (Howler.mute(true))
  }
}

export const audioManager = AudioManager.getInstance();
