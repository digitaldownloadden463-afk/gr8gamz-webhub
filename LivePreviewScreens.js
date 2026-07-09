import Link from 'next/link';

export default function LivePreviewScreens() {
  return (
    <div className="live-preview-rig" aria-label="Animated GR8 GAMZ live preview screens">
      <div className="live-screen live-screen-original">
        <div className="screen-bar">
          <span className="live-dot" />
          <strong>Hot Pick</strong>
          <small>GR8 Original</small>
        </div>
        <div className="demo-stage snake-stage" aria-hidden="true">
          <span className="demo-orb orb-one" />
          <span className="demo-orb orb-two" />
          <span className="demo-snake snake-one" />
          <span className="demo-snake snake-two" />
          <span className="demo-score">XP +25</span>
        </div>
        <div className="screen-copy">
          <h3>Neon Snake Rush</h3>
          <p>Swipe, collect and chase one more high-score run.</p>
          <Link href="/arcade/neon-snake-rush" className="mini-cta">Play hot pick</Link>
        </div>
      </div>

      <div className="live-screen live-screen-network">
        <div className="screen-bar">
          <span className="live-dot pink" />
          <strong>More Free Games</strong>
          <small>Network Pick</small>
        </div>
        <div className="demo-stage network-stage" aria-hidden="true">
          <span className="demo-card card-one">ARC</span>
          <span className="demo-card card-two">RAC</span>
          <span className="demo-card card-three">PUZ</span>
          <span className="demo-reticle" />
          <span className="demo-score alt">LIVE</span>
        </div>
        <div className="screen-copy">
          <h3>GR8 Game Network</h3>
          <p>Partner-powered free games, branded under GR8 GAMZ.</p>
          <Link href="/more-free-games" className="mini-cta">Explore more games</Link>
        </div>
      </div>
    </div>
  );
}
