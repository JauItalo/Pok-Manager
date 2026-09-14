import { TYPE_LABELS_PT } from '../utils/typeColors'

function ComparisonWeaknessRow({ type, percentageA, percentageB }) {
  const label = TYPE_LABELS_PT[type] ?? type

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="flex justify-end items-center gap-2">
        <span className="text-sm text-slate-400 w-10 text-right">{percentageA}%</span>
        <div className="w-24 bg-slate-900 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-indigo-400 ml-auto rounded-full"
            style={{ width: `${percentageA}%` }}
          />
        </div>
      </div>

      <span className="text-xs font-medium text-slate-300 w-24 text-center">{label}</span>

      <div className="flex items-center gap-2">
        <div className="w-24 bg-slate-900 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-orange-400 rounded-full"
            style={{ width: `${percentageB}%` }}
          />
        </div>
        <span className="text-sm text-slate-400 w-10">{percentageB}%</span>
      </div>
    </div>
  )
}

export default ComparisonWeaknessRow