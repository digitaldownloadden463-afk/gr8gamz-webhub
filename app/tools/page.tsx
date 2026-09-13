import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Gamepad2, Keyboard, MousePointerClick, Space } from 'lucide-react';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import { ToolViewTracker } from '@/components/tools/ToolAnalytics';
import { canonical } from '@/lib/features';
import { gr8Tools } from '@/lib/gr8Tools';

const title = 'Free Gaming Tools - Keyboard, CPS, Controller & Sensitivity Tests | GR8 GAMZ';
const description = 'Use free browser-based gaming tools for keyboard testing, click speed, spacebar counting, controller checks and mouse sensitivity conversion.';
const icons = { 'keyboard-tester': Keyboard, 'cps-test': MousePointerClick, 'spacebar-clicker': Space, 'gamepad-tester': Gamepad2, 'sensitivity-converter': Calculator };

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: canonical('/tools') }, robots: { index: true, follow: true } };

export default function ToolsPage() {
  const structuredData = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') }, { '@type': 'ListItem', position: 2, name: 'GR8 GAMZ Tools', item: canonical('/tools') }] },
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Free Gaming Tools', description, url: canonical('/tools'), isPartOf: { '@type': 'WebSite', name: 'GR8 GAMZ', url: canonical('/') } }
  ];
  return (
    <main className="tools-page">
      <ToolViewTracker toolId="tools-hub" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <nav className="commerce-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Tools</span></nav>
      <header className="tools-hero"><span className="eyebrow">Browser utilities for players</span><h1>Free Gaming Tools</h1><p>Test the controls you use, measure a repeatable input result or translate mouse settings with focused utilities that run in your browser. No account, installation or paid API is required.</p></header>
      <AdSensePlacement placement="tool-upper-content" />
      <section className="tool-card-grid" aria-label="GR8 GAMZ tools">
        {Object.entries(gr8Tools).map(([id, tool]) => { const Icon = icons[id as keyof typeof icons]; return <article className="tool-card" key={id}><Icon aria-hidden="true" /><h2>{tool.name}</h2><p>{tool.description}</p><Link className="cta" href={tool.href}>Open {tool.name}</Link></article>; })}
      </section>
      <AdSensePlacement placement="tool-lower-content" />
      <section className="content-panel tool-hub-copy"><h2>Useful checks without an installation</h2><p>Each utility performs its work on this device. The keyboard, mouse and spacebar tools report events only while you interact with their clearly marked test area. The gamepad tester uses the standard browser Gamepad API, and the sensitivity calculator performs its maths locally. Tool input is not sent through GR8 GAMZ analytics.</p><p>Browser results provide practical observations, not a hardware diagnosis. A missed input can also be caused by focus, browser shortcuts, connection quality, operating-system settings or the way a particular game handles controls. Repeat a test and compare results before deciding that equipment is faulty.</p><p>When you finish, move directly between related tests or browse <Link href="/games">free online games</Link> to put the controls into practice.</p></section>
    </main>
  );
}
