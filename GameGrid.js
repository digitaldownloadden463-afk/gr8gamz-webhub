import GameCard from './GameCard';
import AdSlot from './ads/AdSlot';
import { adPlacements } from '../lib/ads';

export default function GameGrid({ games, localePathPrefix = '', showAd = true }) {
  return (
    <div className="game-grid">
      {games.map((game, index) => (
        <div key={game.id} className="game-grid-item">
          <GameCard game={game} localePathPrefix={localePathPrefix} />
          {showAd && index === 0 ? (
            <div className="mobile-feed-ad">
              <AdSlot placement={adPlacements.homeInFeed} compact />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
