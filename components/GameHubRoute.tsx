import { notFound } from 'next/navigation';
import GameHubDirectory from '@/components/GameHubDirectory';
import { gameHubStructuredData, getGameHubPageData } from '@/lib/gameHubPages';

export default function GameHubRoute({ slug, page = 1 }: { slug: string; page?: number }) {
  const data = getGameHubPageData(slug, page);
  if (!data) notFound();
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gameHubStructuredData(data)) }} />
      <GameHubDirectory data={data} />
    </main>
  );
}
