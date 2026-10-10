import Link from 'next/link';
import type { ServicesPageContent } from './content-types';
import styles from './services.module.css';

interface ServicesFinalCtaProps {
  content: ServicesPageContent['finalCta'];
  actionHref: string;
}

export function ServicesFinalCta({ content, actionHref }: ServicesFinalCtaProps) {
  return (
    <section
      id="cta"
      aria-labelledby="services-cta-heading"
      data-connected-reading-mask
      data-connected-chapter="final-action"
      className={`${styles.plate} p-5 md:p-8 lg:p-10`}
    >
      <div className="max-w-[68ch]">
        <h2
          id="services-cta-heading"
          className="max-w-[20ch] text-[32px] font-bold leading-[1.06] tracking-[-0.025em] text-identity-bone md:text-[40px] lg:text-[44px]"
        >
          {content.heading}
        </h2>
        <p className="mt-5 text-lg leading-8 text-sky-text-2 lg:text-xl">{content.description}</p>
        <Link
          href={actionHref}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-identity-azure px-6 text-base font-semibold text-identity-bone transition-colors duration-[160ms] ease-out hover:bg-sky-lit hover:text-identity-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-sky-glow max-[479px]:w-full"
        >
          {content.action.label}
        </Link>
      </div>
    </section>
  );
}
