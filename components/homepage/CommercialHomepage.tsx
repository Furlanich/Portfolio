import { homeProcessAnchors } from '@/lib/site-routes';
import { resolveActionLink } from '@/components/foundation/content-types';
import type { HomePageContent } from './content-types';
import { ImmersiveHomeSequence } from './immersive/ImmersiveHomeSequence';
import { HomeProblems } from './HomeProblems';
import { HomeServices } from './HomeServices';
import { HomeImpact } from './HomeImpact';
import { HomeProof } from './HomeProof';
import { HomeProcess } from './HomeProcess';
import { HomeFounder } from './HomeFounder';
import { HomeCta } from './HomeCta';

interface CommercialHomepageProps {
  content: HomePageContent;
}

export function CommercialHomepage({ content }: CommercialHomepageProps) {
  const locale = content.locale;
  const problemsAction = resolveActionLink(content.problems.action, locale);
  const servicesAction = resolveActionLink(content.servicesSection.action, locale);
  const proofAction = resolveActionLink(content.proof.action, locale);
  const processAction = resolveActionLink(content.process.action, locale);
  const founderAction = resolveActionLink(content.founderSection.action, locale);
  const ctaAction = resolveActionLink(content.cta.primaryAction, locale);

  return (
    <>
      <ImmersiveHomeSequence content={content} />
      <HomeProblems content={content.problems} readout={content.readout.problems} actionHref={problemsAction.href} />
      <HomeServices content={content.servicesSection} readout={content.readout.services} actionHref={servicesAction.href} />
      <HomeImpact content={content.impact} readout={content.readout.impact} />
      <HomeProof content={content.proof} readout={content.readout.proof} actionHref={proofAction.href} />
      <HomeProcess
        content={content.process}
        anchorId={homeProcessAnchors[content.locale]}
        readout={content.readout.process}
        actionHref={processAction.href}
      />
      <HomeFounder content={content.founderSection} readout={content.readout.founder} actionHref={founderAction.href} />
      <HomeCta content={content.cta} readout={content.readout.contact} actionHref={ctaAction.href} />
    </>
  );
}
