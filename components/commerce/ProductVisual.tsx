import Image from 'next/image';
import { Gamepad2 } from 'lucide-react';
import { canShowMerchantImage } from '@/lib/commerce/catalogue';
import type { CommerceProduct } from '@/lib/commerce/types';

export default function ProductVisual({ product, priority = false }: { product: CommerceProduct; priority?: boolean }) {
  if (canShowMerchantImage(product) && product.imageSourceUrl) {
    return <Image src={product.imageSourceUrl} alt={`${product.name} product image`} fill priority={priority} sizes="(max-width: 720px) 92vw, (max-width: 1100px) 44vw, 360px" />;
  }
  return <span className="product-visual-placeholder" role="img" aria-label={`Product image pending usage-rights confirmation for ${product.name}`}><Gamepad2 aria-hidden="true" /><small>{product.brand}</small></span>;
}
