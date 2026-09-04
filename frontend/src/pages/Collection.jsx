import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import CollectionEntryCard from '../components/CollectionEntryCard'
import EditEntryModal from '../components/EditEntryModal'

function Collection() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)

  useEffect(() => {
    fetchCollection()
  }, [])

  async function fetchCollection() {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/collection')
      setEntries(response.data)
    } catch (err) {
      setError('Não foi possível carregar sua coleção.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleFavorite(entry) {
    const response = await api.patch(`/collection/${entry.id}`, {
      favorite: !entry.favorite,
    })
    setEntries(entries.map((e) => (e.id === entry.id ? response.data : e)))
  }

  async function handleDelete(entry) {
    const label = entry.nickname || entry.pokemon.name
    if (!window.confirm(`Remover ${label} da sua coleção?`)) return

    await api.delete(`/collection/${entry.id}`)
    setEntries(entries.filter((e) => e.id !== entry.id))
  }

  function handleSaved(updatedEntry) {
    setEntries(entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e)))
    setEditingEntry(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold">Coleção</h1>
        <p className="text-slate-400 text-sm mt-1">
          {!loading && entries.length > 0
            ? `${entries.length} Pokémon na sua coleção`
            : 'Seus Pokémon, do seu jeito'}
        </p>
      </header>

      {loading && <p className="text-slate-400">Carregando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <div className="bg-slate-800/50 rounded-2xl p-10 text-center">
          <p className="text-slate-400 mb-4">
            Sua coleção está vazia. Adicione Pokémon a partir da Pokédex.
          </p>
          <Link
            to="/pokedex"
            className="inline-block bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg px-6 py-2.5 transition-colors"
          >
            Explorar Pokédex
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {entries.map((entry) => (
          <CollectionEntryCard
            key={entry.id}
            entry={entry}
            onEdit={setEditingEntry}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default Collection