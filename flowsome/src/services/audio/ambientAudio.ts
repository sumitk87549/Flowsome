import { Audio } from 'expo-av';
import { AmbientPreset } from '../../types';

export interface AmbientLoopDefinition {
  preset: AmbientPreset;
  gain: number;
  fadeInMs: number;
  fadeOutMs: number;
  assetModule?: number;
}

export const AMBIENT_LOOPS: Record<AmbientPreset, AmbientLoopDefinition> = {
  desertWind: { preset: 'desertWind', gain: 0.42, fadeInMs: 1400, fadeOutMs: 900 },
  rainforestWater: { preset: 'rainforestWater', gain: 0.38, fadeInMs: 1600, fadeOutMs: 1000 },
  teaGardenWind: { preset: 'teaGardenWind', gain: 0.34, fadeInMs: 1500, fadeOutMs: 900 },
  mountainWind: { preset: 'mountainWind', gain: 0.32, fadeInMs: 1800, fadeOutMs: 1200 },
  oceanWaves: { preset: 'oceanWaves', gain: 0.4, fadeInMs: 1600, fadeOutMs: 1000 },
};

export class AmbientAudioController {
  private sound: Audio.Sound | null = null;
  private activePreset: AmbientPreset | null = null;

  async prepare(): Promise<void> {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }

  async play(definition: AmbientLoopDefinition): Promise<void> {
    if (this.activePreset === definition.preset) return;
    await this.fadeOut();
    this.activePreset = definition.preset;

    if (!definition.assetModule) return;

    const { sound } = await Audio.Sound.createAsync(
      definition.assetModule,
      { isLooping: true, volume: 0 },
      undefined,
      false
    );
    this.sound = sound;
    await sound.playAsync();
    await sound.setVolumeAsync(definition.gain);
  }

  async fadeOut(): Promise<void> {
    if (!this.sound) {
      this.activePreset = null;
      return;
    }

    await this.sound.setVolumeAsync(0);
    await this.sound.stopAsync();
    await this.sound.unloadAsync();
    this.sound = null;
    this.activePreset = null;
  }
}
