import Link from 'next/link';
import { CalendarCheck, ChevronDown } from 'lucide-react';
import RegistryGameCard from '@/components/RegistryGameCard';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import CompactPagination from '@/components/CompactPagination';
import {
  categorySelectionCriteria,
  categorySelectionLabels,
  type CategoryEditorialRecord,
  type CategorySelectionLabel
} from '@/lib/categoryEditorial';
import { categoryDisplayName, categoryPagePath } from '@/lib/categoryPages';
import { getRegistryGamesBySlugs, type RegistryGame } from '@/lib/gameRegistry';
import { gameHubPath, getActiveGameHubs } from '@/lib/gameHubs';

type CategoryDirectoryProps = {
  category: { slug: string; name: string; count: number };
  games: RegistryGame[];
  page: number;
  totalPages: number;
  editorial?: CategoryEditorialRecord;
  reviewedAt?: string;
};

function formatReviewedDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

function CategoryEditorialDetails({ editorial, reviewedAt }: { editorial: CategoryEditorialRecord; reviewedAt: string }) {
  const originals = getRegistryGamesBySlugs(editorial.originalSlugs).filter((game) => game.source === 'gr8-originals');
  const usedLabels = new Set<CategorySelectionLabel>(editorial.editorialPicks.flatMap((pick) => pick.labels));
  usedLabels.add('popular-on-gr8');
  const specialistHubs = getActiveGameHubs().filter((hub) => hub.parentCategory === editorial.slug);

  return (
    <section className="category-editorial" aria-labelledby={`${editorial.slug}-guide-title`}>
      <div className="category-editorial__heading">
        <span className="eyebrow">Category guide</span>
        <h2 id={`${editorial.slug}-guide-title`}>Find the right {editorial.name.toLowerCase()} game</h2>
        <p>{editorial.distinction}</p>
      </div>

      <div className="category-editorial__grid">
        <section aria-labelledby={`${editorial.slug}-styles-title`}>
          <h3 id={`${editorial.slug}-styles-title`}>Play styles in this category</h3>
          <dl className="category-editorial__definitions">
            {editorial.subgenres.map((subgenre) => (
              <div key={subgenre.name}>
                <dt>{subgenre.name}</dt>
                <dd>{subgenre.description}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-labelledby={`${editorial.slug}-choose-title`}>
          <h3 id={`${editorial.slug}-choose-title`}>How to choose</h3>
          <ul className="category-editorial__list">
            {editorial.choosing.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </div>

      <section className="category-fit" aria-labelledby={`${editorial.slug}-fit-title`}>
        <h3 id={`${editorial.slug}-fit-title`}>Device, controls and session fit</h3>
        <dl>
          <div><dt>Device</dt><dd>{editorial.deviceGuidance}</dd></div>
          <div><dt>Controls</dt><dd>{editorial.controlsGuidance}</dd></div>
          <div><dt>Session length</dt><dd>{editorial.sessionGuidance}</dd></div>
        </dl>
      </section>

      {originals.length ? (
        <section aria-labelledby={`${editorial.slug}-originals-title`}>
          <h3 id={`${editorial.slug}-originals-title`}>GR8 Originals in {editorial.name}</h3>
          <p>These games are built and published by GR8 GAMZ. The wider catalogue also includes GR8 Select titles from external game providers.</p>
          <ul className="category-link-list">
            {originals.map((game) => <li key={game.id}><Link href={game.url}>{game.title}</Link></li>)}
          </ul>
        </section>
      ) : (
        <section aria-labelledby={`${editorial.slug}-originals-title`}>
          <h3 id={`${editorial.slug}-originals-title`}>GR8 Originals in {editorial.name}</h3>
          <p>There is not currently a published GR8 Original in this category. The games above are clearly presented as GR8 Select titles.</p>
        </section>
      )}

      <section className="category-pathways" aria-labelledby={`${editorial.slug}-related-title`}>
        <h3 id={`${editorial.slug}-related-title`}>Related ways to browse</h3>
        <nav aria-label={`Categories related to ${editorial.name}`}>
          {editorial.relatedCategorySlugs.map((slug) => (
            <Link key={slug} href={categoryPagePath(slug)}>{categoryDisplayName(slug, slug)} games</Link>
          ))}
        </nav>
        {specialistHubs.length ? (
          <nav aria-label={`Specialist collections related to ${editorial.name}`}>
            {specialistHubs.map((hub) => <Link key={hub.id} href={gameHubPath(hub.slug)}>{hub.label}</Link>)}
          </nav>
        ) : null}
        {editorial.gearGuide ? (
          <aside className="category-gear-link" aria-label="Optional gaming gear guide">
            <span>Optional setup guide</span>
            <Link href={editorial.gearGuide.path}>{editorial.gearGuide.label}</Link>
            <p>{editorial.gearGuide.description}</p>
          </aside>
        ) : null}
      </section>

      <details className="category-methodology">
        <summary><ChevronDown size={18} aria-hidden="true" /> How category labels are selected</summary>
        <p>Labels describe catalogue evidence and editorial fit. They are not community ratings.</p>
        <dl>
          {[...usedLabels].map((label) => (
            <div key={label}>
              <dt>{categorySelectionLabels[label]}</dt>
              <dd>{categorySelectionCriteria[label]}</dd>
            </div>
          ))}
        </dl>
      </details>

      <p className="category-reviewed"><CalendarCheck size={18} aria-hidden="true" /> Catalogue and editorial choices checked <time dateTime={reviewedAt}>{formatReviewedDate(reviewedAt)}</time>.</p>
    </section>
  );
}

export default function CategoryDirectory({ category, games, page, totalPages, editorial, reviewedAt = '2026-08-22' }: CategoryDirectoryProps) {
  const basePath = categoryPagePath(category.slug);
  const pagePath = (value: number) => categoryPagePath(category.slug, value);
  const name = editorial?.name || categoryDisplayName(category.slug, category.name);
  const picks = editorial
    ? getRegistryGamesBySlugs(editorial.editorialPicks.map((pick) => pick.slug))
        .map((game) => ({ game, pick: editorial.editorialPicks.find((item) => item.slug === game.slug)! }))
    : [];
  const supportsThreeAds = games.length >= 12;
  const splitIndex = Math.min(24, Math.ceil(games.length / 2));
  const firstGames = games.slice(0, splitIndex);
  const remainingGames = games.slice(splitIndex);

  return (
    <>
      <nav className="breadcrumb category-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span>
        {page > 1 ? <><Link href={basePath}>{name}</Link><span>/</span><span aria-current="page">Page {page}</span></> : <span aria-current="page">{name}</span>}
      </nav>

      {page === 1 && editorial ? (
        <section className="category-authority-hero" aria-labelledby={`${category.slug}-title`}>
          <span className="eyebrow">{editorial.name} games</span>
          <h1 id={`${category.slug}-title`}>{editorial.h1}</h1>
          <p>{editorial.introduction}</p>
          <div className="category-starts" aria-label={`Editor's picks for ${editorial.name}`}>
            <strong>Three ways to start</strong>
            <ul>
              {picks.map(({ game, pick }) => (
                <li key={game.id}>
                  <Link href={game.url}>{game.title}</Link>
                  <span>{pick.labels.map((label) => categorySelectionLabels[label]).join(' | ')}</span>
                  <small>{pick.rationale}</small>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="page-title category-page-title">
          <span className="eyebrow">{page === 1 ? 'Category' : `${name} catalogue`}</span>
          <h1>{page === 1 ? `${category.slug === 'arcade' ? 'Free ' : ''}${name.toLowerCase()} games online` : `${name} games - page ${page}`}</h1>
          <p>{page === 1
            ? `Play ${category.count.toLocaleString('en-GB')} ${name.toLowerCase()} games from GR8 Originals and GR8 Select.`
            : `Browse ${games.length} games on page ${page} of ${totalPages}. Every game shown below links directly to its canonical profile.`}</p>
        </section>
      )}

      {supportsThreeAds ? <AdSensePlacement placement="discovery-upper-content" /> : null}

      <section className="game-grid" aria-label={`${name} games, page ${page}, first group`}>
        {firstGames.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 8} />)}
      </section>

      {supportsThreeAds ? <AdSensePlacement placement="discovery-mid-content" /> : null}

      {remainingGames.length ? (
        <section className="game-grid" aria-label={`${name} games, page ${page}, second group`}>
          {remainingGames.map((game) => <RegistryGameCard key={game.id} game={game} />)}
        </section>
      ) : null}

      {supportsThreeAds ? <AdSensePlacement placement="discovery-lower-content" /> : null}

      <CompactPagination
        currentPage={page}
        totalPages={totalPages}
        previousHref={page > 1 ? pagePath(page - 1) : undefined}
        nextHref={page < totalPages ? pagePath(page + 1) : undefined}
        ariaLabel={`${name} game pages`}
      />

      {page === 1 && editorial ? <CategoryEditorialDetails editorial={editorial} reviewedAt={reviewedAt} /> : null}
    </>
  );
}
