import { formatCapabilityLegend } from '@/lib/connected-studio/content';
import type { CapabilityWords } from '@/lib/connected-studio/types';
import type { ServicesPageContent } from './content-types';
import styles from './services.module.css';

interface ServicesIntroductionProps {
  content: ServicesPageContent['introduction'];
  sceneCaption: string;
  capabilityWords: CapabilityWords;
}

/**
 * The page introduction: the one H1 and its short orientation inside a reading mask, with the hero
 * Pause mount reserved beneath it (Task 7 portals the button in; nothing here moves when it does),
 * and the illustrative-model caption with the semantic capability legend beside it. The legend
 * appears once on the page, as ordinary text, so the vocabulary never depends on the canvas.
 */
export function ServicesIntroduction({ content, sceneCaption, capabilityWords }: ServicesIntroductionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <div
        data-connected-reading-mask
        data-connected-chapter="introduction"
        className={`${styles.plate} p-5 md:p-10 lg:col-span-7`}
      >
        <h1 className="max-w-[15ch] text-[44px] font-bold leading-[1.02] tracking-[-0.03em] text-identity-bone md:text-[56px] lg:text-[72px]">
          {content.heading}
        </h1>
        <p className="mt-6 max-w-[56ch] text-lg leading-8 text-sky-text-2 lg:text-xl">{content.description}</p>
        <div id="connected-pause-services" data-connected-pause-slot className={`${styles.pauseSlot} mt-6`} />
      </div>

      <div data-connected-reading-mask className={`${styles.plate} p-5 lg:col-span-4 lg:col-start-9`}>
        <p className="text-sm font-semibold leading-6 text-identity-bone">{sceneCaption}</p>
        <p className="mt-2 text-sm leading-6 text-sky-text-2">{formatCapabilityLegend(capabilityWords)}</p>
      </div>
    </div>
  );
}
