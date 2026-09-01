import { Link } from 'react-router-dom'
import TypeBadge from './TypeBadge'

function PokemonCard({ pokemon }) {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 hover:bg-slate-700 transition-transform"
    >
      <span className="text-xs text-slate-400">
        #{String(pokemon.pokeapiId).padStart(3, '0')}
      </span>

      <img
        src={pokemon.imageUrl}
        alt={pokemon.name}
        className="w-24 h-24 object-contain"
        loading="lazy"
      />

      <span className="capitalize font-semibold">{pokemon.name}</span>

      <div className="flex gap-1 flex-wrap justify-center">
        <TypeBadge type={pokemon.primaryType} />
        {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
      </div>
    </Link>
  )
}

export default PokemonCard