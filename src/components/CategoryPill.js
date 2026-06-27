import Link from 'next/link';

export default function CategoryPill({ category, localePathPrefix = '' }) {
  const href = `${localePathPrefix}/categories/${category.id}`.replace('//', '/');
  return (
    <Link href={href} className="category-pill">
      <span>{category.emoji}</span>
      <span>{category.name}</span>
    </Link>
  );
}
