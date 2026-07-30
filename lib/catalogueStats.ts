import { localeCodes } from '@/lib/i18n';
import { getAllGames } from '@/lib/games';
import { getPartnerGameProfiles, partnerCatalogueReport } from '@/src/data/partnerGameProfiles';

export function getCatalogueStats() {
  const originals = getAllGames().length;
  const select = getPartnerGameProfiles().length;
  return {
    originals,
    select,
    playable: originals + select,
    locales: localeCodes.length,
    quarantined: partnerCatalogueReport.totals.quarantined,
    duplicates: partnerCatalogueReport.totals.duplicates
  };
}

export function countLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count.toLocaleString()} ${count === 1 ? singular : plural}`;
}
