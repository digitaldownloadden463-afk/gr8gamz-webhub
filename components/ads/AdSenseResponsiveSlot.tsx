import type { ComponentProps } from 'react';
import AdSenseSlot from './AdSenseSlot';

type ResponsiveSlotProps = Omit<ComponentProps<typeof AdSenseSlot>, 'format' | 'responsive'>;

export default function AdSenseResponsiveSlot(props: ResponsiveSlotProps) {
  return <AdSenseSlot {...props} format="auto" responsive />;
}
