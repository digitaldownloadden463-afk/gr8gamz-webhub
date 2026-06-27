const leaders = [
  { name: 'ArcadeKing_99', level: 42, score: '88,420' },
  { name: 'PixelNuke', level: 35, score: '74,120' },
  { name: 'NeonDash', level: 31, score: '62,900' },
  { name: 'StreakHunter', level: 27, score: '51,300' }
];

export default function LeaderboardTerminal() {
  return (
    <section className="leaderboard-card">
      <div className="section-heading compact">
        <span>Live targets</span>
        <h2>Beat the board</h2>
      </div>
      <ol className="leaderboard-list">
        {leaders.map((player, index) => (
          <li key={player.name}>
            <span>#{index + 1}</span>
            <strong>{player.name}</strong>
            <em>LVL {player.level}</em>
          </li>
        ))}
      </ol>
      <p>Static seed board for launch. Ready to connect to Supabase, Firebase or a custom backend later.</p>
    </section>
  );
}
