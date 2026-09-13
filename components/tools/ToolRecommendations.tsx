'use client';

import RegistryGameCard from '@/components/RegistryGameCard';
import { trackEvent } from '@/lib/analytics';
import type { RegistryGame } from '@/lib/gameRegistry';
import type { ToolId } from '@/lib/gr8Tools';

export default function ToolRecommendations({ games, toolId }: { games: RegistryGame[]; toolId: ToolId }) {
  return (
    <section
      className="game-grid tool-game-grid"
      aria-label="Games related to this tool"
      onClickCapture={(event) => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
        if (link) trackEvent('game_funnel_click', { tool_id: toolId, source_surface: 'tool-games' });
      }}
    >
      {games.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 3} />)}
    </section>
  );
}
