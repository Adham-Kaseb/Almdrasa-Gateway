// Web Audio API synthetic subtle haptic sounds

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playClick(pitch: number = 440, duration: number = 0.04): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy catch
    }
  }

  public playPop(): void {
    this.playClick(680, 0.035);
  }

  public playDock(): void {
    this.playClick(520, 0.03);
  }

  public playWindow(): void {
    this.playClick(320, 0.05);
  }

  /**
   * Organic tactile keystroke click for writing / notes
   * Simulates a crisp mechanical keyboard switch with subtle acoustic variations
   */
  public playTypingKey(key?: string): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Pitch variation based on key type for realism
      let basePitch = 480;
      let duration = 0.024;
      let gainLevel = 0.035;

      if (key === 'Enter') {
        basePitch = 360;
        duration = 0.038;
        gainLevel = 0.045;
      } else if (key === ' ') {
        basePitch = 310;
        duration = 0.032;
        gainLevel = 0.04;
      } else if (key === 'Backspace' || key === 'Delete') {
        basePitch = 420;
        duration = 0.028;
      } else {
        // Natural micro-jitter (±25Hz) so fast typing doesn't sound robotic
        const jitter = (Math.random() - 0.5) * 50;
        basePitch += jitter;
      }

      // Primary crisp transient impulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(basePitch * 0.35, now + duration);

      gain.gain.setValueAtTime(gainLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Catch any audio context issues
    }
  }

  /**
   * Luxury harmonic chime (C Major 9th chord) for the application entrance
   */
  public playStartupChime(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Rich harmonic notes: C3 (130.81Hz), G3 (196Hz), D4 (293.66Hz), E4 (329.63Hz), G4 (392Hz), B4 (493.88Hz)
      const frequencies = [130.81, 196.00, 293.66, 329.63, 392.00, 493.88];
      const duration = 2.6;

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const startTime = now + idx * 0.035;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.045 / Math.sqrt(idx + 1), startTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Audio autoplay policy catch
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const soundFx = new SoundEngine();
