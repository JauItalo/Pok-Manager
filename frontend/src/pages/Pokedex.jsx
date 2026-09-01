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
    }, 300) // debounce: espera 300ms depois que o usuário para de digitar

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pokédex</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
        >
          <option value="">Todos os tipos</option>
          {Object.entries(TYPE_LABELS_PT).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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