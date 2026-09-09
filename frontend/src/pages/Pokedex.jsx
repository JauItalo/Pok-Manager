import { useEffect, useState } from 'react'
import api from '../api/axios'
import PokemonCard from '../components/PokemonCard'
import { TYPE_LABELS_PT } from '../utils/typeColors'

const PAGE_SIZE = 24

function Pokedex() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [nameInput, setNameInput] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // sempre que o filtro mudar, volta pra primeira página
  useEffect(() => {
    setPage(0)
  }, [nameInput, typeFilter])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPokemons()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [nameInput, typeFilter, page])

  async function fetchPokemons() {
    setLoading(true)
    setError(null)

    try {
      const params = { page, size: PAGE_SIZE }
      if (nameInput.trim()) params.name = nameInput.trim()
      if (typeFilter) params.type = typeFilter

      const response = await api.get('/pokemon', { params })
      setPokemons(response.data.content)
      setTotalPages(response.data.totalPages)
      setTotalElements(response.data.totalElements)
    } catch (err) {
      setError('Não foi possível carregar os Pokémon. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  function goToPage(newPage) {
    if (newPage < 0 || newPage >= totalPages) return
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight">
          Pokédex
        </h1>
        <p className="text-slate-400 mt-3">
          Encontre Pokémon por nome ou elemento.
        </p>
      </header>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6 mb-8">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Buscar Pokémon
        </span>
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Nome ou número da Pokédex"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-slate-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div>
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block mb-1.5">
              Elemento
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 outline-none focus:border-slate-500 transition-colors"
            >
              <option value="">Todos</option>
              {Object.entries(TYPE_LABELS_PT).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-5 pt-4">
          <span className="text-white font-semibold">
            {!loading ? totalElements : '...'}
          </span>{' '}
          <span className="text-blue-400">Pokémon encontrados</span>
        </div>
      </div>

      {loading && <p className="text-slate-400">Carregando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && pokemons.length === 0 && (
        <p className="text-slate-400">Nenhum Pokémon encontrado.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            ← Anterior
          </button>

          <span className="text-sm text-slate-400">
            Página <span className="text-white font-semibold">{page + 1}</span> de{' '}
            <span className="text-white font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  )
}

export default Pokedex