import { notFound } from 'next/navigation';
import GameGrid from '../../components/GameGrid';
import CategoryPill from '../../components/CategoryPill';
import DailyChallenge from '../../components/engagement/DailyChallenge';
import ProgressionPanel from '../../components/engagement/ProgressionPanel';
import AdSlot from '../../components/ads/AdSlot';
import JsonLd from '../../components/JsonLd';
import { siteConfig } from '../../data/site';
import { adPlacements } from '../../lib/ads';
import { getAllGames, getGameTranslation, isValidLocale } from '../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../lib/seo';

export function generateStaticParams() {
  return siteConfig.locales.filter((locale) => locale !== siteConfig.defaultLocale).map((locale) => ({ locale }));
}

export function generateMetadata({ params }) {
  if (!isValidLocale(params.locale) || params.locale === siteConfig.defaultLocale) {
    return buildPageMetadata({ title: 'Page not found', path: `/${params.locale}`, noIndex: true });
  }
  return buildPageMetadata({
    title: `${siteConfig.localeNames[params.locale]} Browser Games`,
    description: siteConfig.description,
    path: `/${params.locale}`
  });
}

export default function LocalisedHomePage({ params }) {
  if (!isValidLocale(params.locale) || params.locale === siteConfig.defaultLocale) notFound();
  const localePrefix = `/${params.locale}`;
  const games = getAllGames().map((game) => getGameTranslation(game, params.locale));

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, localePrefix)} />
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{siteConfig.localeNames[params.locale]} arcade</span>
          <h1>Fast games. Daily streaks. One more go.</h1>
          <p>
            A multilingual GR8 GAMZ landing layer, ready for translated collections, hreflang expansion and programmatic SEO growth.
          </p>
        </div>
        <aside className="hero-panel">
          <ProgressionPanel />
          <AdSlot placement={adPlacements.homeTop} compact />
        </aside>
      </section>

      <section aria-label="Game categories">
        <div className="category-row">
          {siteConfig.categories.map((category) => (
            <CategoryPill key={category.id} category={category} localePathPrefix={localePrefix} />
          ))}
        </div>
      </section>

      <section id="games">
        <div className="section-heading">
          <div>
            <span>Translated game hub</span>
            <h2>Choose your next game.</h2>
          </div>
        </div>
        <GameGrid games={games} localePathPrefix={localePrefix} />
      </section>
      <DailyChallenge />
    </main>
  );
}
