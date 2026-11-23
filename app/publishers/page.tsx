import Link from 'next/link';
import { canonical } from '@/lib/features';
import { getAllGames } from '@/lib/games';

export const metadata = {
  title: 'GR8 GAMZ Games for Editors & Publishers',
  description: 'Discover original browser games to review, share and link to. Browse official game pages, artwork and factual controls without needing an account.',
  alternates: { canonical: canonical('/publishers') }
};

export default function PublishersPage() {
  const games = getAllGames().filter((game) => game.status === 'Live');
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">For gaming editors and publishers</span>
        <h1>Discover and share GR8 Original browser games</h1>
        <p>
          Explore games you can play directly on the official GR8 GAMZ website.
          Reviewers may link to our public game pages and use short factual game
          descriptions when writing independent coverage.
        </p>
        <p>
          <Link className="text-link" href="/publishers/games.json">
            Browse the machine-readable original-games catalogue (JSON)
          </Link>
          {' · '}
          <Link className="text-link" href="/publishers/feed.xml">
            Subscribe to the original-games RSS feed
          </Link>
        </p>
        <p>
          No account is needed to browse or link to game pages. This is a
          link-and-review resource, not a grant to rehost, redistribute, modify
          or iframe the games. Contact the site before requesting distribution
          rights or standalone build files.
        </p>
      </section>
      <section className="content-panel" aria-labelledby="publishers-games">
        <h2 id="publishers-games">Original games available to review</h2>
        <ul className="clean-list">
          {games.map((game) => (
            <li key={game.id}>
              <h3><Link href={`/arcade/${game.slug || game.id}`}>{game.name}</Link></h3>
              <p>{game.description}</p>
              <p>
                Genre: {game.genre || game.category || 'Arcade'}.
                {' '}Controls: {game.shortControls || game.controls?.[0] || 'See game page'}.
              </p>
              <p>
                <a href={canonical(`/arcade/${game.slug || game.id}`)}>
                  Official playable URL
                </a>
                {game.thumbnail ? (
                  <> · <a href={canonical(game.thumbnail.split('?')[0])}>Game artwork</a></>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
