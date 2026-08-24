import { adsenseConfig } from './config';

export const adPlacements = {
  'home-upper-content': {
    slot: adsenseConfig.slots.home,
    minHeight: 250,
    pageTypes: ['home']
  },
  'home-mid-content': {
    slot: adsenseConfig.slots.home,
    minHeight: 250,
    pageTypes: ['home']
  },
  'home-lower-content': {
    slot: adsenseConfig.slots.home,
    minHeight: 250,
    pageTypes: ['home']
  },
  'discovery-upper-content': {
    slot: adsenseConfig.slots.discovery,
    minHeight: 250,
    pageTypes: ['discovery']
  },
  'discovery-mid-content': {
    slot: adsenseConfig.slots.discovery,
    minHeight: 250,
    pageTypes: ['discovery']
  },
  'discovery-lower-content': {
    slot: adsenseConfig.slots.discovery,
    minHeight: 250,
    pageTypes: ['discovery']
  },
  'editorial-upper-content': {
    slot: adsenseConfig.slots.editorial,
    minHeight: 250,
    pageTypes: ['gaming-gear-hub', 'buying-guide']
  },
  'editorial-mid-content': {
    slot: adsenseConfig.slots.editorial,
    minHeight: 250,
    pageTypes: ['gaming-gear-hub', 'buying-guide']
  },
  'editorial-lower-content': {
    slot: adsenseConfig.slots.editorial,
    minHeight: 250,
    pageTypes: ['gaming-gear-hub', 'buying-guide']
  }
} as const;

export type AdPlacementId = keyof typeof adPlacements;
