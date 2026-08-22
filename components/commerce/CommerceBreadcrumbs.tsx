import Link from 'next/link';
import { canonical } from '@/lib/features';

type CommerceBreadcrumbsProps = {
  currentPath: string;
  items: readonly { href?: string; label: string }[];
};

export default function CommerceBreadcrumbs({ currentPath, items }: CommerceBreadcrumbsProps) {
  const crumbs = [{ href: '/', label: 'Home' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: canonical(item.href ?? currentPath)
    }))
  };
  return (
    <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link><span className="breadcrumbs__separator" aria-hidden="true">/</span>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="breadcrumbs__item">
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          {index < items.length - 1 ? <span className="breadcrumbs__separator" aria-hidden="true">/</span> : null}
        </span>
      ))}
    </nav></>
  );
}
