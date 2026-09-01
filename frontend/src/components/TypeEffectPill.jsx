import { TYPE_COLORS, TYPE_LABELS_PT } from '../utils/typeColors'

function TypeEffectPill({ type, multiplier }) {
  const color = TYPE_COLORS[type] ?? '#777'
  const label = TYPE_LABELS_PT[type] ?? type

  return (
    <div
      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
      style={{ backgroundColor: color + 'CC' }}
    >
      <span>{label}</span>
      <span className="font-display font-bold tabular-nums">{multiplier}×</span>
    </div>
  )
}

export default TypeEffectPill