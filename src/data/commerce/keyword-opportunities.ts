import type { KeywordOpportunity } from '@/lib/commerce/types';

const source = 'UK SERP review and official Razer UK catalogue';
const checked = '2026-08-09';

export const keywordOpportunities: readonly KeywordOpportunity[] = [
  ['best gaming mouse UK', 'commercial', 'high', 'high', 'strong', 'guide', 95, true],
  ['best wireless gaming mouse UK', 'commercial', 'high', 'high', 'strong', 'guide', 93, true],
  ['best lightweight gaming mouse', 'commercial', 'medium', 'medium', 'strong', 'guide', 88, true],
  ['best gaming mouse for FPS', 'commercial', 'high', 'high', 'strong', 'guide', 90, true],
  ['best ergonomic gaming mouse', 'commercial', 'medium', 'medium', 'strong', 'guide', 82, true],
  ['best MMO gaming mouse UK', 'commercial', 'medium', 'medium', 'strong', 'guide', 80, true],
  ['best gaming headset UK', 'commercial', 'high', 'high', 'strong', 'guide', 92, true],
  ['best wireless gaming headset UK', 'commercial', 'high', 'high', 'strong', 'guide', 90, true],
  ['best gaming headset for PC', 'commercial', 'high', 'high', 'strong', 'guide', 87, true],
  ['best Razer gaming keyboard UK', 'commercial', 'medium', 'medium', 'strong', 'guide', 82, true],
  ['best mechanical gaming keyboard UK', 'commercial', 'high', 'high', 'strong', 'guide', 84, true],
  ['best mobile gaming controller UK', 'commercial', 'medium', 'medium', 'strong', 'guide', 84, true],
  ['best controller for Android phone', 'commercial', 'medium', 'medium', 'strong', 'guide', 80, true],
  ['Razer Viper V3 Pro vs DeathAdder V4 Pro', 'transactional', 'medium', 'medium', 'strong', 'comparison', 89, true],
  ['Razer BlackShark V3 Pro vs Kraken V4 Pro', 'transactional', 'medium', 'medium', 'strong', 'comparison', 86, true],
  ['best gaming laptop UK', 'commercial', 'high', 'high', 'partial', 'guide', 76, false],
  ['best gaming chair UK', 'commercial', 'high', 'high', 'partial', 'guide', 72, false],
  ['gaming laptop deals UK', 'transactional', 'high', 'high', 'partial', 'guide', 55, false],
  ['Razer discount code', 'transactional', 'high', 'high', 'partial', 'guide', 30, false]
].map(([keyword, intent, demand, difficulty, relevance, pageType, priority, selected]) => ({
  keyword, intent, country: 'UK', demand, source, checked, difficulty, productValue: pageType === 'product' ? 'high' : 'medium', razerRelevance: relevance, pageType, priority, selected
})) as readonly KeywordOpportunity[];
