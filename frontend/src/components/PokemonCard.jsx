import { Link } from 'react-router-dom'
import TypeBadge from './TypeBadge'
import { TYPE_COLORS_DARK } from '../utils/typeColors'

function PokemonCard({ pokemon }) {
  const accentDark = TYPE_COLORS_DARK[pokemon.primaryType]

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="group relative overflow-hidden rounded-2xl bg-slate-800 p-4 flex flex-col items-center gap-1 transition-transform hover:-translate-y-1"
    >
      <div
        className="absolute inset-x-0 top-0 h-16 opacity-70 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(180deg, ${accentDark}, transparent)` }}
      />

      <span className="relative font-display text-xs font-semibold text-white/60">
        #{String(pokemon.pokeapiId).padStart(3, '0')}
      </span>

      <img
        src={pokemon.imageUrl}
        alt={pokemon.name}
        className="relative w-24 h-24 object-contain drop-shadow-lg"
        loading="lazy"
      />

      <span className="relative capitalize font-display font-semibold text-sm">
        {pokemon.name}
      </span>

      <div className="relative flex gap-1 flex-wrap justify-center mt-1">
        <TypeBadge type={pokemon.primaryType} />
        {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
      </div>
    </Link>
  )
}

export default PokemonCard