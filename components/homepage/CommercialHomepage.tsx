import type { FoundationNavigationPaths } from '@/lib/foundation-navigation';
import { homeProcessAnchors } from '@/lib/site-routes';
import { resolveActionLink } from '@/components/foundation/content-types';
import type { HomePageContent } from './content-types';
import { HomeHero } from '@/components/foundation/HomeHero';
import { HomeProblems } from './HomeProblems';
import { HomeServices } from './HomeServices';
import { HomeAudiences } from './HomeAudiences';
import { HomeProof } from './HomeProof';
import { HomeProcess } from './HomeProcess';
import { HomeFounder } from './HomeFounder';
import { HomeCta } from './HomeCta';

interface CommercialHomepageProps {
  content: HomePageContent;
  paths: FoundationNavigationPaths;
}

export function CommercialHomepage({ content, paths }: CommercialHomepageProps) {
  const locale = content.locale;
  const problemsAction = resolveActionLink(content.problems.action, locale);
  const servicesAction = resolveActionLink(content.servicesSection.action, locale);
  const audiencesAction = resolveActionLink(content.audiences.action, locale);
  const proofAction = resolveActionLink(content.proof.action, locale);
  const processAction = resolveActionLink(content.process.action, locale);
  const founderPrimaryAction = resolveActionLink(content.founderSection.primaryAction, locale);
  const founderSecondaryAction = resolveActionLink(content.founderSection.secondaryAction, locale);
  const ctaAction = resolveActionLink(content.cta.primaryAction, locale);

  return (
    <>
      <HomeHero content={content} paths={paths} />
      <HomeProblems content={content.problems} actionHref={problemsAction.href} />
      <HomeServices content={content.servicesSection} actionHref={servicesAction.href} />
      <HomeAudiences content={content.audiences} actionHref={audiencesAction.href} />
      <HomeProof content={content.proof} actionHref={proofAction.href} />
      <HomeProcess content={content.process} anchorId={homeProcessAnchors[content.locale]} actionHref={processAction.href} />
      <HomeFounder content={content.founderSection} primaryActionHref={founderPrimaryAction.href} secondaryActionHref={founderSecondaryAction.href} />
      <HomeCta content={content.cta} actionHref={ctaAction.href} />
    </>
  );
}
