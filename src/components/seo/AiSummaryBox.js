export default function AiSummaryBox({ title = 'AI-readable summary', bullets = [] }) {
  if (!bullets.length) return null;
  return (
    <section className="ai-summary-box" aria-label={title}>
      <span className="eyebrow">AI-readable summary</span>
      <h2>{title}</h2>
      <ul>
        {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
      </ul>
    </section>
  );
}
