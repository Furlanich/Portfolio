import type { LabelBox, LabelVisibility, OccluderRect } from './types';

type Rect = { left: number; top: number; width: number; height: number };

/** Strict overlap: rectangles that only touch along an edge do not intersect. */
function intersects(a: Rect, b: Rect): boolean {
  return a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
}

function isUsableRect(rect: Rect): boolean {
  return (
    Number.isFinite(rect.left) &&
    Number.isFinite(rect.top) &&
    Number.isFinite(rect.width) &&
    Number.isFinite(rect.height) &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

type Candidate = { index: number; id: string; depthScale: number; rect: Rect };

/**
 * PC-2 label visibility. Each label is clamped into the viewport at its full size, and hidden when
 * it cannot fit, is entirely out of view, or (at its clamped position) intersects an occluder.
 * Remaining overlaps resolve greedily by descending depthScale, then ascending node id, and a
 * hidden label never claims space. Labels are never scaled: the host measures them at 11px or
 * more, and this function only moves or hides them. Results keep the input order.
 */
export function resolveLabelVisibility(
  labels: readonly LabelBox[],
  occluders: readonly OccluderRect[],
  viewport: { width: number; height: number },
): readonly LabelVisibility[] {
  const viewportRect: Rect = { left: 0, top: 0, width: viewport.width, height: viewport.height };
  const viewportUsable = isUsableRect(viewportRect);
  const blockers = occluders.filter(isUsableRect);

  const results: LabelVisibility[] = labels.map((label) => ({ id: label.id, visible: false, left: label.left, top: label.top }));
  const candidates: Candidate[] = [];

  labels.forEach((label, index) => {
    if (!viewportUsable || !isUsableRect(label) || !Number.isFinite(label.depthScale)) return;
    if (label.width > viewport.width || label.height > viewport.height) return;
    if (!intersects(label, viewportRect)) return;
    const rect: Rect = {
      left: clamp(label.left, 0, viewport.width - label.width),
      top: clamp(label.top, 0, viewport.height - label.height),
      width: label.width,
      height: label.height,
    };
    if (blockers.some((blocker) => intersects(rect, blocker))) return;
    candidates.push({ index, id: label.id, depthScale: label.depthScale, rect });
  });

  candidates.sort((a, b) => b.depthScale - a.depthScale || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const accepted: Candidate[] = [];
  for (const candidate of candidates) {
    if (accepted.some((other) => intersects(candidate.rect, other.rect))) continue;
    accepted.push(candidate);
    results[candidate.index] = { id: candidate.id, visible: true, left: candidate.rect.left, top: candidate.rect.top };
  }
  return results;
}
