import { Link } from 'react-router-dom'
import { TYPE_COLORS } from '../utils/typeColors'

function FavoritesCarousel({ favorites }) {
  if (favorites.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-6 text-center">
        <p className="text-slate-400 text-sm">
          Você ainda não marcou nenhum Pokémon como favorito.
        </p>
        <Link to="/pokedex" className="text-sm text-white underline mt-1 inline-block">
          Ir para a podekex
        </Link>
      </div>
    )
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {favorites.map((entry) => {
        const color = TYPE_COLORS[entry.pokemon.primaryType] ?? '#777'

        return (
          <Link
            key={entry.id}
            to={`/pokemon/${entry.pokemon.id}`}
            className="shrink-0 w-24 bg-slate-800 rounded-xl p-3 flex flex-col items-center hover:bg-slate-700 transition-colors"
          >
            <img
              src={entry.pokemon.imageUrl}
              alt={entry.pokemon.name}
              className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-medium capitalize mt-1 truncate w-full text-center">
              {entry.nickname || entry.pokemon.name}
            </span>
            <span
              className="w-2 h-2 rounded-full mt-1"
              style={{ backgroundColor: color }}
            />
          </Link>
        )
      })}
    </div>
  )
}

export default FavoritesCarousel