import GameHubRoute from '@/components/GameHubRoute';
import { gameHubMetadata, getGameHubPageData } from '@/lib/gameHubPages';

const slug = 'car-games';

export const dynamic = 'force-static';

export function generateMetadata() {
  const data = getGameHubPageData(slug);
  return data ? gameHubMetadata(data) : {};
}

export default function Page() {
  return <GameHubRoute slug={slug} />;
}
