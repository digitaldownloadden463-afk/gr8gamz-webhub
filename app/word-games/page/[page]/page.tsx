import { notFound } from 'next/navigation';
import GameHubRoute from '@/components/GameHubRoute';
import { gameHubMetadata, getGameHubPageData, parseGameHubPageNumber } from '@/lib/gameHubPages';

const slug = 'word-games';
type PageProps = { params: Promise<{ page: string }> };

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps) {
  const page = parseGameHubPageNumber((await params).page);
  const data = page && page >= 2 ? getGameHubPageData(slug, page) : null;
  return data ? gameHubMetadata(data) : {};
}

export default async function Page({ params }: PageProps) {
  const page = parseGameHubPageNumber((await params).page);
  if (!page || page < 2 || !getGameHubPageData(slug, page)) notFound();
  return <GameHubRoute slug={slug} page={page} />;
}
