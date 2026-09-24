import {
  DOUBT_ELLIPSE,
  EXACT_FIX,
  POSITION_FIX_VIEW_BOX,
  SOURCES,
  getConnectedLines,
  getSeparateLines,
  markerNumberAnchor,
  markerNumberForSourceId,
  type PositionFixContent,
  type PositionFixSourcePoint,
} from '@/lib/impact/position-fix';
import { PositionFixToggle } from './PositionFixToggle';
import styles from './position-fix.module.css';

/*
 * N2 (independent review round 1): the SVG ids below (`position-fix-*-title`
 * / `-desc`) are static, not generated per instance. That is safe today
 * because PositionFixFigure is rendered at most once per page (Task 9 mounts
 * exactly one HomeImpact section on Home). If a future task ever needs a
 * second instance on the same page, add an `idPrefix` prop and interpolate
 * it into these ids rather than relying on this single-instance assumption.
 */

interface PositionFixFigureProps {
  content: PositionFixContent;
}

interface SourceMarkerProps {
  point: PositionFixSourcePoint;
  name: string;
  tooltip: string;
  markerClassName: string;
}

/**
 * Shared marker renderer for both states (REFACTOR): a circle at the source's
 * bearing origin, a name label positioned away from the chart center, and a
 * native SVG <title> tooltip. Native <title> tooltips are pointer-hover only
 * and are never reachable by keyboard focus, satisfying the "pointer-only,
 * not focusable" rule without extra client-side pointer-tracking script; the
 * visible source list below is the accessible equivalent either way.
 *
 * S4 amendment: below the 300px container-width floor the full-name .fixLabel
 * is hidden (CSS) and this also renders a .markerNumber numeral key (1-5, in
 * fixed SOURCES order), shown only in that narrow band. The numeral is a
 * decorative duplicate of the visible source <ol>'s own numbering; it is
 * aria-hidden because the SVG's role="img" name/description (title/desc)
 * already carry the accessible meaning.
 *
 * N-A2 (independent review round 2): the numeral no longer shares the name
 * label's anchor. At the numeral's much larger 32-unit font size, the name
 * label's offsets put its ascent inside the marker circle (bottom markers)
 * or past y=0 (`book`, the top marker closest to the viewBox edge). Its
 * position comes from lib/impact/position-fix.ts's markerNumberAnchor,
 * which scripts/position-fix.test.mjs proves stays clear of both.
 */
function SourceMarker({ point, name, tooltip, markerClassName }: SourceMarkerProps) {
  const anchorStart = point.x < POSITION_FIX_VIEW_BOX.width / 2;
  const anchorX = point.x + (anchorStart ? -10 : 10);
  const anchorY = point.y + (point.y < POSITION_FIX_VIEW_BOX.height / 2 ? -12 : 22);
  const textAnchor = anchorStart ? 'start' : 'end';
  const numberAnchor = markerNumberAnchor(point);

  return (
    <g>
      <circle cx={point.x} cy={point.y} r={6} className={markerClassName}>
        <title>{tooltip}</title>
      </circle>
      <text x={anchorX} y={anchorY} textAnchor={textAnchor} className={`${styles.fixLabel} ${styles.labelInk}`}>
        {name}
      </text>
      <text
        x={numberAnchor.x}
        y={numberAnchor.y}
        textAnchor={numberAnchor.textAnchor}
        className={`${styles.markerNumber} ${styles.labelInk}`}
        aria-hidden="true"
      >
        {markerNumberForSourceId(point.id)}
      </text>
    </g>
  );
}

function SourceLines({
  lines,
  lineClassName,
}: {
  lines: ReturnType<typeof getSeparateLines>;
  lineClassName: string;
}) {
  return (
    <>
      {lines.map((line) => (
        <line
          key={line.sourceId}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          strokeWidth={1.5}
          className={lineClassName}
        />
      ))}
    </>
  );
}

/**
 * Shared per-state marker loop (REFACTOR): resolves each SOURCES point to its
 * content by id and renders a SourceMarker, so the separate and connected
 * SVGs only differ by their marker class and tooltip text.
 */
function SourceMarkers({
  sourceById,
  markerClassName,
  tooltipFor,
}: {
  sourceById: Map<PositionFixSourcePoint['id'], PositionFixContent['sources'][number]>;
  markerClassName: string;
  tooltipFor: (name: string, note: string) => string;
}) {
  return (
    <>
      {SOURCES.map((point) => {
        const source = sourceById.get(point.id);
        if (!source) return null;
        return (
          <SourceMarker
            key={point.id}
            point={point}
            name={source.name}
            tooltip={tooltipFor(source.name, source.note)}
            markerClassName={markerClassName}
          />
        );
      })}
    </>
  );
}

export function PositionFixFigure({ content }: PositionFixFigureProps) {
  const sourceById = new Map(content.sources.map((source) => [source.id, source]));
  const separateLines = getSeparateLines();
  const connectedLines = getConnectedLines();

  const separateSvg = (
    <div className={styles.chartWrapper}>
      <svg
        viewBox={`0 0 ${POSITION_FIX_VIEW_BOX.width} ${POSITION_FIX_VIEW_BOX.height}`}
        role="img"
        aria-labelledby="position-fix-separate-title"
        aria-describedby="position-fix-separate-caption"
        className={styles.chart}
      >
        <title id="position-fix-separate-title">{content.figure.title}</title>
        {/* Nit (d, independent review round 2): aria-describedby points at the
            visible .chartCaption <p> below (same text), not this <desc>, so
            a screen reader isn't handed two separate description strings for
            one image. <desc> stays as the SVG's own native description --
            already present regardless of JS, so it needs no separate no-JS
            fallback. */}
        <desc id="position-fix-separate-desc">{content.figure.separateDescription}</desc>
        <SourceLines lines={separateLines} lineClassName={styles.lineContext} />
        <ellipse
          cx={DOUBT_ELLIPSE.cx}
          cy={DOUBT_ELLIPSE.cy}
          rx={DOUBT_ELLIPSE.rx}
          ry={DOUBT_ELLIPSE.ry}
          strokeDasharray="3 5"
          className={styles.doubtEllipse}
        />
        <SourceMarkers
          sourceById={sourceById}
          markerClassName={styles.markerContext}
          tooltipFor={(name, note) => `${name}: ${note}`}
        />
        <text
          x={DOUBT_ELLIPSE.cx}
          y={DOUBT_ELLIPSE.cy + DOUBT_ELLIPSE.ry + 24}
          textAnchor="middle"
          className={`${styles.fixLabel} ${styles.labelMuted}`}
        >
          {content.figure.doubtLabel}
        </text>
      </svg>
      <p id="position-fix-separate-caption" className={styles.chartCaption}>
        {content.figure.separateDescription}
      </p>
    </div>
  );

  const connectedSvg = (
    <div className={styles.chartWrapper}>
      <svg
        viewBox={`0 0 ${POSITION_FIX_VIEW_BOX.width} ${POSITION_FIX_VIEW_BOX.height}`}
        role="img"
        aria-labelledby="position-fix-connected-title"
        aria-describedby="position-fix-connected-caption"
        className={styles.chart}
      >
        <title id="position-fix-connected-title">{content.figure.title}</title>
        <desc id="position-fix-connected-desc">{content.figure.connectedDescription}</desc>
        <SourceLines lines={connectedLines} lineClassName={styles.lineSignal} />
        <circle cx={EXACT_FIX.x} cy={EXACT_FIX.y} r={13} className={styles.fixRing} />
        <circle cx={EXACT_FIX.x} cy={EXACT_FIX.y} r={5} className={styles.fixDot} />
        <SourceMarkers
          sourceById={sourceById}
          markerClassName={styles.markerSignal}
          tooltipFor={(name) => content.connectedNoteTemplate.replace('{source}', name)}
        />
        <text
          x={EXACT_FIX.x}
          y={EXACT_FIX.y + 40}
          textAnchor="middle"
          className={`${styles.fixLabel} ${styles.labelSignal}`}
        >
          {content.figure.fixLabel}
        </text>
      </svg>
      <p id="position-fix-connected-caption" className={styles.chartCaption}>
        {content.figure.connectedDescription}
      </p>
    </div>
  );

  return (
    <figure className={styles.figure}>
      <span className={styles.tag}>{content.illustrativeTag}</span>
      <PositionFixToggle
        groupLabel={content.toggle.groupLabel}
        separateLabel={content.toggle.separateLabel}
        connectedLabel={content.toggle.connectedLabel}
        announcementTemplate={content.toggle.announcement}
        separateContent={separateSvg}
        connectedContent={connectedSvg}
      />
      {/* N-A1 (independent review round 3): the numeral prefix is an explicit
          span, not CSS ::marker (which never painted: .sourceList li below
          is display: flex, and ::marker only renders on display: list-item).
          aria-hidden since it duplicates the <ol>'s own implicit numbering
          (role="list" below keeps that numbering exposed to assistive tech
          that would otherwise drop it on a styleless list); the number
          itself comes from markerNumberForSourceId, the same fixed-order
          function the SVG's numeral keys use, so the two can never disagree. */}
      <ol className={styles.sourceList} role="list">
        {content.sources.map((source) => (
          <li key={source.id}>
            <span aria-hidden="true" className={styles.sourceNumber}>
              {markerNumberForSourceId(source.id)}.
            </span>
            <span className={styles.sourceName}>{source.name}</span>
            <span className={styles.sourceNote}>{source.note}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
