import { CanvasTexture, Sprite, SpriteMaterial, SRGBColorSpace } from 'three';
import type { SkyChartTier } from '@/lib/immersive-home/sky-chart-model';

const FONT_MONO_PROPERTY = '--font-mono';
const FONT_SANS_PROPERTY = '--font-sans';
const FALLBACK_MONO = 'monospace';
const FALLBACK_SANS = 'sans-serif';

/** Reads a `next/font` CSS variable, falling back to a generic face if it is unset or throws. */
function readFontFamily(customProperty: string, fallback: string): string {
  try {
    const value = getComputedStyle(document.documentElement).getPropertyValue(customProperty).trim();
    return value || fallback;
  } catch {
    return fallback;
  }
}

/**
 * T-03: awaits both label font faces before any label texture is built. `document.fonts.load`
 * rejecting or throwing is swallowed -- labels still render in the fallback face, and the
 * failure is never surfaced to the visitor.
 */
export async function loadSkyChartFonts(): Promise<void> {
  const mono = readFontFamily(FONT_MONO_PROPERTY, FALLBACK_MONO);
  const sans = readFontFamily(FONT_SANS_PROPERTY, FALLBACK_SANS);
  try {
    await Promise.all([document.fonts.load(`600 30px ${mono}`), document.fonts.load(`500 24px ${sans}`)]);
  } catch {
    // Quiet degrade (T-03): the fallback face still renders.
  }
}

const TIER_FONT_PX: Record<SkyChartTier, number> = { 1: 30, 2: 26, 3: 22 };
const TIER_COLOR: Record<SkyChartTier, string> = { 1: '#F9F6EE', 2: '#9CC4EC', 3: '#B9C3CC' };
const TIER_WORLD_HEIGHT: Record<SkyChartTier, number> = { 1: 2.1, 2: 1.7, 3: 1.7 };
const TIER_DOT_RADIUS: Record<SkyChartTier, number> = { 1: 8, 2: 5, 3: 5 };
const TIER_1_RING_RADIUS = 14;
const TIER_1_RING_STROKE = 'rgba(156,196,236,.8)';
const TIER_1_RING_WIDTH = 2;
const CANVAS_HEIGHT = 64;
const TEXT_PADDING = 56;
const TEXT_X = 38;
const DOT_X = 14;
const DOT_Y = 32;

function fontFor(tier: SkyChartTier, fontMono: string, fontSans: string): string {
  const px = TIER_FONT_PX[tier];
  return tier === 1 ? `600 ${px}px ${fontMono}` : `500 ${px}px ${fontSans}`;
}

export type LabelSpriteResources = {
  sprite: Sprite;
  material: SpriteMaterial;
  texture: CanvasTexture;
};

/**
 * Builds one CanvasTexture-backed label sprite (plan section 10). Tier 1 renders uppercase via
 * `toLocaleUpperCase(locale)` in Plex Mono with a ring; tiers 2-3 render in Instrument Sans.
 * The sprite starts at opacity 0 -- the caller sets it once a frame is mapped.
 */
export function createLabelSprite(text: string, tier: SkyChartTier, locale: string): LabelSpriteResources {
  const fontMono = readFontFamily(FONT_MONO_PROPERTY, FALLBACK_MONO);
  const fontSans = readFontFamily(FONT_SANS_PROPERTY, FALLBACK_SANS);
  const displayText = tier === 1 ? text.toLocaleUpperCase(locale) : text;
  const font = fontFor(tier, fontMono, fontSans);

  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d')!;
  measureCtx.font = font;
  const textWidth = Math.ceil(measureCtx.measureText(displayText).width);
  const width = textWidth + TEXT_PADDING;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d')!;
  ctx.font = font;
  ctx.fillStyle = TIER_COLOR[tier];
  ctx.textBaseline = 'middle';
  ctx.beginPath();
  ctx.arc(DOT_X, DOT_Y, TIER_DOT_RADIUS[tier], 0, Math.PI * 2);
  ctx.fill();
  if (tier === 1) {
    ctx.strokeStyle = TIER_1_RING_STROKE;
    ctx.lineWidth = TIER_1_RING_WIDTH;
    ctx.beginPath();
    ctx.arc(DOT_X, DOT_Y, TIER_1_RING_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillText(displayText, TEXT_X, DOT_Y + 1);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;

  const material = new SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0 });
  const sprite = new Sprite(material);
  const height = TIER_WORLD_HEIGHT[tier];
  sprite.scale.set((height * width) / CANVAS_HEIGHT, height, 1);
  sprite.center.set(DOT_X / width, 0.5);

  return { sprite, material, texture };
}
