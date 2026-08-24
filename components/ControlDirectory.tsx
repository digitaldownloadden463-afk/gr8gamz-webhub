import RegistryGameCard from '@/components/RegistryGameCard';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import CompactPagination from '@/components/CompactPagination';
import type { RegistryGame } from '@/lib/gameRegistry';

type ControlDirectoryProps = {
  hub: { slug: string; name: string; count: number };
  games: RegistryGame[];
  page: number;
  totalPages: number;
};

export default function ControlDirectory({ hub, games, page, totalPages }: ControlDirectoryProps) {
  const basePath = `/controls/${hub.slug}`;
  const pagePath = (value: number) => value === 1 ? basePath : `${basePath}/page/${value}`;
  const supportsThreeAds = games.length >= 12;
  const splitIndex = Math.min(24, Math.ceil(games.length / 2));
  const firstGames = games.slice(0, splitIndex);
  const remainingGames = games.slice(splitIndex);
  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Controls</span>
        <h1>{hub.name} games.</h1>
        <p>{hub.count.toLocaleString()} games that work with {hub.name.toLowerCase()} controls, from quick originals to GR8 Select picks.</p>
      </section>
      {supportsThreeAds ? <AdSensePlacement placement="discovery-upper-content" /> : null}
      <section className="game-grid" aria-label={`${hub.name} games, page ${page}, first group`}>
        {firstGames.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 8} />)}
      </section>
      {supportsThreeAds ? <AdSensePlacement placement="discovery-mid-content" /> : null}
      {remainingGames.length ? <section className="game-grid" aria-label={`${hub.name} games, page ${page}, second group`}>{remainingGames.map((game) => <RegistryGameCard key={game.id} game={game} />)}</section> : null}
      {supportsThreeAds ? <AdSensePlacement placement="discovery-lower-content" /> : null}
      <CompactPagination currentPage={page} totalPages={totalPages} previousHref={page > 1 ? pagePath(page - 1) : undefined} nextHref={page < totalPages ? pagePath(page + 1) : undefined} ariaLabel={`${hub.name} game pages`} />
    </>
  );
}
