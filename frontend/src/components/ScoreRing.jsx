function ScoreRing({ label, percentage }) {
  const color = percentage >= 70 ? '#4ADE80' : percentage >= 40 ? '#FACC15' : '#F87171'

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-xl"
        style={{
          background: `conic-gradient(${color} ${percentage * 3.6}deg, #1e293b 0deg)`,
        }}
      >
        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
          {percentage}%
        </div>
      </div>
      <span className="text-xs text-slate-400 mt-2">{label}</span>
    </div>
  )
}

export default ScoreRing