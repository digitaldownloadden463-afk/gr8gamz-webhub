import type { Locale } from '@/lib/i18n';

const labels: Record<Locale, string> = {
  en: 'Gaming Gear', es: 'Equipo gaming', 'pt-BR': 'Equipamentos gamer', fr: 'Equipement gaming', de: 'Gaming-Ausrustung',
  it: 'Accessori gaming', pl: 'Sprzet gamingowy', tr: 'Oyun ekipmani', id: 'Perlengkapan gaming', ja: 'ゲーミングギア',
  ko: '게이밍 기어', hi: 'गेमिंग गियर', ar: 'معدات الألعاب'
};

export function gamingGearLabel(locale: Locale) {
  return labels[locale];
}
