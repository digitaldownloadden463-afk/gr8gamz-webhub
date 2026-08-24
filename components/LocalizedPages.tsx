import Link from 'next/link';
import { ArrowRight, Gamepad2, ShieldCheck, Sparkles, Star } from 'lucide-react';
import ChallengeShare from '@/components/ChallengeShare';
import GameShare from '@/components/GameShare';
import LocalizedGameCard from '@/components/LocalizedGameCard';
import PartnerArtwork from '@/components/PartnerArtwork';
import PartnerPlayClient from '@/components/PartnerPlayClient';
import type { RegistryGame } from '@/lib/gameRegistry';
import { getRegistryCategories, getRegistryGameBySlug, slugifyRegistryValue } from '@/lib/gameRegistry';
import { categoryName, localeInfo, localizedCanonical, pathForLocale, tr, type Locale } from '@/lib/i18n';
import { getGlobalLaunchGames, getLocalizedGameText } from '@/lib/globalLaunch';
import { getPartnerGameProfile, getRelatedPartnerGameProfiles } from '@/src/data/partnerGameProfiles';
import GearContextModule from '@/components/commerce/GearContextModule';
import PartnerProfileAnalytics from '@/components/PartnerProfileAnalytics';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import CompactPagination from '@/components/CompactPagination';

const pageSize = 48;

export function localizedRelated(game: RegistryGame, limit = 6) {
  const launch = getGlobalLaunchGames();
  const same = launch.filter((item) => item.slug !== game.slug && item.category === game.category);
  const other = launch.filter((item) => item.slug !== game.slug && item.category !== game.category);
  return [...same, ...other].slice(0, limit);
}

export function LocalizedHomePage({ locale }: { locale: Locale }) {
  const text = tr(locale);
  const info = localeInfo(locale);
  const launch = getGlobalLaunchGames();
  const featured = launch.slice(0, 12);
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GR8 GAMZ',
    url: localizedCanonical(locale, '/'),
    inLanguage: locale
  };

  return (
    <main lang={locale} dir={info.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <nav className="home-play-menu" aria-label={text.hubs.launchTitle}>
        <Link href={pathForLocale(locale, '/gr8-originals')}><Gamepad2 size={18} aria-hidden="true" /> {text.nav.originals}</Link>
        <Link href={pathForLocale(locale, '/gr8-select')}><Star size={18} aria-hidden="true" /> {text.nav.select}</Link>
        <Link href={pathForLocale(locale, '/my-arcade')}><ShieldCheck size={18} aria-hidden="true" /> {text.nav.arcade}</Link>
      </nav>
      <section className="hero hero--home">
        <div className="hero__motion" aria-hidden="true"><span /><span /><span /></div>
        <div className="hero__content">
          <span className="eyebrow"><Sparkles size={18} aria-hidden="true" /> {text.home.eyebrow}</span>
          <h1>{text.home.title}</h1>
          <p>{text.home.intro}</p>
          <div className="cta-row">
            <Link href={pathForLocale(locale, '/gr8-originals')} className="cta"><Gamepad2 size={20} aria-hidden="true" /> {text.home.originalsCta}</Link>
            <Link href={pathForLocale(locale, '/gr8-select')} className="secondary-cta"><ArrowRight size={20} aria-hidden="true" /> {text.home.selectCta}</Link>
          </div>
          <div className="hero__stats" aria-label="GR8 GAMZ">
            <span className="hero-stat"><strong>26</strong><span>{text.nav.originals}</span></span>
            <span className="hero-stat"><strong>226</strong><span>{text.hubs.launchTitle}</span></span>
            <span className="hero-stat hero-stat--wide"><strong>12</strong><span>locales</span></span>
          </div>
        </div>
      </section>
      <AdSensePlacement placement="home-upper-content" />
      <section className="value-grid" aria-label={text.hubs.gamesTitle}>
        <article><Gamepad2 aria-hidden="true" /><strong>{text.home.fast}</strong><span>{text.hubs.gamesIntro}</span></article>
        <article><ShieldCheck aria-hidden="true" /><strong>{text.home.privacy}</strong><span>{text.profile.external}</span></article>
        <article><Star aria-hidden="true" /><strong>{text.home.browse}</strong><span>{text.hubs.launchIntro}</span></article>
      </section>
      <AdSensePlacement placement="home-mid-content" />
      <section className="section-heading">
        <span className="eyebrow">{text.hubs.launchTitle}</span>
        <h2>{text.hubs.gamesTitle}</h2>
        <Link href={pathForLocale(locale, '/gr8-select')}>{text.common.details} <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
      <section className="game-grid">
        {featured.map((game, index) => <LocalizedGameCard key={game.id} game={game} locale={locale} priority={index < 12} />)}
      </section>
      <AdSensePlacement placement="home-lower-content" />
    </main>
  );
}

export function LocalizedCollectionPage({ locale, page = 1, categorySlug, source }: { locale: Locale; page?: number; categorySlug?: string; source?: RegistryGame['source'] }) {
  const text = tr(locale);
  const info = localeInfo(locale);
  const launch = getGlobalLaunchGames().filter((game) => (!categorySlug || slugifyRegistryValue(game.category) === categorySlug) && (!source || game.source === source));
  const totalPages = Math.max(1, Math.ceil(launch.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const games = launch.slice((safePage - 1) * pageSize, safePage * pageSize);
  const category = categorySlug ? getRegistryCategories(1).find((item) => item.slug === categorySlug) : null;
  const basePath = categorySlug ? `/categories/${categorySlug}` : (source === 'gr8-originals' ? '/gr8-originals' : '/gr8-select');
  const supportsThreeAds = games.length >= 12;
  const splitIndex = Math.min(24, Math.ceil(games.length / 2));
  const firstGames = games.slice(0, splitIndex);
  const remainingGames = games.slice(splitIndex);

  return (
    <main lang={locale} dir={info.dir}>
      <section className="page-title">
        <span className="eyebrow">{category ? categoryName(locale, category.name) : text.hubs.launchTitle}</span>
        <h1>{category ? `${categoryName(locale, category.name)} ${text.hubs.categoryTitle}` : (source === 'gr8-originals' ? text.hubs.originalsTitle : text.hubs.selectTitle)}</h1>
        <p>{category ? text.hubs.gamesIntro : (source === 'gr8-originals' ? text.hubs.gamesIntro : text.hubs.selectIntro)}</p>
      </section>
      {supportsThreeAds ? <AdSensePlacement placement="discovery-upper-content" /> : null}
      <section className="game-grid" aria-label={`${text.common.page} ${safePage}, 1`}>
        {firstGames.map((game, index) => <LocalizedGameCard key={game.id} game={game} locale={locale} priority={index < 8} />)}
      </section>
      {supportsThreeAds ? <AdSensePlacement placement="discovery-mid-content" /> : null}
      {remainingGames.length ? <section className="game-grid" aria-label={`${text.common.page} ${safePage}, 2`}>{remainingGames.map((game) => <LocalizedGameCard key={game.id} game={game} locale={locale} />)}</section> : null}
      {supportsThreeAds ? <AdSensePlacement placement="discovery-lower-content" /> : null}
      <CompactPagination
        currentPage={safePage}
        totalPages={totalPages}
        previousHref={safePage > 1 ? pathForLocale(locale, safePage === 2 ? basePath : `${basePath}/page/${safePage - 1}`) : undefined}
        nextHref={safePage < totalPages ? pathForLocale(locale, `${basePath}/page/${safePage + 1}`) : undefined}
        previousLabel={text.common.previous}
        nextLabel={text.common.next}
        pageLabel={text.common.page}
        ofLabel={text.common.of}
        ariaLabel={text.common.page}
      />
    </main>
  );
}

export function LocalizedGameProfile({ locale, game }: { locale: Locale; game: RegistryGame }) {
  const text = tr(locale);
  const info = localeInfo(locale);
  const copy = getLocalizedGameText(game, locale, text.profile);
  const related = localizedRelated(game, 6);
  const playPath = pathForLocale(locale, game.playUrl);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: copy.description,
    url: localizedCanonical(locale, game.url),
    image: game.artwork,
    gamePlatform: 'Web browser',
    genre: copy.category,
    inLanguage: locale,
    isAccessibleForFree: true
  };

  return (
    <main lang={locale} dir={info.dir}>
      {game.source === 'gr8-select' ? <PartnerProfileAnalytics slug={game.slug} provider={getPartnerGameProfile(game.slug)?.provider === 'gamemonetize' ? 'gamemonetize' : 'gamepix'} locale={locale} /> : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href={pathForLocale(locale, '/')}>{text.nav.home}</Link>
        <span>/</span>
        <Link href={pathForLocale(locale, '/gr8-select')}>{text.hubs.launchTitle}</Link>
        <span>/</span>
        <span>{game.title}</span>
      </nav>
      <section className="partner-profile-hero">
        <div className="partner-profile-copy">
          <span className="eyebrow">{copy.category}</span>
          <h1>{game.title}</h1>
          <p>{copy.description}</p>
          <div className="cta-row profile-cta-row">
            <Link href={playPath} className="cta">{text.common.play}</Link>
            <Link href={pathForLocale(locale, `/categories/${slugifyRegistryValue(game.category)}`)} className="secondary-cta">{copy.category}</Link>
          </div>
        </div>
        <PartnerArtwork src={game.artwork} title={game.title} category={copy.category} priority variant="profile" sizes="(max-width: 900px) 92vw, 640px" />
        <dl className="fact-list profile-facts">
          <div><dt>{text.common.officialTitle}</dt><dd>{game.title}</dd></div>
          <div><dt>{text.common.category}</dt><dd>{copy.category}</dd></div>
          <div><dt>{text.common.bestFor}</dt><dd>{copy.fit}</dd></div>
          <div><dt>{text.common.controls}</dt><dd>{copy.controls}</dd></div>
        </dl>
      </section>
      <section className="content-panel">
        <h2>{text.profile.why.replace('{fit}', copy.fit).replace('{title}', game.title).replace('{category}', copy.category)}</h2>
        <p>{copy.tips}</p>
        <p className="fine-print">{copy.external}</p>
      </section>
      <GameShare title={game.title} url={localizedCanonical(locale, game.url)} text={copy.description} labels={text.engagement} />
      {game.source === 'gr8-select' ? <ChallengeShare gameSlug={game.slug} gameTitle={game.title} kind="select" locale={locale} labels={text.engagement} /> : null}
      {game.source === 'gr8-select' ? <GearContextModule category={game.category} controls={copy.controls} deviceFit={copy.fit} locale={locale} /> : null}
      <section className="section-heading">
        <span className="eyebrow">{text.common.related}</span>
        <h2>{text.common.related}.</h2>
      </section>
      <section className="game-grid">
        {related.map((item) => <LocalizedGameCard key={item.id} game={item} locale={locale} />)}
      </section>
    </main>
  );
}

export function LocalizedPartnerPlayPage({ locale, slug }: { locale: Locale; slug: string }) {
  const text = tr(locale);
  const info = localeInfo(locale);
  const profile = getPartnerGameProfile(slug);
  if (!profile) return null;
  const related = getRelatedPartnerGameProfiles(profile, 4, {
    excludeProvider: profile.provider === 'gamemonetize' ? 'gamemonetize' : ''
  });
  const localizedProfilePath = pathForLocale(locale, profile.path);

  return (
    <main lang={locale} dir={info.dir} className="partner-play-page">
      <Link href={localizedProfilePath} className="text-link">{text.common.previous}</Link>
      <section className="page-title">
        <span className="eyebrow">{text.nav.select}</span>
        <h1>{text.common.play} {profile.title}</h1>
        <p>{text.profile.external}</p>
      </section>
      <PartnerPlayClient
        title={profile.title}
        profilePath={localizedProfilePath}
        image={profile.image}
        playUrl={profile.playUrl || ''}
        width={profile.width || 960}
        height={profile.height || 540}
        provider={profile.provider === 'gamemonetize' ? 'gamemonetize' : 'gamepix'}
        locale={locale}
        labels={text.engagement}
      />
      <section className="section-heading">
        <span className="eyebrow">{text.common.related}</span>
        <h2>{text.common.related}.</h2>
      </section>
      <section className="partner-grid">
        {related.map((item) => {
          const game = getRegistryGameBySlug(item.slug, 'gr8-select');
          return game ? <LocalizedGameCard key={game.id} game={game} locale={locale} /> : null;
        })}
      </section>
    </main>
  );
}
