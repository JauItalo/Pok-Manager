import EvolutionNode from './EvolutionNode'

function EvolutionChain({ evolution }) {
  const { current, evolvesFrom, evolvesTo } = evolution

  const hasEvolutionData = evolvesFrom || evolvesTo.length > 0

  if (!hasEvolutionData) {
    return (
      <p className="text-sm text-slate-500">
        Esse Pokémon não possui evoluções conhecidas.
      </p>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {evolvesFrom && (
        <>
          <EvolutionNode pokemon={evolvesFrom} />
          <Arrow />
        </>
      )}

      <EvolutionNode pokemon={current} highlighted />

      {evolvesTo.length > 0 && (
        <>
          <Arrow />
          <div className="flex flex-col gap-3">
            {evolvesTo.map((next) => (
              <EvolutionNode key={next.id} pokemon={next} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Arrow() {
  return <span className="text-2xl text-slate-600">→</span>
}

export default EvolutionChain