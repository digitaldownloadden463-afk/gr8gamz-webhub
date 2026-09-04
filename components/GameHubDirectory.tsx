import Link from 'next/link';
import { CalendarCheck, Compass, Gamepad2 } from 'lucide-react';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import GameHubPagination from '@/components/GameHubPagination';
import GameHubGameCard from '@/components/GameHubGameCard';
import GameHubLink from '@/components/GameHubLink';
import GameHubViewTracker from '@/components/GameHubViewTracker';
import { gameHubParentPath, type GameHubPageData } from '@/lib/gameHubPages';
import { gameHubPath, gameHubReviewedAt, getRelatedGameHubs } from '@/lib/gameHubs';

function reviewedDate() {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${gameHubReviewedAt}T00:00:00Z`));
}

export default function GameHubDirectory({ data }: { data: GameHubPageData }) {
  const { hub, games, count, page, totalPages } = data;
  const splitIndex = Math.min(24, Math.ceil(games.length / 2));
  const firstGames = games.slice(0, splitIndex);
  const remainingGames = games.slice(splitIndex);
  const relatedHubs = getRelatedGameHubs(hub);
  const supportsThreeAds = games.length >= 12;

  return (
    <>
      <GameHubViewTracker hubId={hub.id} parentCategory={hub.parentCategory} pageNumber={page} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span>
        {page > 1 ? <><Link href={gameHubPath(hub.slug)}>{hub.label}</Link><span>/</span><span aria-current="page">Page {page}</span></> : <span aria-current="page">{hub.label}</span>}
      </nav>

      <section className="game-hub-hero" aria-labelledby={`${hub.id}-hub-title`}>
        <span className="eyebrow"><Gamepad2 size={18} aria-hidden="true" /> {page === 1 ? 'Game collection' : `${hub.label} catalogue`}</span>
        <h1 id={`${hub.id}-hub-title`}>{page === 1 ? hub.h1 : `${hub.label} - page ${page}`}</h1>
        <p>{page === 1 ? hub.introduction : `Browse page ${page} of ${totalPages}. Every card links to a canonical game profile with controls and a deliberate Play step.`}</p>
        <dl className="game-hub-summary">
          <div><dt>Playable games</dt><dd>{count.toLocaleString('en-GB')}</dd></div>
          <div><dt>Parent category</dt><dd><Link href={gameHubParentPath(hub)}>{hub.parentCategory} games</Link></dd></div>
          <div><dt>Catalogue page</dt><dd>{page} of {totalPages}</dd></div>
        </dl>
      </section>

      {page === 1 ? (
        <section className="game-hub-guide" aria-labelledby={`${hub.id}-guide-title`}>
          <div>
            <span className="eyebrow"><Compass size={18} aria-hidden="true" /> Choose a play style</span>
            <h2 id={`${hub.id}-guide-title`}>What you can find here</h2>
            <ul>{hub.playStyles.map((style) => <li key={style}>{style}</li>)}</ul>
          </div>
          <div>
            <h2>How this collection is selected</h2>
            <p>{hub.selectionNote}</p>
            <p className="fine-print"><CalendarCheck size={17} aria-hidden="true" /> Matching rules and catalogue evidence reviewed <time dateTime={gameHubReviewedAt}>{reviewedDate()}</time>.</p>
          </div>
          <div>
            <h2>Device and controls</h2>
            <p>{hub.deviceGuidance}</p>
            <p>{hub.controlsGuidance}</p>
          </div>
          <div>
            <h2>Choose a session length</h2>
            <p>{hub.sessionGuidance}</p>
          </div>
        </section>
      ) : null}

      {supportsThreeAds ? <AdSensePlacement placement="discovery-upper-content" /> : null}
      <section className="game-grid" aria-label={`${hub.label}, page ${page}, first group`}>
        {firstGames.map((game, index) => <GameHubGameCard key={game.id} game={game} hubId={hub.id} priority={index < 8} />)}
      </section>
      {supportsThreeAds ? <AdSensePlacement placement="discovery-mid-content" /> : null}
      {remainingGames.length ? (
        <section className="game-grid" aria-label={`${hub.label}, page ${page}, second group`}>
          {remainingGames.map((game) => <GameHubGameCard key={game.id} game={game} hubId={hub.id} />)}
        </section>
      ) : null}
      {supportsThreeAds ? <AdSensePlacement placement="discovery-lower-content" /> : null}

      <GameHubPagination
        hubId={hub.id}
        currentPage={page}
        totalPages={totalPages}
        previousHref={page > 1 ? gameHubPath(hub.slug, page - 1) : undefined}
        nextHref={page < totalPages ? gameHubPath(hub.slug, page + 1) : undefined}
      />

      {page === 1 ? (
        <section className="game-hub-related" aria-labelledby={`${hub.id}-related-title`}>
          <span className="eyebrow">Keep browsing</span>
          <h2 id={`${hub.id}-related-title`}>Related game collections</h2>
          <div className="compact-link-list">
            {relatedHubs.map((related) => (
              <GameHubLink key={related.id} href={gameHubPath(related.slug)} hubId={related.id} sourceSurface={`hub-${hub.id}`}>
                <strong>{related.label}</strong><span>{related.primaryKeyword}</span>
              </GameHubLink>
            ))}
            {hub.relatedCategorySlugs.map((slug) => (
              <Link key={slug} href={`/categories/${slug}`}><strong>{slug.charAt(0).toUpperCase() + slug.slice(1)} games</strong><span>Browse the parent catalogue</span></Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
