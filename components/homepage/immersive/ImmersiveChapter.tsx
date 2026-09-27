import type { InstrumentChapterContent } from '@/lib/immersive-home/types';
import { AtlasPlate } from '@/components/surfaces/AtlasPlate';
import styles from './immersive-home.module.css';

interface ImmersiveChapterProps {
  chapter: InstrumentChapterContent;
  /** `instrument.plateLabel`, e.g. `Plate {current}/04`; `{current}` becomes the sequence. */
  plateLabel: string;
  /** `readout.home`: chapters stay under the Home readout entry (D-22). */
  readout: string;
}

/**
 * SKY-CHART-V2 D-12 chapter: an atlas plate carrying the plate number, chapter kicker,
 * heading and description. No poster, artwork frame or phase spine: the environment behind
 * the plate carries the chapter's visual motion instead.
 */
export function ImmersiveChapter({ chapter, plateLabel, readout }: ImmersiveChapterProps) {
  const headingId = `instrument-${chapter.id}-heading`;
  const plateNumber = plateLabel.replace('{current}', chapter.sequence);

  return (
    <section
      aria-labelledby={headingId}
      data-instrument-chapter={chapter.id}
      data-readout={readout}
      className={styles.chapter}
    >
      <AtlasPlate plateNumber={plateNumber}>
        <p className={`${styles.chapterKicker} font-mono text-label uppercase`}>{chapter.kicker}</p>
        <h2 id={headingId} className={`${styles.chapterHeading} text-display-3`}>
          {chapter.heading}
        </h2>
        <p className={styles.chapterDescription}>{chapter.description}</p>
      </AtlasPlate>
    </section>
  );
}
