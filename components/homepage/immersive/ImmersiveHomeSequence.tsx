import type { HomePageContent } from '@/components/homepage/content-types';
import { getInstrumentPoster } from '@/lib/immersive-home/media-manifest';
import { ImmersiveChapter } from './ImmersiveChapter';
import { ImmersiveEditorialAnchor } from './ImmersiveEditorialAnchor';
import { ImmersiveStaticArtwork } from './ImmersiveStaticArtwork';
import styles from './immersive-home.module.css';

interface ImmersiveHomeSequenceProps {
  content: HomePageContent;
}

// Complete static C2 sequence: server-rendered proposition, actions and four chapters with
// decorative posters. Later enhancement may cover the stage but never replaces this document.
export function ImmersiveHomeSequence({ content }: ImmersiveHomeSequenceProps) {
  const { instrument } = content;
  const [firstChapter] = instrument.chapters;

  return (
    <div
      data-instrument
      className="bg-foundation-canvas [--frame-ground:theme(colors.foundation.canvas)] [--frame-rule:theme(colors.foundation.border)]"
    >
      <div className={`${styles.stage} mx-auto w-full max-w-[1200px] px-5 pt-12 md:px-8 md:pt-16 lg:px-12 lg:pb-24 lg:pt-24`}>
        <section aria-labelledby="home-heading" className={`${styles.anchor} pb-12 md:pb-16 lg:pb-0`}>
          <ImmersiveEditorialAnchor content={content} instrumentLabel={instrument.label} />
        </section>
        <ImmersiveStaticArtwork
          poster={getInstrumentPoster(firstChapter.artworkId)}
          className={styles.stageArtwork}
          priority
        />
        {instrument.chapters.map((chapter, index) => (
          <ImmersiveChapter
            key={chapter.id}
            chapter={chapter}
            index={index}
            total={instrument.chapters.length}
            statusLabel={instrument.statusLabel}
          />
        ))}
      </div>
    </div>
  );
}
