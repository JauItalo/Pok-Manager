import { Link } from 'react-router-dom'

function TeamCard({ team }) {
  return (
    <Link
      to={`/times/${team.id}`}
      className="bg-slate-800 rounded-2xl p-5 hover:bg-slate-700 transition-colors"
    >
      <h2 className="font-display font-bold text-lg mb-3">{team.name}</h2>

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
    </Link>
  )
}

export default TeamCard