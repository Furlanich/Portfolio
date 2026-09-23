import type { InstrumentChapterContent } from '@/lib/immersive-home/types';
import { getInstrumentPoster } from '@/lib/immersive-home/media-manifest';
import { ImmersiveStaticArtwork } from './ImmersiveStaticArtwork';
import { PhaseSpine } from './PhaseSpine';
import styles from './immersive-home.module.css';

interface ImmersiveChapterProps {
  chapter: InstrumentChapterContent;
  index: number;
  total: number;
  statusLabel: string;
}

export function ImmersiveChapter({ chapter, index, total, statusLabel }: ImmersiveChapterProps) {
  const headingId = `instrument-${chapter.id}-heading`;
  const status = statusLabel.replace('{current}', chapter.sequence);

  return (
    <section
      aria-labelledby={headingId}
      data-instrument-chapter={chapter.id}
      className={`${styles.chapter} border-t border-foundation-border py-12 md:py-16 lg:border-t-0 lg:py-0`}
    >
      <div className={`${styles.chapterText} lg:py-12`}>
        <p className="flex items-center gap-3 font-mono text-[13px] font-semibold leading-5">
          <span data-sequence aria-hidden="true" className="text-foundation-action">{chapter.sequence}</span>
          <span data-phase-status className="text-foundation-muted max-[389px]:sr-only">{status}</span>
        </p>
        <h2 id={headingId} className="mt-3 max-w-[20ch] text-[28px] font-bold leading-[34px] tracking-[-0.015em] text-foundation-ink md:text-[32px] md:leading-[38px]">{chapter.heading}</h2>
        <p className="mt-4 max-w-[52ch] text-lg leading-7 text-foundation-muted">{chapter.description}</p>
        <PhaseSpine current={index} total={total} />
      </div>
      <ImmersiveStaticArtwork
        poster={getInstrumentPoster(chapter.artworkId)}
        className={`${styles.chapterArtwork} mt-8 lg:mt-0`}
        priority={index === 0}
      />
    </section>
  );
}
