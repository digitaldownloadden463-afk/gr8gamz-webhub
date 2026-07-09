import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Partner and Affiliate Disclosure',
  description: 'How GR8 GAMZ uses partner game feeds, affiliate links and monetisation disclosures.',
  path: '/partner-disclosure'
});

export default function PartnerDisclosurePage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Disclosure</span>
        <h1>Partner and affiliate disclosure.</h1>
        <p>
          GR8 GAMZ is a free browser gaming site. To support the site, we may use partner game feeds, advertising, sponsored placements and affiliate links.
        </p>
      </div>

      <section className="content-panel article-body">
        <h2>GamePix partner games</h2>
        <p>
          Some games may be provided through the GamePix partner catalogue. These games can include tracking URLs that allow GamePix to report activity back to the correct publisher property.
        </p>

        <h2>GameMonetize partner games</h2>
        <p>
          Some games may also be provided through the GameMonetize catalogue. These partner games can include advertising and partner monetisation.
        </p>

        <h2>Affiliate links and advertising</h2>
        <p>
          Some pages may contain affiliate links or advertising links. If you click a qualifying link or complete an action, GR8 GAMZ may earn a commission at no extra cost to you.
        </p>

        <h2>Editorial approach</h2>
        <p>
          GR8 GAMZ aims to keep original games, partner games and monetised recommendations clearly labelled so visitors understand what they are clicking.
        </p>
      </section>
    </main>
  );
}
