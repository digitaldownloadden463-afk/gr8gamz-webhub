import { canonical } from '@/lib/features';
import { publicContactLabel } from '@/lib/siteIdentity';

export const metadata = {
  title: 'Report a Game',
  description: 'Report a broken, unsuitable or rights-sensitive game on GR8 GAMZ.',
  alternates: { canonical: canonical('/report-a-game') }
};

export default function ReportGamePage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Report a game</span>
        <h1>Tell us what needs checking.</h1>
        <p>Report broken loading, unsuitable content, missing attribution, incorrect controls or rights concerns.</p>
      </section>
      <section className="content-panel">
        <h2>Include these details</h2>
        <ul className="clean-list">
          <li>The page URL.</li>
          <li>What happened.</li>
          <li>Your device and browser if it is a loading issue.</li>
        </ul>
        <p>{publicContactLabel()}</p>
      </section>
    </main>
  );
}
