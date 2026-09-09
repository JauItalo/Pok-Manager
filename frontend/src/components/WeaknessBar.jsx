import { TYPE_COLORS, TYPE_LABELS_PT } from '../utils/typeColors'

function WeaknessBar({ type, percentage }) {
  const color = TYPE_COLORS[type] ?? '#777'
  const label = TYPE_LABELS_PT[type] ?? type

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-sm">{label}</span>
      <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-10 text-sm text-slate-400 text-right">{percentage}%</span>
    </div>
  )
}

export default WeaknessBar