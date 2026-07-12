import type { MetadataRoute } from 'next';
import { games } from '@/lib/games';
import { getGameMonetizeCmsSitemapGames } from '@/src/data/gamemonetizeCms';
import { getPartnerGameProfiles, getPartnerNetworkClusterRoutes } from '@/src/data/partnerGameProfiles';
import {
  ACTIVE_STATIC_ROUTES,
  buildCmsGameRoutes,
  buildOriginalGameRoutes,
  buildPartnerClusterRoutes,
  buildPartnerProfileRoutes
} from '@/src/lib/activeRoutes';

const baseUrl = 'https://www.gr8gamz.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ACTIVE_STATIC_ROUTES.map((path) => ({
    url: path === '/' ? baseUrl : `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const gameRoutes = buildOriginalGameRoutes(games).map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const partnerRoutes = [
    ...buildPartnerProfileRoutes(getPartnerGameProfiles()),
    ...buildPartnerClusterRoutes(getPartnerNetworkClusterRoutes())
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const cmsGames = getGameMonetizeCmsSitemapGames();
  const cmsRoutes = buildCmsGameRoutes(cmsGames).map((path, index) => {
    const game = cmsGames[index];
    return {
      url: `${baseUrl}${path}`,
      lastModified: game?.dateAdded ? new Date(game.dateAdded) : new Date()
    };
  });

  return [...staticRoutes, ...gameRoutes, ...partnerRoutes, ...cmsRoutes];
}
