import type { HomePageContent } from '@/components/homepage/content-types';
import { EnvironmentGround } from './EnvironmentGround';
import { ImmersiveChapter } from './ImmersiveChapter';
import { ImmersiveEditorialAnchor } from './ImmersiveEditorialAnchor';
import { ImmersiveEnhancement } from './ImmersiveEnhancement';
import styles from './immersive-home.module.css';

interface ImmersiveHomeSequenceProps {
  content: HomePageContent;
}

/**
 * The complete static Sky Chart composition (PLAN-SKY-CHART-HOME-REDESIGN-V2 D-01, D-10 to
 * D-12): a full-viewport environment behind a bottom-aligned hero and four atlas-plate
 * chapters. ImmersiveEnhancement may layer a WebGL scene over the environment ground, but
 * this document is the complete experience without it.
 */
export function ImmersiveHomeSequence({ content }: ImmersiveHomeSequenceProps) {
  const { instrument, readout } = content;

  return (
    <div data-instrument>
      <EnvironmentGround />
      <section aria-labelledby="home-heading" data-readout={readout.home} className={styles.hero}>
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <ImmersiveEditorialAnchor content={content} coordinates={instrument.coordinates} />
        </div>
      </section>
      <div
        data-instrument-chapters
        className={`${styles.chapters} mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12`}
      >
        <p className={`${styles.instrumentLabel} font-mono text-label uppercase`}>{instrument.label}</p>
        {instrument.chapters.map((chapter) => (
          <ImmersiveChapter key={chapter.id} chapter={chapter} plateLabel={instrument.plateLabel} readout={readout.home} />
        ))}
      </div>
      {/*
        Rendered last so the Pause control (inside, when active) is the next stop after the
        chapters' own focusable content, per D-25's keyboard order.
      */}
      <ImmersiveEnhancement
        statusLabel={instrument.statusLabel}
        pauseLabel={instrument.pauseLabel}
        resumeLabel={instrument.resumeLabel}
        sequences={instrument.chapters.map((chapter) => chapter.sequence)}
      />
    </div>
  );
}
