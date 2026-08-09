import Link from 'next/link';
import { ArrowRight, MousePointer2 } from 'lucide-react';

const categoryGuide: Record<string, { title: string; description: string; href: string }> = {
  action: { title: 'Gear for faster controls', description: 'Compare lightweight mice and clear-communication headsets for action-focused sessions.', href: '/gaming-gear/gaming-mice/best-gaming-mouse-for-fps' },
  racing: { title: 'Controllers for mobile play', description: 'Check device fit and direct controls before choosing a mobile controller.', href: '/gaming-gear/mobile-gaming/best-mobile-gaming-controller' },
  sports: { title: 'Gaming headsets for team play', description: 'Compare competitive communication and immersive wireless audio.', href: '/gaming-gear/gaming-headsets/best-gaming-headset' },
  puzzle: { title: 'Comfortable controls for longer sessions', description: 'Compare ergonomic mice by shape, weight and useful controls.', href: '/gaming-gear/gaming-mice/best-ergonomic-gaming-mouse' },
  strategy: { title: 'Keyboards and mice with more control', description: 'Compare layouts and button-rich options for command-heavy games.', href: '/gaming-gear/gaming-keyboards/best-razer-gaming-keyboard' },
  arcade: { title: 'Find a mouse that fits your play style', description: 'Start with grip, weight and the controls you genuinely need.', href: '/gaming-gear/gaming-mice/best-gaming-mouse' },
  multiplayer: { title: 'Clear audio for multiplayer sessions', description: 'Compare wireless headsets around communication, compatibility and comfort.', href: '/gaming-gear/gaming-headsets/best-wireless-gaming-headset' }
};

export default function GearContextModule({ category }: { category?: string }) {
  const key = String(category || 'arcade').toLowerCase();
  const recommendation = categoryGuide[key] || categoryGuide.arcade;
  return (
    <aside className="gear-context" aria-label="Recommended gaming gear">
      <MousePointer2 aria-hidden="true" />
      <div><span className="eyebrow">Upgrade your setup</span><h2>{recommendation.title}</h2><p>{recommendation.description}</p></div>
      <Link href={recommendation.href} className="secondary-cta">Read the guide <ArrowRight size={17} aria-hidden="true" /></Link>
    </aside>
  );
}
