import { canonical } from '@/lib/features';

export const defaultLocale = 'en';

export const locales = [
  { code: 'en', nativeName: 'English', name: 'English', dir: 'ltr', og: 'en_GB' },
  { code: 'es', nativeName: 'Español', name: 'Spanish', dir: 'ltr', og: 'es_ES' },
  { code: 'pt-BR', nativeName: 'Português do Brasil', name: 'Brazilian Portuguese', dir: 'ltr', og: 'pt_BR' },
  { code: 'fr', nativeName: 'Français', name: 'French', dir: 'ltr', og: 'fr_FR' },
  { code: 'de', nativeName: 'Deutsch', name: 'German', dir: 'ltr', og: 'de_DE' },
  { code: 'it', nativeName: 'Italiano', name: 'Italian', dir: 'ltr', og: 'it_IT' },
  { code: 'pl', nativeName: 'Polski', name: 'Polish', dir: 'ltr', og: 'pl_PL' },
  { code: 'tr', nativeName: 'Türkçe', name: 'Turkish', dir: 'ltr', og: 'tr_TR' },
  { code: 'id', nativeName: 'Bahasa Indonesia', name: 'Indonesian', dir: 'ltr', og: 'id_ID' },
  { code: 'ja', nativeName: '日本語', name: 'Japanese', dir: 'ltr', og: 'ja_JP' },
  { code: 'ko', nativeName: '한국어', name: 'Korean', dir: 'ltr', og: 'ko_KR' },
  { code: 'hi', nativeName: 'हिन्दी', name: 'Hindi', dir: 'ltr', og: 'hi_IN' },
  { code: 'ar', nativeName: 'العربية', name: 'Arabic', dir: 'rtl', og: 'ar_AR' }
] as const;

export type Locale = typeof locales[number]['code'];
export type NonEnglishLocale = Exclude<Locale, 'en'>;

export const nonEnglishLocales = locales.filter((locale) => locale.code !== defaultLocale).map((locale) => locale.code) as NonEnglishLocale[];
export const localeCodes = locales.map((locale) => locale.code) as Locale[];
export const localeSet = new Set<string>(localeCodes);

type LocaleText = {
  nav: Record<'home' | 'games' | 'originals' | 'select' | 'trending' | 'daily' | 'new' | 'arcade', string>;
  common: Record<'play' | 'details' | 'category' | 'controls' | 'bestFor' | 'checked' | 'related' | 'share' | 'page' | 'previous' | 'next' | 'language' | 'officialTitle' | 'privacyChoice' | 'loadGame', string>;
  home: { eyebrow: string; title: string; intro: string; originalsCta: string; selectCta: string; fast: string; privacy: string; browse: string };
  hubs: { gamesTitle: string; gamesIntro: string; selectTitle: string; selectIntro: string; originalsTitle: string; categoryTitle: string; launchTitle: string; launchIntro: string };
  profile: { intro: string; why: string; tips: string; external: string; noindexNotice: string };
  legal: { privacyTitle: string; termsTitle: string; notice: string };
  categories: Record<string, string>;
  categoryFit: Record<string, string>;
};

const categoryKeys = ['Action', 'Adventure', 'Arcade', 'Puzzle', 'Racing', 'Sports', 'Multiplayer', '.IO', 'Simulation', 'Strategy'];

export const messages: Record<Locale, LocaleText> = {
  en: {
    nav: { home: 'Home', games: 'Games', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'Trending', daily: 'Daily', new: 'New', arcade: 'My GR8 Arcade' },
    common: { play: 'Play', details: 'Details', category: 'Category', controls: 'Controls', bestFor: 'Best for', checked: 'Checked', related: 'Play next', share: 'Share', page: 'Page', previous: 'Previous', next: 'Next', language: 'Language', officialTitle: 'Official game name', privacyChoice: 'Privacy choices', loadGame: 'Load game' },
    home: { eyebrow: 'GR8 GAMZ worldwide', title: 'Free browser games in your language.', intro: 'Start with GR8 Originals or open the Global Launch Collection: fast pages, clear artwork and games that only load when you choose.', originalsCta: 'Play originals', selectCta: 'Open global collection', fast: 'Fast starts', privacy: 'Clear privacy choices', browse: 'Built for browsing' },
    hubs: { gamesTitle: 'Games for quick sessions.', gamesIntro: 'Browse GR8 Originals and localized launch picks with stable links, clear categories and real artwork.', selectTitle: 'Global Launch Collection.', selectIntro: 'A quality-gated set of original and partner games localized for international players.', originalsTitle: 'GR8 Originals.', categoryTitle: 'games on GR8 GAMZ.', launchTitle: 'Global Launch Collection', launchIntro: 'Localized profiles for the first international GR8 GAMZ launch.' },
    profile: { intro: 'Open {title}, a {category} game selected for quick browser play on GR8 GAMZ.', why: 'Choose it when you want {fit}. The page keeps the official game name and gives you simple context before you press play.', tips: 'Check the controls, start with a short run and use the in-game prompts once the game opens.', external: 'The game itself loads only after you choose Play.', noindexNotice: 'This page is playable in your language, but it is not indexed until a full localized profile is ready.' },
    legal: { privacyTitle: 'Privacy', termsTitle: 'Terms', notice: 'English is the authoritative legal version. This localized page is a plain-language convenience summary and should be reviewed before legal reliance.' },
    categories: Object.fromEntries(categoryKeys.map((key) => [key, key])) as Record<string, string>,
    categoryFit: { Action: 'fast reactions and instant retries', Adventure: 'exploration and discovery', Arcade: 'short arcade runs', Puzzle: 'smart moves and calm focus', Racing: 'speed and timing', Sports: 'quick scoring challenges', Multiplayer: 'shared-feeling browser sessions', '.IO': 'larger arena-style play', Simulation: 'experiments and systems', Strategy: 'planning ahead' }
  },
  es: {
    nav: { home: 'Inicio', games: 'Juegos', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'Tendencias', daily: 'Diario', new: 'Nuevos', arcade: 'Mi GR8 Arcade' },
    common: { play: 'Jugar', details: 'Detalles', category: 'Categoría', controls: 'Controles', bestFor: 'Ideal para', checked: 'Revisado', related: 'Juega después', share: 'Compartir', page: 'Página', previous: 'Anterior', next: 'Siguiente', language: 'Idioma', officialTitle: 'Nombre oficial del juego', privacyChoice: 'Opciones de privacidad', loadGame: 'Cargar juego' },
    home: { eyebrow: 'GR8 GAMZ global', title: 'Juegos de navegador gratis en tu idioma.', intro: 'Empieza con GR8 Originals o abre la colección global: páginas rápidas, arte claro y juegos que cargan solo cuando tú lo decides.', originalsCta: 'Jugar originales', selectCta: 'Abrir colección global', fast: 'Entrada rápida', privacy: 'Privacidad clara', browse: 'Hecho para explorar' },
    hubs: { gamesTitle: 'Juegos para partidas rápidas.', gamesIntro: 'Explora originales y favoritos globales con enlaces estables, categorías claras y arte real.', selectTitle: 'Colección global de lanzamiento.', selectIntro: 'Una selección revisada y localizada para jugadores internacionales.', originalsTitle: 'GR8 Originals.', categoryTitle: 'en GR8 GAMZ.', launchTitle: 'Colección global', launchIntro: 'Perfiles localizados para el lanzamiento internacional de GR8 GAMZ.' },
    profile: { intro: 'Abre {title}, un juego de {category} elegido para jugar rápido en el navegador.', why: 'Elígelo si buscas {fit}. Conservamos el nombre oficial y te damos contexto claro antes de jugar.', tips: 'Mira los controles, prueba una partida corta y sigue las indicaciones dentro del juego.', external: 'El juego se carga solo cuando pulsas Jugar.', noindexNotice: 'Esta página se puede jugar en tu idioma, pero no se indexa hasta tener un perfil localizado completo.' },
    legal: { privacyTitle: 'Privacidad', termsTitle: 'Términos', notice: 'La versión legal autorizada es la inglesa. Esta página localizada es un resumen práctico y requiere revisión legal.' },
    categories: { Action: 'Acción', Adventure: 'Aventura', Arcade: 'Arcade', Puzzle: 'Puzles', Racing: 'Carreras', Sports: 'Deportes', Multiplayer: 'Multijugador', '.IO': '.IO', Simulation: 'Simulación', Strategy: 'Estrategia' },
    categoryFit: { Action: 'reacciones rápidas y nuevos intentos', Adventure: 'exploración y descubrimiento', Arcade: 'partidas arcade cortas', Puzzle: 'decisiones inteligentes y concentración', Racing: 'velocidad y precisión', Sports: 'retos rápidos de puntuación', Multiplayer: 'sesiones con sensación compartida', '.IO': 'partidas de arena más amplias', Simulation: 'experimentos y sistemas', Strategy: 'planear cada movimiento' }
  },
  'pt-BR': {
    nav: { home: 'Início', games: 'Jogos', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'Em alta', daily: 'Diário', new: 'Novos', arcade: 'Meu GR8 Arcade' },
    common: { play: 'Jogar', details: 'Detalhes', category: 'Categoria', controls: 'Controles', bestFor: 'Ideal para', checked: 'Verificado', related: 'Jogue depois', share: 'Compartilhar', page: 'Página', previous: 'Anterior', next: 'Próxima', language: 'Idioma', officialTitle: 'Nome oficial do jogo', privacyChoice: 'Opções de privacidade', loadGame: 'Carregar jogo' },
    home: { eyebrow: 'GR8 GAMZ mundial', title: 'Jogos grátis de navegador no seu idioma.', intro: 'Comece nos GR8 Originals ou abra a coleção global: páginas rápidas, capas claras e jogos que carregam só quando você escolhe.', originalsCta: 'Jogar originais', selectCta: 'Abrir coleção global', fast: 'Começo rápido', privacy: 'Privacidade clara', browse: 'Feito para descobrir' },
    hubs: { gamesTitle: 'Jogos para partidas rápidas.', gamesIntro: 'Explore originais e escolhas globais com links estáveis, categorias claras e arte real.', selectTitle: 'Coleção global de lançamento.', selectIntro: 'Uma seleção revisada e localizada para jogadores internacionais.', originalsTitle: 'GR8 Originals.', categoryTitle: 'na GR8 GAMZ.', launchTitle: 'Coleção global', launchIntro: 'Perfis localizados para a primeira expansão internacional da GR8 GAMZ.' },
    profile: { intro: 'Abra {title}, um jogo de {category} escolhido para jogar rápido no navegador.', why: 'Escolha quando quiser {fit}. Mantemos o nome oficial e explicamos o básico antes do play.', tips: 'Confira os controles, faça uma rodada curta e siga as instruções dentro do jogo.', external: 'O jogo carrega somente depois que você escolhe Jogar.', noindexNotice: 'Esta página é jogável no seu idioma, mas só será indexada quando tiver perfil localizado completo.' },
    legal: { privacyTitle: 'Privacidade', termsTitle: 'Termos', notice: 'A versão legal autorizada é a inglesa. Esta página localizada é um resumo de conveniência e precisa de revisão legal.' },
    categories: { Action: 'Ação', Adventure: 'Aventura', Arcade: 'Arcade', Puzzle: 'Quebra-cabeças', Racing: 'Corrida', Sports: 'Esportes', Multiplayer: 'Multijogador', '.IO': '.IO', Simulation: 'Simulação', Strategy: 'Estratégia' },
    categoryFit: { Action: 'reações rápidas e novas tentativas', Adventure: 'exploração e descoberta', Arcade: 'partidas arcade curtas', Puzzle: 'movimentos inteligentes e foco', Racing: 'velocidade e ritmo', Sports: 'desafios rápidos de pontuação', Multiplayer: 'sessões com clima compartilhado', '.IO': 'arenas maiores no navegador', Simulation: 'experimentos e sistemas', Strategy: 'planejamento antes de agir' }
  },
  fr: {
    nav: { home: 'Accueil', games: 'Jeux', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'Tendance', daily: 'Défi du jour', new: 'Nouveaux', arcade: 'Mon GR8 Arcade' },
    common: { play: 'Jouer', details: 'Détails', category: 'Catégorie', controls: 'Commandes', bestFor: 'Parfait pour', checked: 'Vérifié', related: 'À jouer ensuite', share: 'Partager', page: 'Page', previous: 'Précédent', next: 'Suivant', language: 'Langue', officialTitle: 'Nom officiel du jeu', privacyChoice: 'Choix de confidentialité', loadGame: 'Charger le jeu' },
    home: { eyebrow: 'GR8 GAMZ mondial', title: 'Des jeux de navigateur gratuits dans votre langue.', intro: 'Lancez un GR8 Original ou ouvrez la collection globale : pages rapides, visuels nets et chargement uniquement sur votre choix.', originalsCta: 'Jouer aux originaux', selectCta: 'Ouvrir la collection', fast: 'Démarrage rapide', privacy: 'Confidentialité claire', browse: 'Pensé pour explorer' },
    hubs: { gamesTitle: 'Des jeux pour sessions rapides.', gamesIntro: 'Parcourez les originaux et la sélection globale avec des liens stables, des catégories claires et de vraies images.', selectTitle: 'Collection globale de lancement.', selectIntro: 'Une sélection contrôlée et localisée pour les joueurs du monde entier.', originalsTitle: 'GR8 Originals.', categoryTitle: 'sur GR8 GAMZ.', launchTitle: 'Collection globale', launchIntro: 'Profils localisés pour le lancement international de GR8 GAMZ.' },
    profile: { intro: 'Ouvrez {title}, un jeu de {category} choisi pour jouer vite dans le navigateur.', why: 'Choisissez-le si vous voulez {fit}. Le nom officiel reste intact, avec un contexte simple avant de jouer.', tips: 'Repérez les commandes, lancez une courte partie et suivez les indications du jeu.', external: 'Le jeu se charge seulement après votre choix Jouer.', noindexNotice: 'Cette page est jouable dans votre langue, mais non indexée tant que le profil complet n’est pas prêt.' },
    legal: { privacyTitle: 'Confidentialité', termsTitle: 'Conditions', notice: 'La version juridique de référence est l’anglais. Cette page localisée est un résumé pratique nécessitant une validation juridique.' },
    categories: { Action: 'Action', Adventure: 'Aventure', Arcade: 'Arcade', Puzzle: 'Puzzle', Racing: 'Course', Sports: 'Sport', Multiplayer: 'Multijoueur', '.IO': '.IO', Simulation: 'Simulation', Strategy: 'Stratégie' },
    categoryFit: { Action: 'réactions rapides et essais immédiats', Adventure: 'exploration et découverte', Arcade: 'courtes sessions arcade', Puzzle: 'réflexion calme et placements précis', Racing: 'vitesse et timing', Sports: 'défis de score rapides', Multiplayer: 'sessions avec ambiance partagée', '.IO': 'parties façon arène', Simulation: 'expériences et systèmes', Strategy: 'planifier avant d’agir' }
  },
  de: {
    nav: { home: 'Start', games: 'Spiele', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'Trend', daily: 'Täglich', new: 'Neu', arcade: 'Mein GR8 Arcade' },
    common: { play: 'Spielen', details: 'Details', category: 'Kategorie', controls: 'Steuerung', bestFor: 'Gut für', checked: 'Geprüft', related: 'Als Nächstes', share: 'Teilen', page: 'Seite', previous: 'Zurück', next: 'Weiter', language: 'Sprache', officialTitle: 'Offizieller Spielname', privacyChoice: 'Datenschutzoptionen', loadGame: 'Spiel laden' },
    home: { eyebrow: 'GR8 GAMZ weltweit', title: 'Kostenlose Browserspiele in deiner Sprache.', intro: 'Starte mit GR8 Originals oder öffne die globale Sammlung: schnelle Seiten, klare Bilder und Spiele, die erst auf Wunsch laden.', originalsCta: 'Originale spielen', selectCta: 'Globale Sammlung öffnen', fast: 'Schneller Start', privacy: 'Klare Privatsphäre', browse: 'Zum Stöbern gebaut' },
    hubs: { gamesTitle: 'Spiele für kurze Sessions.', gamesIntro: 'Entdecke Originals und globale Picks mit stabilen Links, klaren Kategorien und echten Bildern.', selectTitle: 'Globale Launch-Sammlung.', selectIntro: 'Eine geprüfte und lokalisierte Auswahl für internationale Spieler.', originalsTitle: 'GR8 Originals.', categoryTitle: 'auf GR8 GAMZ.', launchTitle: 'Globale Sammlung', launchIntro: 'Lokalisierte Profile für den internationalen GR8 GAMZ Start.' },
    profile: { intro: 'Öffne {title}, ein {category}-Spiel für schnelles Spielen im Browser.', why: 'Passt, wenn du {fit} suchst. Der offizielle Name bleibt erhalten und der Kontext ist klar.', tips: 'Prüfe die Steuerung, starte kurz und folge den Hinweisen im Spiel.', external: 'Das Spiel lädt erst, wenn du Spielen wählst.', noindexNotice: 'Diese Seite ist spielbar, wird aber erst mit vollständigem lokalisiertem Profil indexiert.' },
    legal: { privacyTitle: 'Datenschutz', termsTitle: 'Bedingungen', notice: 'Rechtlich maßgeblich ist die englische Fassung. Diese lokalisierte Seite ist eine praktische Zusammenfassung und benötigt rechtliche Prüfung.' },
    categories: { Action: 'Action', Adventure: 'Abenteuer', Arcade: 'Arcade', Puzzle: 'Puzzle', Racing: 'Rennen', Sports: 'Sport', Multiplayer: 'Mehrspieler', '.IO': '.IO', Simulation: 'Simulation', Strategy: 'Strategie' },
    categoryFit: { Action: 'schnelle Reaktionen und direkte Neustarts', Adventure: 'Erkundung und Entdeckung', Arcade: 'kurze Arcade-Runden', Puzzle: 'kluge Züge und ruhigen Fokus', Racing: 'Tempo und Timing', Sports: 'schnelle Punkte-Challenges', Multiplayer: 'Sessions mit gemeinsamem Gefühl', '.IO': 'größere Arena-Partien', Simulation: 'Experimente und Systeme', Strategy: 'vorausplanendes Spielen' }
  },
  it: {
    nav: { home: 'Home', games: 'Giochi', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'Di tendenza', daily: 'Giornaliero', new: 'Nuovi', arcade: 'Il mio GR8 Arcade' },
    common: { play: 'Gioca', details: 'Dettagli', category: 'Categoria', controls: 'Comandi', bestFor: 'Ideale per', checked: 'Verificato', related: 'Prossimi giochi', share: 'Condividi', page: 'Pagina', previous: 'Precedente', next: 'Successiva', language: 'Lingua', officialTitle: 'Nome ufficiale del gioco', privacyChoice: 'Scelte privacy', loadGame: 'Carica gioco' },
    home: { eyebrow: 'GR8 GAMZ globale', title: 'Giochi browser gratis nella tua lingua.', intro: 'Inizia con i GR8 Originals o apri la raccolta globale: pagine veloci, immagini chiare e giochi caricati solo quando scegli.', originalsCta: 'Gioca agli originali', selectCta: 'Apri raccolta globale', fast: 'Partenza rapida', privacy: 'Privacy chiara', browse: 'Creato per esplorare' },
    hubs: { gamesTitle: 'Giochi per sessioni rapide.', gamesIntro: 'Scopri originali e scelte globali con link stabili, categorie chiare e immagini reali.', selectTitle: 'Raccolta globale di lancio.', selectIntro: 'Una selezione verificata e localizzata per giocatori internazionali.', originalsTitle: 'GR8 Originals.', categoryTitle: 'su GR8 GAMZ.', launchTitle: 'Raccolta globale', launchIntro: 'Profili localizzati per il lancio internazionale di GR8 GAMZ.' },
    profile: { intro: 'Apri {title}, un gioco di {category} scelto per partite rapide nel browser.', why: 'Sceglilo quando vuoi {fit}. Il nome ufficiale resta invariato e il contesto è semplice.', tips: 'Controlla i comandi, prova una run breve e segui le istruzioni nel gioco.', external: 'Il gioco si carica solo dopo aver scelto Gioca.', noindexNotice: 'Questa pagina è giocabile nella tua lingua, ma non è indicizzata finché il profilo completo non è pronto.' },
    legal: { privacyTitle: 'Privacy', termsTitle: 'Termini', notice: 'La versione legale autorevole è in inglese. Questa pagina localizzata è un riepilogo pratico e richiede revisione legale.' },
    categories: { Action: 'Azione', Adventure: 'Avventura', Arcade: 'Arcade', Puzzle: 'Puzzle', Racing: 'Corse', Sports: 'Sport', Multiplayer: 'Multigiocatore', '.IO': '.IO', Simulation: 'Simulazione', Strategy: 'Strategia' },
    categoryFit: { Action: 'riflessi rapidi e nuovi tentativi', Adventure: 'esplorazione e scoperta', Arcade: 'brevi partite arcade', Puzzle: 'mosse intelligenti e calma', Racing: 'velocità e tempismo', Sports: 'sfide rapide di punteggio', Multiplayer: 'sessioni dal sapore condiviso', '.IO': 'partite arena più ampie', Simulation: 'esperimenti e sistemi', Strategy: 'pianificazione accurata' }
  },
  pl: {
    nav: { home: 'Start', games: 'Gry', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'Na czasie', daily: 'Codziennie', new: 'Nowe', arcade: 'Moje GR8 Arcade' },
    common: { play: 'Graj', details: 'Szczegóły', category: 'Kategoria', controls: 'Sterowanie', bestFor: 'Dobre dla', checked: 'Sprawdzone', related: 'Zagraj dalej', share: 'Udostępnij', page: 'Strona', previous: 'Poprzednia', next: 'Następna', language: 'Język', officialTitle: 'Oficjalna nazwa gry', privacyChoice: 'Ustawienia prywatności', loadGame: 'Załaduj grę' },
    home: { eyebrow: 'GR8 GAMZ globalnie', title: 'Darmowe gry przeglądarkowe w Twoim języku.', intro: 'Zacznij od GR8 Originals albo otwórz globalną kolekcję: szybkie strony, czytelne grafiki i gry ładowane dopiero po wyborze.', originalsCta: 'Graj w oryginały', selectCta: 'Otwórz kolekcję', fast: 'Szybki start', privacy: 'Jasna prywatność', browse: 'Wygodne odkrywanie' },
    hubs: { gamesTitle: 'Gry na krótkie sesje.', gamesIntro: 'Przeglądaj oryginały i globalne wybory ze stabilnymi linkami, jasnymi kategoriami i prawdziwą grafiką.', selectTitle: 'Globalna kolekcja startowa.', selectIntro: 'Sprawdzony i zlokalizowany zestaw dla graczy z całego świata.', originalsTitle: 'GR8 Originals.', categoryTitle: 'na GR8 GAMZ.', launchTitle: 'Globalna kolekcja', launchIntro: 'Lokalizowane profile na międzynarodowy start GR8 GAMZ.' },
    profile: { intro: 'Otwórz {title}, grę z kategorii {category} wybraną do szybkiej zabawy w przeglądarce.', why: 'Wybierz ją, gdy chcesz {fit}. Oficjalna nazwa zostaje bez zmian, a opis jest prosty.', tips: 'Sprawdź sterowanie, zacznij od krótkiej rundy i kieruj się podpowiedziami w grze.', external: 'Gra ładuje się dopiero po wybraniu Graj.', noindexNotice: 'Ta strona jest grywalna w Twoim języku, ale nie jest indeksowana bez pełnego profilu lokalnego.' },
    legal: { privacyTitle: 'Prywatność', termsTitle: 'Warunki', notice: 'Prawnie wiążąca jest wersja angielska. Ta lokalizacja jest pomocniczym podsumowaniem i wymaga przeglądu prawnego.' },
    categories: { Action: 'Akcja', Adventure: 'Przygoda', Arcade: 'Arcade', Puzzle: 'Łamigłówki', Racing: 'Wyścigi', Sports: 'Sport', Multiplayer: 'Wieloosobowe', '.IO': '.IO', Simulation: 'Symulacja', Strategy: 'Strategia' },
    categoryFit: { Action: 'szybkie reakcje i natychmiastowe próby', Adventure: 'eksplorację i odkrywanie', Arcade: 'krótkie rundy arcade', Puzzle: 'sprytne ruchy i skupienie', Racing: 'prędkość i wyczucie czasu', Sports: 'szybkie wyzwania punktowe', Multiplayer: 'sesje z poczuciem wspólnej gry', '.IO': 'większe areny w przeglądarce', Simulation: 'eksperymenty i systemy', Strategy: 'planowanie z wyprzedzeniem' }
  },
  tr: {
    nav: { home: 'Ana sayfa', games: 'Oyunlar', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'Trend', daily: 'Günlük', new: 'Yeni', arcade: 'GR8 Arcade’im' },
    common: { play: 'Oyna', details: 'Detaylar', category: 'Kategori', controls: 'Kontroller', bestFor: 'Şunun için iyi', checked: 'Kontrol edildi', related: 'Sonraki oyunlar', share: 'Paylaş', page: 'Sayfa', previous: 'Önceki', next: 'Sonraki', language: 'Dil', officialTitle: 'Resmi oyun adı', privacyChoice: 'Gizlilik seçenekleri', loadGame: 'Oyunu yükle' },
    home: { eyebrow: 'Dünya çapında GR8 GAMZ', title: 'Kendi dilinde ücretsiz tarayıcı oyunları.', intro: 'GR8 Originals ile başla veya küresel koleksiyonu aç: hızlı sayfalar, net görseller ve yalnızca sen seçince yüklenen oyunlar.', originalsCta: 'Orijinalleri oyna', selectCta: 'Küresel koleksiyonu aç', fast: 'Hızlı başlangıç', privacy: 'Açık gizlilik', browse: 'Keşif için hazır' },
    hubs: { gamesTitle: 'Kısa oturumlar için oyunlar.', gamesIntro: 'Orijinalleri ve küresel seçimleri sabit bağlantılar, net kategoriler ve gerçek görsellerle gez.', selectTitle: 'Küresel lansman koleksiyonu.', selectIntro: 'Uluslararası oyuncular için denetlenmiş ve yerelleştirilmiş seçim.', originalsTitle: 'GR8 Originals.', categoryTitle: 'GR8 GAMZ’da.', launchTitle: 'Küresel koleksiyon', launchIntro: 'GR8 GAMZ uluslararası lansmanı için yerelleştirilmiş profiller.' },
    profile: { intro: '{title} oyununu aç: tarayıcıda hızlı oynamak için seçilmiş bir {category} oyunu.', why: '{fit} istediğinde seç. Resmi oyun adı korunur ve başlamadan önce net bilgi verilir.', tips: 'Kontrolleri kontrol et, kısa bir deneme yap ve oyun içi yönergeleri izle.', external: 'Oyun yalnızca Oyna seçildikten sonra yüklenir.', noindexNotice: 'Bu sayfa dilinde oynanabilir, ancak tam yerel profil hazır olana kadar indekslenmez.' },
    legal: { privacyTitle: 'Gizlilik', termsTitle: 'Şartlar', notice: 'Yetkili hukuki metin İngilizcedir. Bu yerelleştirilmiş sayfa kolaylık amaçlı özet olup hukuki inceleme gerektirir.' },
    categories: { Action: 'Aksiyon', Adventure: 'Macera', Arcade: 'Arcade', Puzzle: 'Bulmaca', Racing: 'Yarış', Sports: 'Spor', Multiplayer: 'Çok oyunculu', '.IO': '.IO', Simulation: 'Simülasyon', Strategy: 'Strateji' },
    categoryFit: { Action: 'hızlı refleksler ve tekrar denemeler', Adventure: 'keşif ve ilerleme', Arcade: 'kısa arcade turları', Puzzle: 'akıllı hamleler ve sakin odak', Racing: 'hız ve zamanlama', Sports: 'hızlı skor mücadeleleri', Multiplayer: 'paylaşımlı his veren oturumlar', '.IO': 'daha geniş arena oyunları', Simulation: 'deneyler ve sistemler', Strategy: 'önceden planlama' }
  },
  id: {
    nav: { home: 'Beranda', games: 'Game', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'Tren', daily: 'Harian', new: 'Baru', arcade: 'GR8 Arcade Saya' },
    common: { play: 'Main', details: 'Detail', category: 'Kategori', controls: 'Kontrol', bestFor: 'Cocok untuk', checked: 'Diperiksa', related: 'Main berikutnya', share: 'Bagikan', page: 'Halaman', previous: 'Sebelumnya', next: 'Berikutnya', language: 'Bahasa', officialTitle: 'Nama resmi game', privacyChoice: 'Pilihan privasi', loadGame: 'Muat game' },
    home: { eyebrow: 'GR8 GAMZ global', title: 'Game browser gratis dalam bahasamu.', intro: 'Mulai dari GR8 Originals atau buka koleksi global: halaman cepat, gambar jelas, dan game yang dimuat hanya saat kamu memilih.', originalsCta: 'Mainkan original', selectCta: 'Buka koleksi global', fast: 'Mulai cepat', privacy: 'Privasi jelas', browse: 'Nyaman dijelajahi' },
    hubs: { gamesTitle: 'Game untuk sesi cepat.', gamesIntro: 'Jelajahi original dan pilihan global dengan tautan stabil, kategori jelas, dan gambar asli.', selectTitle: 'Koleksi peluncuran global.', selectIntro: 'Pilihan yang diperiksa dan dilokalkan untuk pemain internasional.', originalsTitle: 'GR8 Originals.', categoryTitle: 'di GR8 GAMZ.', launchTitle: 'Koleksi global', launchIntro: 'Profil lokal untuk peluncuran internasional GR8 GAMZ.' },
    profile: { intro: 'Buka {title}, game {category} yang dipilih untuk main cepat di browser.', why: 'Pilih saat kamu ingin {fit}. Nama resmi tetap dipakai dan konteksnya jelas sebelum bermain.', tips: 'Cek kontrol, coba sesi singkat, lalu ikuti petunjuk di dalam game.', external: 'Game dimuat hanya setelah kamu memilih Main.', noindexNotice: 'Halaman ini bisa dimainkan dalam bahasamu, tetapi belum diindeks sebelum profil lokal lengkap.' },
    legal: { privacyTitle: 'Privasi', termsTitle: 'Ketentuan', notice: 'Versi hukum yang berlaku adalah bahasa Inggris. Halaman lokal ini hanya ringkasan praktis dan perlu tinjauan hukum.' },
    categories: { Action: 'Aksi', Adventure: 'Petualangan', Arcade: 'Arcade', Puzzle: 'Puzzle', Racing: 'Balap', Sports: 'Olahraga', Multiplayer: 'Multipemain', '.IO': '.IO', Simulation: 'Simulasi', Strategy: 'Strategi' },
    categoryFit: { Action: 'reaksi cepat dan coba lagi langsung', Adventure: 'eksplorasi dan penemuan', Arcade: 'ronde arcade singkat', Puzzle: 'langkah cerdas dan fokus tenang', Racing: 'kecepatan dan timing', Sports: 'tantangan skor cepat', Multiplayer: 'sesi terasa bersama', '.IO': 'arena browser yang lebih luas', Simulation: 'eksperimen dan sistem', Strategy: 'perencanaan matang' }
  },
  ja: {
    nav: { home: 'ホーム', games: 'ゲーム', originals: 'GR8 Originals', select: 'GR8 Select', trending: '人気', daily: 'デイリー', new: '新着', arcade: 'My GR8 Arcade' },
    common: { play: 'プレイ', details: '詳細', category: 'カテゴリ', controls: '操作', bestFor: 'おすすめ', checked: '確認済み', related: '次に遊ぶ', share: '共有', page: 'ページ', previous: '前へ', next: '次へ', language: '言語', officialTitle: '正式なゲーム名', privacyChoice: 'プライバシー設定', loadGame: 'ゲームを読み込む' },
    home: { eyebrow: '世界の GR8 GAMZ', title: 'あなたの言語で遊べる無料ブラウザゲーム。', intro: 'GR8 Originals から始めるか、グローバルコレクションを開こう。速いページ、見やすい画像、選んだ時だけ読み込むゲーム。', originalsCta: 'オリジナルを遊ぶ', selectCta: 'コレクションを開く', fast: 'すぐ始められる', privacy: 'わかりやすいプライバシー', browse: '探しやすい設計' },
    hubs: { gamesTitle: '短時間で遊べるゲーム。', gamesIntro: '安定したリンク、明確なカテゴリ、本物のアートワークで GR8 Originals とグローバル作品を探せます。', selectTitle: 'グローバルローンチコレクション。', selectIntro: '世界のプレイヤー向けに確認し、自然にローカライズしたセレクションです。', originalsTitle: 'GR8 Originals。', categoryTitle: 'ゲーム。', launchTitle: 'グローバルコレクション', launchIntro: 'GR8 GAMZ の国際ローンチ向けローカライズプロフィール。' },
    profile: { intro: '{title} を開こう。ブラウザですぐ遊べる {category} ゲームです。', why: '{fit} を楽しみたい時におすすめ。正式名称はそのままに、遊ぶ前の要点を短くまとめています。', tips: '操作を確認し、まず短く試して、ゲーム内の案内に従ってください。', external: 'ゲーム本体は「プレイ」を選んだ後に読み込まれます。', noindexNotice: 'このページは日本語UIで遊べますが、完全なローカライズプロフィールができるまで検索対象外です。' },
    legal: { privacyTitle: 'プライバシー', termsTitle: '利用規約', notice: '法的に有効な基準は英語版です。この翻訳ページは便宜上の要約であり、法務確認が必要です。' },
    categories: { Action: 'アクション', Adventure: 'アドベンチャー', Arcade: 'アーケード', Puzzle: 'パズル', Racing: 'レーシング', Sports: 'スポーツ', Multiplayer: 'マルチプレイ', '.IO': '.IO', Simulation: 'シミュレーション', Strategy: 'ストラテジー' },
    categoryFit: { Action: '素早い反応とリトライ', Adventure: '探索と発見', Arcade: '短いアーケードプレイ', Puzzle: '考える動きと集中', Racing: 'スピードとタイミング', Sports: 'すぐ挑めるスコア勝負', Multiplayer: '誰かと遊ぶ感覚のあるセッション', '.IO': '広めのアリーナ型プレイ', Simulation: '実験と仕組み', Strategy: '先を読むプレイ' }
  },
  ko: {
    nav: { home: '홈', games: '게임', originals: 'GR8 Originals', select: 'GR8 Select', trending: '인기', daily: '데일리', new: '신규', arcade: '내 GR8 Arcade' },
    common: { play: '플레이', details: '자세히', category: '카테고리', controls: '조작', bestFor: '추천 대상', checked: '확인됨', related: '다음 게임', share: '공유', page: '페이지', previous: '이전', next: '다음', language: '언어', officialTitle: '공식 게임 이름', privacyChoice: '개인정보 선택', loadGame: '게임 불러오기' },
    home: { eyebrow: '전 세계 GR8 GAMZ', title: '내 언어로 즐기는 무료 브라우저 게임.', intro: 'GR8 Originals로 시작하거나 글로벌 컬렉션을 열어 보세요. 빠른 페이지, 선명한 이미지, 선택할 때만 로드되는 게임.', originalsCta: '오리지널 플레이', selectCta: '글로벌 컬렉션 열기', fast: '빠른 시작', privacy: '명확한 개인정보 선택', browse: '탐색하기 좋게 설계' },
    hubs: { gamesTitle: '짧게 즐기기 좋은 게임.', gamesIntro: '안정적인 링크, 명확한 카테고리, 실제 이미지로 오리지널과 글로벌 선택작을 둘러보세요.', selectTitle: '글로벌 론칭 컬렉션.', selectIntro: '전 세계 플레이어를 위해 검수하고 현지화한 선택작입니다.', originalsTitle: 'GR8 Originals.', categoryTitle: '게임.', launchTitle: '글로벌 컬렉션', launchIntro: 'GR8 GAMZ 국제 출시를 위한 현지화 프로필입니다.' },
    profile: { intro: '{title}을 열어 보세요. 브라우저에서 빠르게 즐기는 {category} 게임입니다.', why: '{fit}을 원할 때 고르기 좋습니다. 공식 이름은 유지하고 플레이 전 핵심만 안내합니다.', tips: '조작을 확인하고 짧게 시작한 뒤 게임 안의 안내를 따라가세요.', external: '게임은 플레이를 선택한 뒤에만 로드됩니다.', noindexNotice: '이 페이지는 해당 언어로 플레이할 수 있지만 완전한 현지화 전에는 색인되지 않습니다.' },
    legal: { privacyTitle: '개인정보', termsTitle: '약관', notice: '법적으로 기준이 되는 문서는 영어입니다. 이 현지화 페이지는 편의상 요약이며 법적 검토가 필요합니다.' },
    categories: { Action: '액션', Adventure: '어드벤처', Arcade: '아케이드', Puzzle: '퍼즐', Racing: '레이싱', Sports: '스포츠', Multiplayer: '멀티플레이', '.IO': '.IO', Simulation: '시뮬레이션', Strategy: '전략' },
    categoryFit: { Action: '빠른 반응과 즉시 재도전', Adventure: '탐험과 발견', Arcade: '짧은 아케이드 세션', Puzzle: '영리한 수와 차분한 집중', Racing: '속도와 타이밍', Sports: '빠른 점수 도전', Multiplayer: '함께하는 느낌의 세션', '.IO': '더 넓은 아레나 플레이', Simulation: '실험과 시스템', Strategy: '미리 계획하는 플레이' }
  },
  hi: {
    nav: { home: 'होम', games: 'गेम', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'ट्रेंडिंग', daily: 'डेली', new: 'नए', arcade: 'मेरा GR8 Arcade' },
    common: { play: 'खेलें', details: 'विवरण', category: 'श्रेणी', controls: 'कंट्रोल', bestFor: 'इनके लिए अच्छा', checked: 'जाँचा गया', related: 'अगला खेलें', share: 'शेयर करें', page: 'पेज', previous: 'पिछला', next: 'अगला', language: 'भाषा', officialTitle: 'आधिकारिक गेम नाम', privacyChoice: 'प्राइवेसी विकल्प', loadGame: 'गेम लोड करें' },
    home: { eyebrow: 'दुनिया भर का GR8 GAMZ', title: 'आपकी भाषा में मुफ्त ब्राउज़र गेम।', intro: 'GR8 Originals से शुरू करें या ग्लोबल कलेक्शन खोलें: तेज पेज, साफ आर्टवर्क और गेम जो आपकी पसंद के बाद ही लोड होते हैं।', originalsCta: 'ओरिजिनल खेलें', selectCta: 'ग्लोबल कलेक्शन खोलें', fast: 'तेज शुरुआत', privacy: 'साफ प्राइवेसी विकल्प', browse: 'खोजने के लिए आसान' },
    hubs: { gamesTitle: 'छोटी सेशन के लिए गेम।', gamesIntro: 'स्थिर लिंक, साफ श्रेणियों और असली आर्टवर्क के साथ ओरिजिनल और ग्लोबल गेम देखें।', selectTitle: 'ग्लोबल लॉन्च कलेक्शन।', selectIntro: 'अंतरराष्ट्रीय खिलाड़ियों के लिए जाँचा और स्थानीयकृत चयन।', originalsTitle: 'GR8 Originals.', categoryTitle: 'GR8 GAMZ पर।', launchTitle: 'ग्लोबल कलेक्शन', launchIntro: 'GR8 GAMZ के अंतरराष्ट्रीय लॉन्च के लिए स्थानीय प्रोफाइल।' },
    profile: { intro: '{title} खोलें, यह ब्राउज़र में जल्दी खेलने के लिए चुना गया {category} गेम है।', why: 'जब आप {fit} चाहते हैं, तब इसे चुनें। आधिकारिक नाम वही रहता है और खेलने से पहले साफ जानकारी मिलती है।', tips: 'कंट्रोल देखें, छोटी रन से शुरू करें और गेम के अंदर दिए संकेतों का पालन करें।', external: 'गेम केवल तब लोड होता है जब आप खेलें चुनते हैं।', noindexNotice: 'यह पेज आपकी भाषा में खेला जा सकता है, लेकिन पूरा स्थानीय प्रोफाइल तैयार होने तक इंडेक्स नहीं होगा।' },
    legal: { privacyTitle: 'प्राइवेसी', termsTitle: 'शर्तें', notice: 'कानूनी रूप से मान्य संस्करण अंग्रेज़ी है। यह स्थानीय पेज सुविधा के लिए सारांश है और कानूनी समीक्षा चाहता है।' },
    categories: { Action: 'एक्शन', Adventure: 'एडवेंचर', Arcade: 'आर्केड', Puzzle: 'पहेली', Racing: 'रेसिंग', Sports: 'स्पोर्ट्स', Multiplayer: 'मल्टीप्लेयर', '.IO': '.IO', Simulation: 'सिमुलेशन', Strategy: 'रणनीति' },
    categoryFit: { Action: 'तेज प्रतिक्रिया और तुरंत दोबारा कोशिश', Adventure: 'खोज और रोमांच', Arcade: 'छोटी आर्केड रन', Puzzle: 'समझदार चाल और शांत फोकस', Racing: 'गति और टाइमिंग', Sports: 'तेज स्कोर चुनौतियाँ', Multiplayer: 'साझा अनुभव वाली सेशन', '.IO': 'बड़े एरीना जैसे खेल', Simulation: 'प्रयोग और सिस्टम', Strategy: 'पहले से योजना बनाना' }
  },
  ar: {
    nav: { home: 'الرئيسية', games: 'الألعاب', originals: 'GR8 Originals', select: 'GR8 Select', trending: 'الرائج', daily: 'اليومي', new: 'الجديد', arcade: 'أركيدي GR8' },
    common: { play: 'العب', details: 'التفاصيل', category: 'الفئة', controls: 'التحكم', bestFor: 'مناسب لـ', checked: 'تم التحقق', related: 'العب بعد ذلك', share: 'مشاركة', page: 'صفحة', previous: 'السابق', next: 'التالي', language: 'اللغة', officialTitle: 'اسم اللعبة الرسمي', privacyChoice: 'خيارات الخصوصية', loadGame: 'تحميل اللعبة' },
    home: { eyebrow: 'GR8 GAMZ عالمياً', title: 'ألعاب متصفح مجانية بلغتك.', intro: 'ابدأ مع GR8 Originals أو افتح المجموعة العالمية: صفحات سريعة، صور واضحة، وألعاب لا يتم تحميلها إلا عندما تختار.', originalsCta: 'العب الألعاب الأصلية', selectCta: 'افتح المجموعة العالمية', fast: 'بداية سريعة', privacy: 'خصوصية واضحة', browse: 'مصمم للتصفح' },
    hubs: { gamesTitle: 'ألعاب لجلسات قصيرة.', gamesIntro: 'تصفح الألعاب الأصلية والاختيارات العالمية بروابط ثابتة وفئات واضحة وصور حقيقية.', selectTitle: 'مجموعة الإطلاق العالمية.', selectIntro: 'اختيار تم فحصه وترجمته للاعبين حول العالم.', originalsTitle: 'GR8 Originals.', categoryTitle: 'على GR8 GAMZ.', launchTitle: 'المجموعة العالمية', launchIntro: 'ملفات ألعاب محلية لإطلاق GR8 GAMZ الدولي.' },
    profile: { intro: 'افتح {title}، وهي لعبة {category} مختارة للعب السريع في المتصفح.', why: 'اخترها عندما تريد {fit}. نحافظ على الاسم الرسمي ونقدم لك سياقاً واضحاً قبل اللعب.', tips: 'راجع أدوات التحكم، ابدأ بجولة قصيرة، ثم اتبع التعليمات داخل اللعبة.', external: 'يتم تحميل اللعبة فقط بعد اختيارك زر العب.', noindexNotice: 'هذه الصفحة قابلة للعب بلغتك، لكنها لا تُفهرس قبل اكتمال ملف محلي كامل.' },
    legal: { privacyTitle: 'الخصوصية', termsTitle: 'الشروط', notice: 'النص القانوني المعتمد هو النسخة الإنجليزية. هذه الصفحة المحلية ملخص لتسهيل الفهم وتحتاج إلى مراجعة قانونية.' },
    categories: { Action: 'أكشن', Adventure: 'مغامرة', Arcade: 'آركيد', Puzzle: 'ألغاز', Racing: 'سباق', Sports: 'رياضة', Multiplayer: 'متعدد اللاعبين', '.IO': '.IO', Simulation: 'محاكاة', Strategy: 'استراتيجية' },
    categoryFit: { Action: 'ردود فعل سريعة ومحاولات فورية', Adventure: 'الاستكشاف والاكتشاف', Arcade: 'جولات آركيد قصيرة', Puzzle: 'حركات ذكية وتركيز هادئ', Racing: 'السرعة والتوقيت', Sports: 'تحديات تسجيل سريعة', Multiplayer: 'جلسات بإحساس اللعب المشترك', '.IO': 'لعب بساحة أوسع', Simulation: 'التجارب والأنظمة', Strategy: 'التخطيط قبل الحركة' }
  }
};

export function isLocale(value?: string): value is Locale {
  return Boolean(value && localeSet.has(value));
}

export function localeInfo(locale: Locale) {
  return locales.find((item) => item.code === locale) || locales[0];
}

export function stripLocale(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && isLocale(parts[0])) return `/${parts.slice(1).join('/')}` || '/';
  return pathname || '/';
}

export function pathForLocale(locale: Locale, path = '/') {
  const clean = stripLocale(path);
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean === '/' ? '' : clean}`;
}

const localizedRoutePatterns = [
  /^\/$/,
  /^\/games\/?$/,
  /^\/gr8-select\/?$/,
  /^\/gr8-select\/page\/[1-9][0-9]*\/?$/,
  /^\/gr8-originals\/?$/,
  /^\/gr8-trending\/?$/,
  /^\/gr8-daily\/?$/,
  /^\/new-games\/?$/,
  /^\/my-arcade\/?$/,
  /^\/privacy\/?$/,
  /^\/terms\/?$/,
  /^\/categories\/[a-z0-9.-]+\/?$/,
  /^\/categories\/[a-z0-9.-]+\/page\/[1-9][0-9]*\/?$/,
  /^\/arcade\/[a-z0-9-]+\/?$/,
  /^\/more-free-games\/[a-z0-9-]+\/?$/,
  /^\/more-free-games\/[a-z0-9-]+\/play\/?$/
];

export function hasLocalizedRoute(path = '/') {
  const clean = stripLocale(path).split('?')[0] || '/';
  return localizedRoutePatterns.some((pattern) => pattern.test(clean));
}

export function switchLocalePath(locale: Locale, path = '/') {
  const clean = stripLocale(path);
  if (locale === defaultLocale) return clean;
  return pathForLocale(locale, hasLocalizedRoute(clean) ? clean : '/');
}

export function localizedCanonical(locale: Locale, path = '/') {
  return canonical(pathForLocale(locale, path));
}

export function localizedAlternates(path: string, indexableLocales: Locale[] = localeCodes) {
  const languages: Record<string, string> = { 'x-default': canonical(stripLocale(path)) };
  for (const locale of indexableLocales) {
    languages[locale] = localizedCanonical(locale, path);
  }
  return languages;
}

export function tr(locale: Locale) {
  return messages[locale] || messages.en;
}

export function categoryName(locale: Locale, category?: string) {
  const value = category || 'Arcade';
  return tr(locale).categories[value] || value;
}

export function categoryFit(locale: Locale, category?: string) {
  const value = category || 'Arcade';
  return tr(locale).categoryFit[value] || tr(locale).categoryFit.Arcade;
}

export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => values[key] || '');
}
