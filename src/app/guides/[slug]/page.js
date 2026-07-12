import Link from 'next/link';
import { notFound } from 'next/navigation';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import { getGameBySlug, getRelatedGames } from '../../../lib/games';
import { articleJsonLd, breadcrumbJsonLd, buildPageMetadata, faqJsonLd } from '../../../lib/seo';

export function generateMetadata({ params }) {
  const game = getGameBySlug(params.slug);
  if (!game) return buildPageMetadata({ title: 'Guide not found', path: `/guides/${params.slug}`, noIndex: true });
  return buildPageMetadata({
    title: `${game.name} Guide: How to Play, Tips and Similar Games`,
    description: `Learn how to play ${game.name}, understand the controls, improve your score and find similar free browser games on GR8 GAMZ.`,
    path: `/guides/${game.id}`,
    image: game.thumbnail || undefined
  });
}

function guideArticle(game) {
  return {
    title: `${game.name} Guide: How to Play and Improve`,
    description: `A GR8 GAMZ guide for ${game.name}, including controls, quick tips and similar games.`,
    date: game.dateAdded || '2026-06-30',
    tags: [...(game.tags || []), 'game guide', 'how to play']
  };
}

function guideFaq(game) {
  return [
    { question: `How do you play ${game.name}?`, answer: `${game.name} is played directly in the browser. Start the game, follow the control prompt, then focus on timing, movement and repeat runs to improve your score.` },
    { question: `Is ${game.name} free?`, answer: `Yes. ${game.name} is free to play on GR8 GAMZ with no app download required.` },
    { question: `What games are similar to ${game.name}?`, answer: `GR8 GAMZ recommends related games by genre, controls and quick-play style underneath this guide.` }
  ];
}

export default function GameGuidePage({ params }) {
  const game = getGameBySlug(params.slug);
  if (!game) notFound();
  const related = getRelatedGames(game, 6);
  const faqs = guideFaq(game);

  return (
    <main>
      <JsonLd data={articleJsonLd(guideArticle(game), `/guides/${game.id}`)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Game Guides', path: '/guides' },
        { name: game.name, path: `/guides/${game.id}` }
      ])} />

      <div className="page-title page-title-network">
        <span className="eyebrow">GR8 game guide</span>
        <h1>{game.name} guide: how to play, score better and what to play next.</h1>
        <p>{game.seoDescription || game.description}</p>
        <div className="hero-actions compact-actions">
          <Link href={`/arcade/${game.id}`} className="hero-cta">Play {game.name}</Link>
          <Link href="/more-free-games" className="secondary-cta">More Free Games</Link>
        </div>
      </div>

      <section className="content-panel game-profile-detail">
        <div>
          <span className="eyebrow">How to play</span>
          <h2>Learn the core loop, then chase a better run.</h2>
          <p>
            Start by playing one test round to feel the controls. {game.name} works best when you learn the rhythm first, then restart quickly and aim for cleaner movement, faster reactions and a stronger score.
          </p>
        </div>
        <div className="profile-facts-grid">
          <article><strong>Genre</strong><span>{game.genre}</span></article>
          <article><strong>Difficulty</strong><span>{game.difficulty}</span></article>
          <article><strong>Controls</strong><span>{game.shortControls || (game.controls || []).join(', ')}</span></article>
          <article><strong>Platform</strong><span>Mobile and desktop browser</span></article>
        </div>
      </section>

      <section className="content-panel seo-detail-panel">
        <span className="eyebrow">Tips</span>
        <h2>Quick ways to improve.</h2>
        <div className="faq-grid">
          <article><h3>Play one warm-up round</h3><p>Use the first attempt to understand speed, controls and scoring instead of chasing perfection immediately.</p></article>
          <article><h3>Keep restarts fast</h3><p>Short games improve when you replay quickly and focus on one mistake at a time.</p></article>
          <article><h3>Use the right device</h3><p>Mobile is strong for tap and swipe games, while desktop can help with keyboard or aim-heavy games.</p></article>
        </div>
      </section>

      <section className="content-panel faq-panel">
        <div className="section-heading compact"><span>Guide FAQs</span><h2>Quick answers.</h2></div>
        <div className="faq-grid">
          {faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}
        </div>
      </section>

      {related.length ? (
        <section>
          <div className="section-heading"><div><span>Play next</span><h2>Games like {game.name}.</h2></div></div>
          <GameGrid games={related} showAd={false} />
        </section>
      ) : null}
    </main>
  );
}
