import type { ReactNode } from 'react';
import Link from 'next/link';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import ToolRecommendations from '@/components/tools/ToolRecommendations';
import { RelatedToolLink, ToolViewTracker } from '@/components/tools/ToolAnalytics';
import { canonical } from '@/lib/features';
import { getToolGames, gr8Tools, relatedTools, type ToolId } from '@/lib/gr8Tools';

type ToolPageFrameProps = {
  toolId: ToolId;
  description: string;
  eyebrow: string;
  intro: string;
  utility: ReactNode;
  children: ReactNode;
};

export default function ToolPageFrame({ toolId, description, eyebrow, intro, utility, children }: ToolPageFrameProps) {
  const tool = gr8Tools[toolId];
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'GR8 GAMZ Tools', item: canonical('/tools') },
      { '@type': 'ListItem', position: 3, name: tool.name, item: canonical(tool.href) }
    ]
  };
  const application = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description,
    url: canonical(tool.href),
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: 'GR8 GAMZ', url: canonical('/') }
  };
  const games = getToolGames(toolId);

  return (
    <main className="tools-page">
      <ToolViewTracker toolId={toolId} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(application) }} />
      <nav className="commerce-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/tools">Tools</Link><span aria-hidden="true">/</span><span aria-current="page">{tool.name}</span></nav>
      <header className="tool-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{tool.name === 'CPS Test' ? 'CPS Test - Click Speed Test' : tool.name === 'Sensitivity Converter' ? 'Gaming Sensitivity Converter' : tool.name}</h1>
        <p>{intro}</p>
      </header>
      <AdSensePlacement placement="tool-upper-content" />
      <section className="tool-utility-zone" aria-label={`${tool.name} interactive utility`}>{utility}</section>
      <AdSensePlacement placement="tool-after-utility" />
      <article className="tool-guide">{children}</article>
      <AdSensePlacement placement="tool-lower-content" />
      <section className="content-panel tool-related" aria-labelledby="related-tools-title">
        <span className="eyebrow">Keep testing</span>
        <h2 id="related-tools-title">Try another GR8 Tool</h2>
        <div className="compact-link-list">
          {relatedTools(toolId).map((related) => <RelatedToolLink key={related.id} {...related} toolId={related.id} />)}
        </div>
      </section>
      <section className="tool-games" aria-labelledby="tool-games-title">
        <div className="section-heading"><span className="eyebrow">Play next</span><h2 id="tool-games-title">Put your skills to use</h2><Link href="/games" className="text-link">Browse all games</Link></div>
        <ToolRecommendations games={games} toolId={toolId} />
      </section>
    </main>
  );
}
