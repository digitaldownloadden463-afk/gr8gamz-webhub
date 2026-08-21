import Link from 'next/link';
import { ArrowRight, Headphones, MousePointer2, Smartphone } from 'lucide-react';
import { contextualGearCopy, contextualGearRecommendation } from '@/lib/commerce/contextualGear';
import type { Locale } from '@/lib/i18n';

export default function GearContextModule({ category, controls, deviceFit, locale = 'en' }: { category?: string; controls?: string; deviceFit?: string; locale?: Locale }) {
  const recommendation = contextualGearRecommendation({ category, controls, deviceFit });
  const copy = contextualGearCopy(locale);
  const Icon = recommendation.kind === 'mobile' ? Smartphone : recommendation.kind === 'communication' ? Headphones : MousePointer2;
  return (
    <aside className="gear-context" aria-label={copy.aria} data-recommendation-kind={recommendation.kind}>
      <Icon aria-hidden="true" />
      <div><span className="eyebrow">{copy.eyebrow}</span><h2>{copy.title}</h2><p>{copy.description}</p><small>{copy.disclosure}</small></div>
      <Link href={recommendation.href} className="secondary-cta">{copy.cta} <ArrowRight size={17} aria-hidden="true" /></Link>
    </aside>
  );
}
