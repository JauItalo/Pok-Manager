import { Link } from 'react-router-dom'
import TypeBadge from './TypeBadge'

function EvolutionNode({ pokemon, highlighted = false }) {
  const content = (
    <div
      className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-colors ${
        highlighted
          ? 'bg-slate-700 ring-2 ring-white/20'
          : 'bg-slate-800 hover:bg-slate-700'
      }`}
    >
      <span className="text-xs text-slate-400">
        #{String(pokemon.pokeapiId).padStart(3, '0')}
      </span>
      <img
        src={pokemon.imageUrl}
        alt={pokemon.name}
        className="w-20 h-20 object-contain"
      />
      <span className="font-display font-semibold capitalize text-sm">
        {pokemon.name}
      </span>
      <div className="flex gap-1">
        <TypeBadge type={pokemon.primaryType} />
        {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
      </div>
    </div>
  )

  if (highlighted) {
    return content
  }

  return <Link to={`/pokemon/${pokemon.id}`}>{content}</Link>
}

export default EvolutionNode