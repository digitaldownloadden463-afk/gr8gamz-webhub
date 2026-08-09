import type { ComponentProps } from 'react';
import AdSenseSlot from './AdSenseSlot';

type InPageProps = Omit<ComponentProps<typeof AdSenseSlot>, 'format'>;

export default function AdSenseInPage(props: InPageProps) {
  return <AdSenseSlot {...props} format="fluid" />;
}
