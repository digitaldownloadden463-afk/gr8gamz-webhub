import catalogue from '@/src/data/commerce/gadgethyper-products.generated.json';
import type { CommerceProduct } from '@/lib/commerce/types';

export const commerceCatalogueMeta = {
  sourceUrl: catalogue.sourceUrl,
  sourceCheckedAt: catalogue.sourceCheckedAt,
  imageRightsState: catalogue.imageRightsState
} as const;

export const commerceProducts = catalogue.products as readonly CommerceProduct[];
