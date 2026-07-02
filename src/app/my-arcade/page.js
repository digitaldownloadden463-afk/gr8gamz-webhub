import MyArcadeDashboard from '../../components/passport/MyArcadeDashboard';
import { getAllGames } from '../../lib/games';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'My Arcade',
  description: 'Your GR8 GAMZ player dashboard with saved games, XP, badges and daily missions.',
  path: '/my-arcade',
  noIndex: true
});

export default function MyArcadePage() {
  return (
    <main>
      <MyArcadeDashboard games={getAllGames()} />
    </main>
  );
}
