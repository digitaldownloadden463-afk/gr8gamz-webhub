export default function AdSlot({ placement, compact = false }) {
  if (!placement) return null;

  return (
    <aside
      className={`ad-slot ad-slot-${placement.format || 'standard'} ${compact ? 'ad-slot-compact' : ''}`}
      aria-label={placement.label || 'Advertisement'}
      data-ad-placement={placement.id}
    >
      <span className="ad-label">{placement.label || 'Advertisement'}</span>
      <a href={placement.href || '/advertise'} className="ad-creative">
        <strong>{placement.title}</strong>
        <span>{placement.copy}</span>
      </a>
    </aside>
  );
}
