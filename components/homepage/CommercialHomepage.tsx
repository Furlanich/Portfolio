import { homeProcessAnchors } from '@/lib/site-routes';
import { resolveActionLink } from '@/components/foundation/content-types';
import type { HomePageContent } from './content-types';
import { ImmersiveHomeSequence } from './immersive/ImmersiveHomeSequence';
import { HomeProblems } from './HomeProblems';
import { HomeServices } from './HomeServices';
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
      <HomeProblems content={content.problems} actionHref={problemsAction.href} />
      <HomeServices content={content.servicesSection} actionHref={servicesAction.href} />
      <HomeProof content={content.proof} actionHref={proofAction.href} />
      <HomeProcess content={content.process} anchorId={homeProcessAnchors[content.locale]} actionHref={processAction.href} />
      <HomeFounder content={content.founderSection} actionHref={founderAction.href} />
      <HomeCta content={content.cta} actionHref={ctaAction.href} />
    </>
  );
}
