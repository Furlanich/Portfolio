import type { ServicesPageContent } from './content-types';
import styles from './services.module.css';

interface ServicesPrinciplesProps {
  content: ServicesPageContent['principles'];
  commercialBoundaries: ServicesPageContent['commercialBoundaries'];
  aiNote: ServicesPageContent['aiNote'];
  anchor: string;
}

const BODY = 'mt-3 max-w-[68ch] text-base leading-7 text-sky-text-2';
const GROUP_HEADING = 'text-lg font-bold leading-7 text-identity-bone';

/**
 * The complete working boundaries (DESIGN-SPF-V1, "Services hierarchy and wording"): the three
 * working principles, then the shared working agreement, the complete Límites comerciales /
 * Commercial boundaries block and the AI/ERP note with its explicit chatbot-and-agent scope sentence.
 * All of it is ordinary visible HTML: no accordion, tooltip or reveal. The id is the stable
 * `condiciones` / `working-boundaries` fragment that each chapter links to.
 */
export function ServicesPrinciples({ content, commercialBoundaries, aiNote, anchor }: ServicesPrinciplesProps) {
  return (
    <section
      id={anchor}
      aria-labelledby="services-principles-heading"
      data-connected-reading-mask
      data-connected-chapter="working-boundaries"
      className={`${styles.plate} ${styles.chapter} p-5 md:p-8 lg:p-10`}
    >
      <h2
        id="services-principles-heading"
        className="max-w-[20ch] text-[32px] font-bold leading-[1.06] tracking-[-0.025em] text-identity-bone md:text-[40px] lg:text-[44px]"
      >
        {content.heading}
      </h2>

      <div className="mt-8 md:mt-10">
        {content.statements.map((statement) => (
          <div key={statement} className={styles.principle}>
            <p className="max-w-[62ch] text-lg leading-8 text-identity-bone">{statement}</p>
          </div>
        ))}

        <div className={styles.principle}>
          <h3 className={GROUP_HEADING}>{content.workingHeading}</h3>
          <p className={BODY}>{content.workingAgreement}</p>
        </div>

        <div className={styles.principle}>
          <h3 className={GROUP_HEADING}>{commercialBoundaries.heading}</h3>
          <p className={BODY}>{commercialBoundaries.description}</p>
          <ul className={`${BODY} list-disc pl-5 marker:text-sky-lit`}>
            {commercialBoundaries.items.map((item) => <li key={item} className="mt-2">{item}</li>)}
          </ul>
        </div>

        <div className={styles.principle}>
          <h3 className={GROUP_HEADING}>{aiNote.heading}</h3>
          <p className={BODY}>{aiNote.description}</p>
          <p className={BODY}>{aiNote.managementScope}</p>
          <p className={BODY}>{aiNote.scope}</p>
        </div>
      </div>
    </section>
  );
}
