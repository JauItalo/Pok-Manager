import { TYPE_COLORS, TYPE_LABELS_PT } from '../utils/typeColors'

function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] ?? '#777'
  const label = TYPE_LABELS_PT[type] ?? type

  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  )
}

export default TypeBadge