'use client';

import { useMemo, useState } from 'react';
import GameCard from '@/components/GameCard';
import type { Gr8Game } from '@/lib/games';
import { gameCountLabel } from '@/lib/features';

type GameFiltersProps = {
  games: Gr8Game[];
  initialQuery?: string;
};

const allValue = 'all';

function unique(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

export function GameFilters({ games, initialQuery = '' }: GameFiltersProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(allValue);
  const [controls, setControls] = useState(allValue);
  const [difficulty, setDifficulty] = useState(allValue);

  const categories = useMemo(() => unique(games.map((game) => game.category || game.genre)), [games]);
  const controlOptions = useMemo(() => unique(games.map((game) => game.shortControls || game.controls?.[0])), [games]);
  const difficulties = useMemo(() => unique(games.map((game) => game.difficulty)), [games]);

  const filtered = games.filter((game) => {
    const text = `${game.name} ${game.description || ''} ${game.category || ''} ${game.genre || ''}`.toLowerCase();
    const matchesQuery = !query.trim() || text.includes(query.trim().toLowerCase());
    const matchesCategory = category === allValue || game.category === category || game.genre === category;
    const matchesControls = controls === allValue || game.shortControls === controls || game.controls?.[0] === controls;
    const matchesDifficulty = difficulty === allValue || game.difficulty === difficulty;
    return matchesQuery && matchesCategory && matchesControls && matchesDifficulty;
  });

  return (
    <section className="game-browser" aria-labelledby="game-browser-title">
      <div className="filter-panel">
        <div>
          <h2 id="game-browser-title">Find your next game</h2>
          <p>{gameCountLabel(filtered.length)} ready to play.</p>
        </div>
        <label>
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Snake, racing, puzzle..."
          />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value={allValue}>All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Controls
          <select value={controls} onChange={(event) => setControls(event.target.value)}>
            <option value={allValue}>All controls</option>
            {controlOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Difficulty
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value={allValue}>All difficulty</option>
            {difficulties.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="game-grid" aria-live="polite">
        {filtered.map((game, index) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.name}
            category={game.category || game.genre || 'Arcade'}
            imageUrl={game.thumbnail || '/placeholder.png'}
            url={`/arcade/${game.slug || game.id}`}
            dateAdded={game.dateAdded}
            controls={game.shortControls || game.controls?.[0]}
            difficulty={game.difficulty}
            priority={index < 4}
          />
        ))}
      </div>
    </section>
  );
}

export default GameFilters;
