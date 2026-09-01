function StatBar({ label, value, max = 255, accentColor }) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm text-slate-400">{label}</span>
      <span className="w-9 text-sm font-semibold tabular-nums">{value}</span>
      <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: accentColor }}
        />
      </div>
    </div>
  )
}

export default StatBar