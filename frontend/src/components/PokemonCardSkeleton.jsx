function PokemonCardSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-800 border border-slate-700/50 p-4 flex flex-col items-center animate-pulse">
      <div className="w-full flex justify-start">
        <div className="h-3 w-8 bg-slate-700 rounded" />
      </div>

      <div className="w-24 h-24 bg-slate-700 rounded-full mt-4" />

      <div className="h-4 w-20 bg-slate-700 rounded mt-3" />

      <div className="flex gap-1.5 mt-2">
        <div className="h-6 w-16 bg-slate-700 rounded-full" />
        <div className="h-6 w-16 bg-slate-700 rounded-full" />
      </div>
    </div>
  )
}

export default PokemonCardSkeleton