import Link from 'next/link';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import CompactPagination from '@/components/CompactPagination';
import RegistryGameCard from '@/components/RegistryGameCard';
import { getRelatedPseoIntents, pseoIntentPath } from '@/lib/pseoIntents';
import type { PseoPageData } from '@/lib/pseoPages';

export function PseoIntentDirectory({ data }: { data: PseoPageData }) {
  const { intent, games, count, page, totalPages } = data;
  const related = getRelatedPseoIntents(intent);
  const splitIndex = Math.min(24, Math.ceil(games.length / 2));
  const firstGames = games.slice(0, splitIndex);
  const remainingGames = games.slice(splitIndex);
  const supportsThreeAds = games.length >= 12;

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span>
        {page > 1 ? (
          <><Link href={pseoIntentPath(intent.slug)}>{intent.primaryKeyword}</Link><span>/</span><span aria-current="page">Page {page}</span></>
        ) : <span aria-current="page">{intent.primaryKeyword}</span>}
      </nav>

      <section className="game-hub-hero" aria-labelledby={`${intent.slug}-title`}>
        <span className="eyebrow">Focused game collection</span>
        <h1 id={`${intent.slug}-title`}>{page === 1 ? intent.h1 : `${intent.primaryKeyword} - page ${page}`}</h1>
        <p>{page === 1 ? intent.introduction : `Continue through the same verified ${intent.primaryKeyword} collection. This is page ${page} of ${totalPages}.`}</p>
        <dl className="game-hub-summary">
          <div><dt>Playable matches</dt><dd>{count.toLocaleString('en-GB')}</dd></div>
          <div><dt>Collection page</dt><dd>{page} of {totalPages}</dd></div>
          <div><dt>Browse all games</dt><dd><Link href="/games">Game directory</Link></dd></div>
        </dl>
      </section>

      {page === 1 ? (
        <section className="game-hub-guide" aria-labelledby={`${intent.slug}-guide`}>
          <div>
            <span className="eyebrow">What is in this collection?</span>
            <h2 id={`${intent.slug}-guide`}>Ways to start playing</h2>
            <ul>{intent.playStyles.map((style) => <li key={style}>{style}</li>)}</ul>
          </div>
          <div>
            <h2>How games qualify</h2>
            <p>{intent.selectionNote}</p>
            {intent.topSignals.examples.length ? <p className="fine-print">Current examples include {intent.topSignals.examples.slice(0, 4).join(', ')}.</p> : null}
          </div>
          <div>
            <h2>Device and controls</h2>
            <p>{intent.deviceGuidance}</p>
            <p>{intent.controlsGuidance}</p>
          </div>
          <div>
            <h2>Choose a session</h2>
            <p>{intent.sessionGuidance}</p>
          </div>
        </section>
      ) : null}

      {supportsThreeAds ? <AdSensePlacement placement="discovery-upper-content" /> : null}
      <section className="game-grid" aria-label={`${intent.primaryKeyword}, page ${page}, first group`}>
        {firstGames.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 8} />)}
      </section>
      {supportsThreeAds ? <AdSensePlacement placement="discovery-mid-content" /> : null}
      {remainingGames.length ? (
        <section className="game-grid" aria-label={`${intent.primaryKeyword}, page ${page}, second group`}>
          {remainingGames.map((game) => <RegistryGameCard key={game.id} game={game} />)}
        </section>
      ) : null}
      {supportsThreeAds ? <AdSensePlacement placement="discovery-lower-content" /> : null}

      <CompactPagination
        currentPage={page}
        totalPages={totalPages}
        previousHref={page > 1 ? pseoIntentPath(intent.slug, page - 1) : undefined}
        nextHref={page < totalPages ? pseoIntentPath(intent.slug, page + 1) : undefined}
        ariaLabel={`${intent.primaryKeyword} catalogue pages`}
      />

      {page === 1 && related.length ? (
        <section className="game-hub-related" aria-labelledby={`${intent.slug}-related`}>
          <span className="eyebrow">Keep browsing</span>
          <h2 id={`${intent.slug}-related`}>Related game collections</h2>
          <div className="compact-link-list">
            {related.map((candidate) => (
              <Link key={candidate.slug} href={pseoIntentPath(candidate.slug)}>
                <strong>{candidate.primaryKeyword}</strong>
                <span>{candidate.inventoryCount.toLocaleString('en-GB')} matching games</span>
              </Link>
            ))}
            {intent.parentCategory && intent.parentCategory !== 'games' ? (
              <Link href={`/categories/${intent.parentCategory}`}>
                <strong>{intent.parentCategory.charAt(0).toUpperCase() + intent.parentCategory.slice(1)} games</strong>
                <span>Browse the wider category</span>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}

export default PseoIntentDirectory;
