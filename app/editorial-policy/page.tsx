import { canonical } from '@/lib/features';

export const metadata = {
  title: 'Game Selection Policy',
  description: 'How GR8 GAMZ chooses games for GR8 Originals and GR8 Select.',
  alternates: { canonical: canonical('/editorial-policy') }
};

export default function EditorialPolicyPage() {
  return (
    <main className="legal-page">
      <section className="page-title">
        <span className="eyebrow">Game selection</span>
        <h1>How games earn a place on GR8 GAMZ.</h1>
        <p>GR8 GAMZ favours games that are playable, quick to understand, visually clear, mobile-aware and honest about how they load.</p>
      </section>
      <section className="content-panel">
        <h2>What we avoid</h2>
        <p>We do not publish invented player counts, ratings, chat, copied reviews or pages that exist only to repeat search phrases.</p>
      </section>
    </main>
  );
}
