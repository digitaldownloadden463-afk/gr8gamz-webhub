import { getPlayableRegistryGames, type RegistryGame } from '@/lib/gameRegistry';

export type ToolId = 'keyboard-tester' | 'cps-test' | 'spacebar-clicker' | 'gamepad-tester' | 'sensitivity-converter';

export const gr8Tools: Record<ToolId, { name: string; href: string; description: string }> = {
  'keyboard-tester': {
    name: 'Keyboard Tester',
    href: '/tools/keyboard-tester',
    description: 'Check common keyboard keys and see the browser code reported for each press.'
  },
  'cps-test': {
    name: 'CPS Test',
    href: '/tools/cps-test',
    description: 'Measure clicks per second over a controlled 5, 10, 30 or 60 second test.'
  },
  'spacebar-clicker': {
    name: 'Spacebar Clicker',
    href: '/tools/spacebar-clicker',
    description: 'Count spacebar presses and measure a consistent presses-per-second result.'
  },
  'gamepad-tester': {
    name: 'Gamepad Tester',
    href: '/tools/gamepad-tester',
    description: 'Inspect controller buttons, triggers and live stick axes with the browser Gamepad API.'
  },
  'sensitivity-converter': {
    name: 'Sensitivity Converter',
    href: '/tools/sensitivity-converter',
    description: 'Calculate eDPI and cm/360, then convert between a small set of verified engine scales.'
  }
};

export const toolRoutePaths = ['/tools', ...Object.values(gr8Tools).map((tool) => tool.href)];

const toolGamePatterns: Record<ToolId, RegExp> = {
  'keyboard-tester': /keyboard|arrow|wasd|space/i,
  'cps-test': /click|tap|mouse|arcade|action/i,
  'spacebar-clicker': /space|keyboard|jump|arcade/i,
  'gamepad-tester': /racing|driving|sports|action|arcade/i,
  'sensitivity-converter': /shoot|aim|action|racing|mouse/i
};

export function getToolGames(toolId: ToolId, limit = 6): RegistryGame[] {
  const pattern = toolGamePatterns[toolId];
  return getPlayableRegistryGames()
    .filter((game) => pattern.test(`${game.category} ${game.controls} ${game.tags.join(' ')}`))
    .slice(0, limit);
}

export function relatedTools(toolId: ToolId) {
  const relationships: Record<ToolId, ToolId[]> = {
    'keyboard-tester': ['spacebar-clicker', 'cps-test', 'gamepad-tester'],
    'cps-test': ['spacebar-clicker', 'keyboard-tester', 'gamepad-tester'],
    'spacebar-clicker': ['keyboard-tester', 'cps-test', 'gamepad-tester'],
    'gamepad-tester': ['keyboard-tester', 'sensitivity-converter', 'cps-test'],
    'sensitivity-converter': ['cps-test', 'gamepad-tester', 'keyboard-tester']
  };
  return relationships[toolId].map((id) => ({ id, ...gr8Tools[id] }));
}
