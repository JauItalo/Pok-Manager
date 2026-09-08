import { Link } from 'react-router-dom'
import { TYPE_COLORS, TYPE_LABELS_PT } from '../utils/typeColors'

function TypePill({ type }) {
  const color = TYPE_COLORS[type] ?? '#777'
  const label = TYPE_LABELS_PT[type] ?? type

  return (
    <span className="flex items-center gap-1.5 bg-slate-900 rounded-full pl-1.5 pr-3 py-1 text-xs font-medium text-slate-200">
      <span
        className="w-3.5 h-3.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}

function PokemonCard({ pokemon }) {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="group relative flex flex-col items-center rounded-2xl bg-slate-800 border border-slate-700/50 p-4 transition-colors hover:border-slate-600 hover:bg-slate-800/80"
    >
      <span className="absolute top-3 left-3 font-display text-xs font-bold text-slate-500 group-hover:text-slate-400 transition-colors">
        #{String(pokemon.pokeapiId).padStart(3, '0')}
      </span>

      <img
        src={pokemon.imageUrl}
        alt={pokemon.name}
        className="w-24 h-24 object-contain mt-4"
        loading="lazy"
      />

      <span className="font-display font-bold text-base mt-1 capitalize">
        {pokemon.name}
      </span>

      <div className="flex gap-1.5 flex-wrap justify-center mt-2">
        <TypePill type={pokemon.primaryType} />
        {pokemon.secondaryType && <TypePill type={pokemon.secondaryType} />}
      </div>
    </Link>
  )
}

export default PokemonCard