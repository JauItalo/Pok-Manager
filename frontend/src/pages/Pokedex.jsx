import { useEffect, useState } from 'react'
import api from '../api/axios'
import PokemonCard from '../components/PokemonCard'
import { TYPE_LABELS_PT } from '../utils/typeColors'

function Pokedex() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [nameInput, setNameInput] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPokemons()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [nameInput, typeFilter])

  async function fetchPokemons() {
    setLoading(true)
    setError(null)

    try {
      const params = {}
      if (nameInput.trim()) params.name = nameInput.trim()
      if (typeFilter) params.type = typeFilter

      const response = await api.get('/pokemon', { params })
      setPokemons(response.data)
    } catch (err) {
      setError('Não foi possível carregar os Pokémon. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
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
            {!loading ? pokemons.length : '...'}
          </span>{' '}
          <span className="text-blue-400">Pokémon encontrados</span>
        </div>
      </div>

      {loading && <p className="text-slate-400">Carregando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && pokemons.length === 0 && (
        <p className="text-slate-400">Nenhum Pokémon encontrado.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  )
}

export default Pokedex