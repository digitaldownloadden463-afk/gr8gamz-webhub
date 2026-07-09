export default function GameInstructionPanel({ game }) {
  const controls = game.controls || [];
  const hooks = game.engagementHooks || [];

  return (
    <section className="preplay-panel" aria-label={`How to play ${game.name}`}>
      <div className="preplay-copy">
        <span className="panel-kicker">Before you play</span>
        <h2>{game.name} controls</h2>
        <p>{game.baseTrivia}</p>
      </div>
      <div className="control-cards">
        {controls.slice(0, 4).map((control) => (
          <div key={control} className="control-card">
            <strong>{control}</strong>
          </div>
        ))}
      </div>
      <div className="hook-strip">
        {hooks.slice(0, 4).map((hook) => (
          <span key={hook}>{hook}</span>
        ))}
      </div>
    </section>
  );
}
