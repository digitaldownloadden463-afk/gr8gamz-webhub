export default function AiSummaryBox({ title = 'Quick summary', bullets = [] }) {
  if (!bullets.length) return null;
  return (
    <section className="ai-summary-box" aria-label={title}>
      <span className="eyebrow">Quick summary</span>
      <h2>{title}</h2>
      <ul>
        {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
      </ul>
    </section>
  );
}
