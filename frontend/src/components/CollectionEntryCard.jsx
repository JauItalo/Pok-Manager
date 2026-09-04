import { Link } from 'react-router-dom'
import TypeBadge from './TypeBadge'
import { TYPE_COLORS_DARK } from '../utils/typeColors'
import { NATURE_LABELS_PT } from '../utils/natures'

function CollectionEntryCard({ entry, onEdit, onToggleFavorite, onDelete }) {
  const { pokemon } = entry
  const accentDark = TYPE_COLORS_DARK[pokemon.primaryType]

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-800">
      <div
        className="h-14 relative"
        style={{ background: `linear-gradient(180deg, ${accentDark}, transparent)` }}
      >
        <button
          onClick={() => onToggleFavorite(entry)}
          className="absolute top-2 right-2 text-xl leading-none"
          title={entry.favorite ? 'Remover dos favoritos' : 'Marcar como favorito'}
        >
          {entry.favorite ? '⭐' : '☆'}
        </button>

        {!entry.captured && (
          <span className="absolute top-2 left-2 text-xs font-semibold bg-black/40 text-white px-2 py-0.5 rounded-full">
            Não capturado
          </span>
        )}
      </div>

      <div className="flex flex-col items-center px-4 -mt-6">
        <Link to={`/pokemon/${pokemon.id}`}>
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            className="w-20 h-20 object-contain drop-shadow-lg"
          />
        </Link>

        <span className="font-display font-bold capitalize text-sm">
          {entry.nickname || pokemon.name}
        </span>
        {entry.nickname && (
          <span className="text-xs text-slate-500 capitalize">{pokemon.name}</span>
        )}

        <div className="flex gap-1 mt-1">
          <TypeBadge type={pokemon.primaryType} />
          {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
        </div>

        <div className="w-full text-xs text-slate-400 mt-3 mb-4 flex flex-col gap-1">
          {entry.level && (
            <div className="flex justify-between">
              <span>Nível</span>
              <span className="text-slate-200 font-medium">{entry.level}</span>
            </div>
          )}
          {entry.nature && (
            <div className="flex justify-between">
              <span>Natureza</span>
              <span className="text-slate-200 font-medium">
                {NATURE_LABELS_PT[entry.nature]}
              </span>
            </div>
          )}
          {entry.ability && (
            <div className="flex justify-between">
              <span>Habilidade</span>
              <span className="text-slate-200 font-medium capitalize">
                {entry.ability.replace('-', ' ')}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 w-full pb-4">
          <button
            onClick={() => onEdit(entry)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded-lg py-2 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(entry)}
            className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg py-2 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollectionEntryCard