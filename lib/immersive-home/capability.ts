export type ImmersiveMode = 'static' | 'webgl';

export type CapabilityInput = {
  reducedMotion: boolean;
  saveData: boolean;
  webglAvailable: boolean;
  nearViewport: boolean;
  sessionContextLost: boolean;
};

export type RenderQualityInput = {
  viewportWidth: number;
  devicePixelRatio: number;
  hardwareConcurrency: number;
};

export type RenderQuality = {
  pixelRatio: number;
  signalCount: number;
};

const WIDE_MIN_WIDTH = 1024;
const CONSTRAINED_MAX_CORES = 4;

/** Every failed gate keeps the complete static composition; WebGL is only an enhancement. */
export function chooseImmersiveMode(input: CapabilityInput): ImmersiveMode {
  if (input.reducedMotion || input.saveData || !input.webglAvailable || input.sessionContextLost || !input.nearViewport) {
    return 'static';
  }
  return 'webgl';
}

/** DPR is capped at 1.5 wide and 1.25 compact; detail drops with width and with capability. */
export function chooseRenderQuality(input: RenderQualityInput): RenderQuality {
  const compact = input.viewportWidth < WIDE_MIN_WIDTH;
  const constrained = input.hardwareConcurrency > 0 && input.hardwareConcurrency <= CONSTRAINED_MAX_CORES;
  const maxPixelRatio = compact || constrained ? 1.25 : 1.5;

  return {
    pixelRatio: Math.min(Math.max(1, input.devicePixelRatio || 1), maxPixelRatio),
    signalCount: compact && constrained ? 6 : compact || constrained ? 10 : 18,
  };
}
