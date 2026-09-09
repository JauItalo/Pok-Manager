import { useEffect, useState } from 'react'
import api from '../api/axios'

function AddPokemonToTeamModal({ existingIds, onClose, onAdd }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [addingId, setAddingId] = useState(null)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            search()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [query])

    async function search() {
        setLoading(true)
        try {
            const response = await api.get('/pokemon', {
                params: { name: query || undefined, size: 50 },
            })
            setResults(response.data.content)
        } finally {
            setLoading(false)
        }
    }

    async function handleAdd(pokemon) {
        setAddingId(pokemon.id)
        try {
            await onAdd(pokemon.id)
        } finally {
            setAddingId(null)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold">Adicionar Pokémon</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500 mb-4"
                />

                <div className="flex-1 overflow-y-auto flex flex-col gap-1">
                    {loading && <p className="text-slate-400 text-sm px-2">Buscando...</p>}

                    {!loading &&
                        results.map((pokemon) => {
                            const alreadyInTeam = existingIds.includes(pokemon.id)

                            return (
                                <button
                                    key={pokemon.id}
                                    onClick={() => handleAdd(pokemon)}
                                    disabled={alreadyInTeam || addingId === pokemon.id}
                                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-left"
                                >
                                    <img
                                        src={pokemon.imageUrl}
                                        alt={pokemon.name}
                                        className="w-10 h-10 object-contain"
                                    />
                                    <span className="capitalize text-sm flex-1">{pokemon.name}</span>
                                    {alreadyInTeam && (
                                        <span className="text-xs text-slate-500">Já no time</span>
                                    )}
                                </button>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default AddPokemonToTeamModal