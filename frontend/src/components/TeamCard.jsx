import { Link } from 'react-router-dom'

function TeamCard({ team, selectionMode, selected, onToggleSelect }) {
  const content = (
    <>
      <div className="flex items-start justify-between mb-3">
        <h2 className="font-display font-bold text-lg">{team.name}</h2>
        {selectionMode && (
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selected ? 'bg-red-500 border-red-500' : 'border-slate-600'
            }`}
          >
            {selected && <span className="text-white text-xs">✓</span>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 6 }).map((_, i) => {
          const member = team.pokemons[i]
          return (
            <div
              key={i}
              className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden"
            >
              {member ? (
                <img
                  src={member.pokemon.imageUrl}
                  alt={member.pokemon.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-slate-700 text-lg">+</span>
              )}
            </div>
          )
        })}
      </div>

      <span className="text-sm text-slate-400">
        {team.pokemons.length}/6 Pokémon
      </span>
    </>
  )

  const className = `bg-slate-800 rounded-2xl p-5 transition-colors text-left w-full ${
    selectionMode && selected
      ? 'ring-2 ring-red-500'
      : 'hover:bg-slate-700'
  }`

  if (selectionMode) {
    return (
      <button onClick={onToggleSelect} className={className}>
        {content}
      </button>
    )
  }

  return (
    <Link to={`/times/${team.id}`} className={className}>
      {content}
    </Link>
  )
}

export default TeamCard