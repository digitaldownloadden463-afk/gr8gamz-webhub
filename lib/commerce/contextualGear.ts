import type { Locale } from '@/lib/i18n';

export type ContextualGearKind = 'mobile' | 'competitive' | 'communication' | 'precision' | 'starter';

export type ContextualGearRecommendation = {
  kind: ContextualGearKind;
  href: string;
};

const localizedCopy: Record<Locale, { aria: string; eyebrow: string; title: string; description: string; cta: string; disclosure: string }> = {
  en: { aria: 'Recommended gaming gear', eyebrow: 'Gear for this type of game', title: 'Choose accessories around how you play.', description: 'This buying guide matches the game category and controls. Check compatibility before buying.', cta: 'Read the buying guide', disclosure: 'The guide contains clearly labelled affiliate links.' },
  es: { aria: 'Equipo gaming recomendado', eyebrow: 'Equipo para este tipo de juego', title: 'Elige accesorios segun tu forma de jugar.', description: 'Esta guia se ajusta a la categoria y los controles del juego. Comprueba la compatibilidad antes de comprar.', cta: 'Leer la guia de compra', disclosure: 'La guia contiene enlaces de afiliado claramente identificados.' },
  'pt-BR': { aria: 'Equipamentos gamer recomendados', eyebrow: 'Equipamentos para este tipo de jogo', title: 'Escolha acessorios de acordo com seu jeito de jogar.', description: 'Este guia considera a categoria e os controles do jogo. Verifique a compatibilidade antes de comprar.', cta: 'Ler o guia de compra', disclosure: 'O guia contem links de afiliado claramente identificados.' },
  fr: { aria: 'Equipement gaming recommande', eyebrow: 'Equipement pour ce type de jeu', title: 'Choisissez vos accessoires selon votre facon de jouer.', description: 'Ce guide tient compte de la categorie et des commandes du jeu. Verifiez la compatibilite avant achat.', cta: "Lire le guide d'achat", disclosure: "Le guide contient des liens d'affiliation clairement signales." },
  de: { aria: 'Empfohlene Gaming-Ausrustung', eyebrow: 'Ausrustung fur diese Spielart', title: 'Wahle Zubehor passend zu deiner Spielweise.', description: 'Dieser Ratgeber berucksichtigt Kategorie und Steuerung. Prufe vor dem Kauf die Kompatibilitat.', cta: 'Kaufratgeber lesen', disclosure: 'Der Ratgeber enthalt klar gekennzeichnete Affiliate-Links.' },
  it: { aria: 'Accessori gaming consigliati', eyebrow: 'Accessori per questo tipo di gioco', title: 'Scegli gli accessori in base a come giochi.', description: 'Questa guida considera categoria e controlli del gioco. Verifica la compatibilita prima dell acquisto.', cta: "Leggi la guida all'acquisto", disclosure: 'La guida contiene link di affiliazione chiaramente indicati.' },
  pl: { aria: 'Polecany sprzet gamingowy', eyebrow: 'Sprzet do tego typu gry', title: 'Dobierz akcesoria do swojego stylu gry.', description: 'Ten poradnik uwzglednia kategorie i sterowanie. Przed zakupem sprawdz zgodnosc.', cta: 'Przeczytaj poradnik zakupowy', disclosure: 'Poradnik zawiera wyraznie oznaczone linki afiliacyjne.' },
  tr: { aria: 'Onerilen oyun ekipmani', eyebrow: 'Bu oyun turu icin ekipman', title: 'Aksesuarlari oynayis tarzina gore sec.', description: 'Bu rehber oyun kategorisini ve kontrolleri dikkate alir. Satin almadan once uyumlulugu kontrol et.', cta: 'Satin alma rehberini oku', disclosure: 'Rehberde acikca etiketlenmis ortaklik baglantilari bulunur.' },
  id: { aria: 'Perlengkapan gaming yang disarankan', eyebrow: 'Perlengkapan untuk jenis game ini', title: 'Pilih aksesori sesuai cara bermainmu.', description: 'Panduan ini menyesuaikan kategori dan kontrol game. Periksa kompatibilitas sebelum membeli.', cta: 'Baca panduan pembelian', disclosure: 'Panduan memuat tautan afiliasi yang diberi label dengan jelas.' },
  ja: { aria: 'おすすめのゲーミングギア', eyebrow: 'このゲーム向けのギア', title: 'プレイスタイルに合う周辺機器を選ぼう。', description: 'ゲームのカテゴリと操作方法に合わせた購入ガイドです。購入前に対応機器を確認してください。', cta: '購入ガイドを読む', disclosure: 'ガイド内のアフィリエイトリンクは明確に表示されています。' },
  ko: { aria: '추천 게이밍 기어', eyebrow: '이 게임 유형에 맞는 기어', title: '플레이 방식에 맞는 액세서리를 선택하세요.', description: '게임 카테고리와 조작 방식을 반영한 구매 가이드입니다. 구매 전에 호환성을 확인하세요.', cta: '구매 가이드 읽기', disclosure: '가이드의 제휴 링크는 명확하게 표시됩니다.' },
  hi: { aria: 'सुझाया गया गेमिंग गियर', eyebrow: 'इस तरह के गेम के लिए गियर', title: 'अपने खेलने के तरीके के अनुसार एक्सेसरी चुनें।', description: 'यह गाइड गेम की श्रेणी और कंट्रोल के अनुसार है। खरीदने से पहले अनुकूलता जांचें।', cta: 'खरीद गाइड पढ़ें', disclosure: 'गाइड में एफिलिएट लिंक स्पष्ट रूप से बताए गए हैं।' },
  ar: { aria: 'معدات ألعاب موصى بها', eyebrow: 'معدات لهذا النوع من الألعاب', title: 'اختر الملحقات التي تناسب طريقة لعبك.', description: 'يراعي هذا الدليل فئة اللعبة وطريقة التحكم. تحقق من التوافق قبل الشراء.', cta: 'اقرأ دليل الشراء', disclosure: 'يتضمن الدليل روابط تسويق بالعمولة موضحة بوضوح.' }
};

const guideByKind: Record<ContextualGearKind, string> = {
  mobile: '/gaming-gear/mobile-gaming/best-mobile-gaming-controller',
  competitive: '/gaming-gear/gaming-mice/best-gaming-mouse-for-fps',
  communication: '/gaming-gear/gaming-headsets/best-gaming-headset',
  precision: '/gaming-gear/gaming-mice/best-ergonomic-gaming-mouse',
  starter: '/gaming-gear/gaming-mice/best-gaming-mouse'
};

export function contextualGearRecommendation({ category, controls = '', deviceFit = '' }: { category?: string; controls?: string; deviceFit?: string }): ContextualGearRecommendation {
  const categoryKey = String(category || '').toLowerCase();
  const controlText = controls.toLowerCase();
  const deviceText = deviceFit.toLowerCase();
  const touchLed = /touch|tap|swipe/.test(controlText) || /mobile[- ]only|phone[- ]only|tablet[- ]only/.test(deviceText);
  let kind: ContextualGearKind = 'starter';

  if (touchLed) kind = 'mobile';
  else if (/multiplayer|sports/.test(categoryKey)) kind = 'communication';
  else if (/action|shoot|fight/.test(categoryKey)) kind = 'competitive';
  else if (/puzzle|strategy|educational/.test(categoryKey)) kind = 'precision';
  else if (/racing/.test(categoryKey)) kind = 'communication';

  return { kind, href: guideByKind[kind] };
}

export function contextualGearCopy(locale: Locale = 'en') {
  return localizedCopy[locale] || localizedCopy.en;
}
