const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const locales = ['es', 'pt-BR', 'fr', 'de', 'it', 'pl', 'tr', 'id', 'ja', 'ko', 'hi', 'ar'];
const failures = [];
const sampleSize = Number(process.env.I18N_SAMPLE_SIZE || 50);

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].replace(/&amp;/g, '&'));
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'manual' });
  const text = await response.text();
  return { response, text };
}

for (const locale of locales) {
  const sitemapUrl = `${baseUrl}/sitemaps/locale-${locale}-games-1.xml`;
  const { response, text } = await fetchText(sitemapUrl);
  if (response.status !== 200) {
    failures.push(`${locale}: sitemap returned ${response.status}`);
    continue;
  }
  const urls = extractLocs(text);
  if (urls.length !== 226) failures.push(`${locale}: expected 226 localized game URLs, found ${urls.length}`);
  const samples = urls.slice(0, sampleSize);
  for (const url of samples) {
    const path = new URL(url).pathname;
    const localUrl = `${baseUrl}${path}`;
    const page = await fetchText(localUrl);
    if (page.response.status !== 200) {
      failures.push(`${locale}: ${path} returned ${page.response.status}`);
      continue;
    }
    if (!page.text.includes(`<main lang="${locale}"`)) failures.push(`${locale}: ${path} missing localized main lang`);
    if (locale === 'ar' && !page.text.includes('<main lang="ar" dir="rtl"')) failures.push(`${locale}: ${path} missing RTL content direction`);
    if (!page.text.includes(`rel="canonical" href="${url}"`)) failures.push(`${locale}: ${path} missing self canonical`);
    if (!page.text.includes(`hrefLang="${locale}"`) && !page.text.includes(`hreflang="${locale}"`)) failures.push(`${locale}: ${path} missing locale hreflang`);
    if (!page.text.includes('hrefLang="x-default"') && !page.text.includes('hreflang="x-default"')) failures.push(`${locale}: ${path} missing x-default hreflang`);
    const bodyText = page.text.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/https?:\/\/[^\s"<>]+/gi, '');
    if (/GamePix|GameMonetize|supplier games|provider collection/.test(bodyText)) failures.push(`${locale}: ${path} contains player-visible supplier wording`);
    if (/common\.|home\.|profile\.|hubs\./.test(page.text)) failures.push(`${locale}: ${path} rendered a raw translation key`);
  }
}

if (failures.length) {
  console.error(failures.slice(0, 80).join('\n'));
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more`);
  process.exit(1);
}

console.log(`Localized smoke passed for ${locales.length} locales, ${sampleSize} sampled game pages per locale, and 2712 sitemap game URLs.`);
