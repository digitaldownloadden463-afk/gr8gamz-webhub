import Link from 'next/link';
import AiSummaryBox from './AiSummaryBox';

function controlSentence(game) {
  const controls = game.controls || [];
  if (!controls.length) return `${game.name} is built for quick browser play with mobile-first controls.`;
  return controls.slice(0, 3).join(' · ');
}

export function buildGameFaq(game) {
  return [
    {
      question: `What is ${game.name}?`,
      answer: `${game.name} is a free ${game.genre.toLowerCase()} browser game on GR8 GAMZ. ${game.description}`
    },
    {
      question: `Can I play ${game.name} on mobile?`,
      answer: `Yes. ${game.name} is designed for mobile browser play. ${controlSentence(game)}`
    },
    {
      question: `How do I play ${game.name}?`,
      answer: controlSentence(game)
    },
    {
      question: `Is ${game.name} free?`,
      answer: `Yes. ${game.name} is free to play in your browser with no app download required.`
    }
  ];
}

export default function GameSeoSections({ game, related = [] }) {
  const hooks = game.engagementHooks || [];
  const faq = buildGameFaq(game);
  const bullets = [
    `${game.name} is a free ${game.genre.toLowerCase()} game on GR8 GAMZ.`,
    `Main play style: ${game.playStyle || 'quick browser play'}.`,
    `Mobile control focus: ${game.shortControls || 'touchscreen-ready controls'}.`,
    `Difficulty: ${game.difficulty || 'Quick-play'}.`,
    `Related discovery path: /categories/${game.category}.`
  ];

  return (
    <section className="seo-content-stack">
      <AiSummaryBox title={`${game.name} summary for players and search`} bullets={bullets} />

      <article className="content-panel seo-detail-panel">
        <span className="eyebrow">Game guide</span>
        <h2>What is {game.name}?</h2>
        <p>
          {game.name} is a free browser-based {game.genre.toLowerCase()} game built for quick sessions, repeat attempts and mobile-first play.
          {` ${game.longDescription || game.baseTrivia || game.description}`}
        </p>
        <p>
          The goal is simple: learn the controls quickly, start a run, chase a stronger result and jump back in with as little friction as possible.
          This makes {game.name} suitable for short mobile sessions as well as focused desktop play.
        </p>
      </article>

      <article className="content-panel seo-detail-panel">
        <span className="eyebrow">How to play</span>
        <h2>Controls and scoring</h2>
        <div className="seo-two-column">
          <div>
            <h3>Controls</h3>
            <ul>
              {(game.controls || []).map((control) => <li key={control}>{control}</li>)}
            </ul>
          </div>
          <div>
            <h3>Replay hooks</h3>
            <ul>
              {hooks.map((hook) => <li key={hook}>{hook}</li>)}
            </ul>
          </div>
        </div>
      </article>

      <article className="content-panel seo-detail-panel">
        <span className="eyebrow">Strategy tips</span>
        <h2>Tips to get better at {game.name}</h2>
        <ol>
          <li>Start with the easiest style or mode until the movement feels natural.</li>
          <li>Focus on survival first, then chase score bonuses once you understand the rhythm.</li>
          <li>Use GR8 Focus Mode when you want a cleaner full-screen play session.</li>
          <li>Replay quickly after a loss so you keep the timing and control pattern fresh.</li>
        </ol>
      </article>

      <article className="content-panel seo-detail-panel">
        <span className="eyebrow">FAQ</span>
        <h2>{game.name} FAQ</h2>
        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.question} open>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </article>

      {related.length ? (
        <article className="content-panel seo-detail-panel">
          <span className="eyebrow">Next discovery path</span>
          <h2>Games like {game.name}</h2>
          <p>
            Keep playing through related games in the same category or with similar controls. These internal paths help players move naturally through the GR8 GAMZ arcade.
          </p>
          <div className="tag-list large-tags">
            {related.map((item) => <Link key={item.id} href={`/arcade/${item.id}`}><span>{item.name}</span></Link>)}
          </div>
        </article>
      ) : null}
    </section>
  );
}
