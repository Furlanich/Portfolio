export type ImmersiveMode = 'static' | 'webgl';

export type CapabilityInput = {
  reducedMotion: boolean;
  saveData: boolean;
  webglAvailable: boolean;
  nearViewport: boolean;
  sessionContextLost: boolean;
  /** B1 (amended ADR 2026-09-28): a software rasterizer (SwiftShader, llvmpipe, softpipe, the
   * Microsoft Basic Render Driver) fails the gate like every other gate. The caller is
   * responsible for folding the explicit test-only override into this flag before calling. */
  softwareRenderer: boolean;
};

export type RenderQualityInput = {
  viewportWidth: number;
  devicePixelRatio: number;
  hardwareConcurrency: number;
};

export type RenderQuality = {
  pixelRatio: number;
  /** Field-star point count (plan T-07): 520 wide, 260 compact, 160 compact and constrained. */
  starCount: number;
};

const WIDE_MIN_WIDTH = 1024;
const CONSTRAINED_MAX_CORES = 4;
const STAR_COUNT_WIDE = 520;
const STAR_COUNT_COMPACT = 260;
const STAR_COUNT_CONSTRAINED = 160;

/** Every failed gate keeps the complete static composition; WebGL is only an enhancement. */
export function chooseImmersiveMode(input: CapabilityInput): ImmersiveMode {
  if (
    input.reducedMotion ||
    input.saveData ||
    !input.webglAvailable ||
    input.sessionContextLost ||
    !input.nearViewport ||
    input.softwareRenderer
  ) {
    return 'static';
  }
  return 'webgl';
}

// B1: named software rasterizers (amended ADR 2026-09-28, section 10). Matched case-insensitively
// against the WebGL2 unmasked renderer string (WEBGL_debug_renderer_info), or plain RENDERER
// where the browser does not expose the unmasked extension.
const SOFTWARE_RENDERER_PATTERN = /swiftshader|llvmpipe|softpipe|software|basic render/i;

export function isSoftwareRenderer(rendererString: string): boolean {
  return SOFTWARE_RENDERER_PATTERN.test(rendererString);
}

/**
 * DPR is capped at 1.5 wide and 1.25 compact or constrained (plan T-07, unchanged from the
 * prior instrument runtime). Field-star density drops on compact, and again when compact and
 * constrained; a wide-but-constrained device keeps the wide star count.
 */
export function chooseRenderQuality(input: RenderQualityInput): RenderQuality {
  const compact = input.viewportWidth < WIDE_MIN_WIDTH;
  const constrained = input.hardwareConcurrency > 0 && input.hardwareConcurrency <= CONSTRAINED_MAX_CORES;
  const maxPixelRatio = compact || constrained ? 1.25 : 1.5;
  const starCount = compact && constrained ? STAR_COUNT_CONSTRAINED : compact ? STAR_COUNT_COMPACT : STAR_COUNT_WIDE;

  return {
    pixelRatio: Math.min(Math.max(1, input.devicePixelRatio || 1), maxPixelRatio),
    starCount,
  };
}
