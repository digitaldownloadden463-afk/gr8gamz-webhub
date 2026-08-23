import { adsenseConfig } from './config';

export const adPlacements = {
  'home-content-primary': {
    slot: adsenseConfig.slots.home,
    minHeight: 250,
    pageTypes: ['home']
  },
  'discovery-after-catalogue': {
    slot: adsenseConfig.slots.discovery,
    minHeight: 250,
    pageTypes: ['discovery']
  },
  'editorial-footer': {
    slot: adsenseConfig.slots.editorial,
    minHeight: 250,
    pageTypes: ['gaming-gear-hub', 'buying-guide']
  }
} as const;

export type AdPlacementId = keyof typeof adPlacements;
