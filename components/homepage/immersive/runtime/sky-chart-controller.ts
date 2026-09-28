import type { SkyChartFrame } from '@/lib/immersive-home/sky-chart-model';
import type { SkyChartSceneHandle } from './create-sky-chart-scene';

const DAMPING = 0.12;
const SETTLE_EPSILON = 0.0005;

export type SkyChartControllerOptions = {
  scene: SkyChartSceneHandle;
  /** Maps the current eased position `t` (0..1) to a frame, using the latest DOM measurement. */
  mapFrame(t: number): SkyChartFrame;
  /** Called after every render, including mid-animation ticks (drives `data-rendered-chapter`). */
  onRender?(t: number): void;
  /** Called once the eased position reaches its target and the loop stops (demand rendering). */
  onSettled?(t: number): void;
};

/**
 * Owns the demand-driven render loop (plan T-06): each animation frame damps the eased position
 * `t` toward the latest scroll-derived target by 0.12, snaps once the delta is under 0.0005, then
 * stops -- there is no idle loop and no renderer animation-loop callback. Also owns pause/resume, so rendering
 * never advances while paused and Resume recalculates a fresh frame immediately.
 */
export class SkyChartController {
  private readonly options: SkyChartControllerOptions;
  private t = 0;
  private target = 0;
  private frameHandle = 0;
  private paused = false;
  private hasRendered = false;
  private labelOpacityScale = 1;

  constructor(options: SkyChartControllerOptions) {
    this.options = options;
  }

  get eased(): number {
    return this.t;
  }

  get isPaused(): boolean {
    return this.paused;
  }

  /** Sets a new scroll-derived target. `immediate` renders once synchronously without damping
   * (first activation, resize, and Resume all need the visible frame to match right away). */
  setTarget(target: number, immediate = false): void {
    const unchanged = target === this.target;
    // Only a real repeat counts: the very first call must always render at least once, even
    // when the initial target happens to equal the class's zero-valued defaults (e.g. loading
    // the page already scrolled to the top, where progress is legitimately 0).
    const alreadySettledHere = this.hasRendered && unchanged && this.t === target;
    this.target = target;
    if (this.paused) return;
    // Demand rendering, both paths: a repeated target that is already the settled position
    // (e.g. scrolling further inside a fully-receded or fully-advanced span, or another
    // immediate call once fully receded) must not render an empty frame.
    if (alreadySettledHere) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = 0;
      return;
    }
    if (immediate) {
      this.t = target;
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = 0;
      this.renderNow();
      return;
    }
    this.schedule();
  }

  /**
   * N8: the caller (recede) routes every label-opacity-scale change through here instead of
   * calling the scene directly, so it shares the controller's pause gate and render accounting.
   * B3/N8: while paused, the scale is stored but nothing renders -- Pause must freeze every
   * visible change, not only the camera. The stored scale is applied (without an extra render)
   * the moment the controller un-pauses, so the next real render already reflects it.
   */
  setLabelOpacityScale(multiplier: number): void {
    this.labelOpacityScale = multiplier;
    if (this.paused) return;
    this.options.scene.setLabelOpacity(multiplier);
    this.options.onRender?.(this.t);
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    if (paused) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = 0;
    }
  }

  /** Resumes and immediately recalculates from the given fresh target (D-25: "Resume recalculates"). */
  resume(target: number): void {
    this.paused = false;
    // Apply any label-opacity scale that changed while paused (stored, not rendered per B3/N8)
    // before the camera-position render below, so the very next frame is fully correct.
    this.options.scene.setLabelOpacity(this.labelOpacityScale);
    this.setTarget(target, true);
  }

  dispose(): void {
    cancelAnimationFrame(this.frameHandle);
    this.frameHandle = 0;
  }

  private schedule(): void {
    if (this.frameHandle || this.paused) return;
    this.frameHandle = requestAnimationFrame(this.step);
  }

  private step = (): void => {
    this.frameHandle = 0;
    if (this.paused) return;
    const delta = this.target - this.t;
    this.t += delta * DAMPING;
    if (Math.abs(this.target - this.t) < SETTLE_EPSILON) this.t = this.target;
    this.renderNow();
    if (this.t !== this.target) this.schedule();
    else this.options.onSettled?.(this.t);
  };

  private renderNow(): void {
    this.hasRendered = true;
    this.options.scene.render(this.options.mapFrame(this.t));
    this.options.onRender?.(this.t);
  }
}
