import { canonical } from '@/lib/features';
import { publicContactLabel } from '@/lib/siteIdentity';

export const metadata = {
  title: 'Copyright and Removal Requests',
  description: 'How to report copyright or game-removal concerns to GR8 GAMZ.',
  alternates: { canonical: canonical('/copyright') }
};

export default function CopyrightPage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Copyright</span>
        <h1>Report a rights concern.</h1>
        <p>If you own rights in a game or asset shown on GR8 GAMZ, send the game URL, the work involved and the action requested.</p>
      </section>
      <section className="content-panel">
        <h2>Where to send it</h2>
        <p>{publicContactLabel()}</p>
      </section>
    </main>
  );
}
