import {
  DOUBT_ELLIPSE,
  EXACT_FIX,
  POSITION_FIX_VIEW_BOX,
  SOURCES,
  getConnectedLines,
  getSeparateLines,
  type PositionFixContent,
  type PositionFixSourcePoint,
} from '../../../lib/impact/position-fix';
import { PositionFixToggle } from './PositionFixToggle';
import styles from './position-fix.module.css';

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
 */
function SourceMarker({ point, name, tooltip, markerClassName }: SourceMarkerProps) {
  const anchorStart = point.x < POSITION_FIX_VIEW_BOX.width / 2;
  const alignTop = point.y < POSITION_FIX_VIEW_BOX.height / 2;

  return (
    <g>
      <circle cx={point.x} cy={point.y} r={6} className={markerClassName}>
        <title>{tooltip}</title>
      </circle>
      <text
        x={point.x + (anchorStart ? -10 : 10)}
        y={point.y + (alignTop ? -12 : 22)}
        textAnchor={anchorStart ? 'start' : 'end'}
        className={`${styles.fixLabel} ${styles.labelInk}`}
      >
        {name}
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

export function PositionFixFigure({ content }: PositionFixFigureProps) {
  const sourceById = new Map(content.sources.map((source) => [source.id, source]));
  const separateLines = getSeparateLines();
  const connectedLines = getConnectedLines();

  const separateSvg = (
    <svg
      viewBox={`0 0 ${POSITION_FIX_VIEW_BOX.width} ${POSITION_FIX_VIEW_BOX.height}`}
      role="img"
      aria-labelledby="position-fix-separate-title"
      aria-describedby="position-fix-separate-desc"
      className={styles.chart}
    >
      <title id="position-fix-separate-title">{content.figure.title}</title>
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
      {SOURCES.map((point) => {
        const source = sourceById.get(point.id);
        if (!source) return null;
        return (
          <SourceMarker
            key={point.id}
            point={point}
            name={source.name}
            tooltip={`${source.name}: ${source.note}`}
            markerClassName={styles.markerContext}
          />
        );
      })}
      <text
        x={DOUBT_ELLIPSE.cx}
        y={DOUBT_ELLIPSE.cy + DOUBT_ELLIPSE.ry + 24}
        textAnchor="middle"
        className={`${styles.fixLabel} ${styles.labelMuted}`}
      >
        {content.figure.doubtLabel}
      </text>
    </svg>
  );

  const connectedSvg = (
    <svg
      viewBox={`0 0 ${POSITION_FIX_VIEW_BOX.width} ${POSITION_FIX_VIEW_BOX.height}`}
      role="img"
      aria-labelledby="position-fix-connected-title"
      aria-describedby="position-fix-connected-desc"
      className={styles.chart}
    >
      <title id="position-fix-connected-title">{content.figure.title}</title>
      <desc id="position-fix-connected-desc">{content.figure.connectedDescription}</desc>
      <SourceLines lines={connectedLines} lineClassName={styles.lineSignal} />
      <circle cx={EXACT_FIX.x} cy={EXACT_FIX.y} r={13} className={styles.fixRing} />
      <circle cx={EXACT_FIX.x} cy={EXACT_FIX.y} r={5} className={styles.fixDot} />
      {SOURCES.map((point) => {
        const source = sourceById.get(point.id);
        if (!source) return null;
        return (
          <SourceMarker
            key={point.id}
            point={point}
            name={source.name}
            tooltip={content.connectedNoteTemplate.replace('{source}', source.name)}
            markerClassName={styles.markerSignal}
          />
        );
      })}
      <text
        x={EXACT_FIX.x}
        y={EXACT_FIX.y + 40}
        textAnchor="middle"
        className={`${styles.fixLabel} ${styles.labelSignal}`}
      >
        {content.figure.fixLabel}
      </text>
    </svg>
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
      <ul className={styles.sourceList}>
        {content.sources.map((source) => (
          <li key={source.id}>
            <span className={styles.sourceName}>{source.name}</span>
            <span className={styles.sourceNote}>{source.note}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
