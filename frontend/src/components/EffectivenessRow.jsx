import { TYPE_COLORS, TYPE_LABELS_PT } from '../utils/typeColors'

function EffectivenessRow({ type, multiplier }) {
  const color = TYPE_COLORS[type] ?? '#777'
  const label = TYPE_LABELS_PT[type] ?? type

  // normaliza pra uma barra visual: 4x = 100%, 2x = 50%, 0.5x = 25%, 0.25x = 12.5%
  const percentage = Math.min((multiplier / 4) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm">{label}</span>
      <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-10 text-sm text-slate-400 text-right">{multiplier}x</span>
    </div>
  )
}

export default EffectivenessRow