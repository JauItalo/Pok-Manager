import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import TypeBadge from '../components/TypeBadge'
import AddPokemonToTeamModal from '../components/AddPokemonToTeamModal'
import TeamAnalysisPanel from '../components/TeamAnalysisPanel'

function TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [team, setTeam] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')

  useEffect(() => {
    fetchTeam()
  }, [id])

  async function fetchTeam() {
    setLoading(true)
    setError(null)
    try {
      const [teamRes, analysisRes] = await Promise.all([
        api.get(`/teams/${id}`),
        api.get(`/teams/${id}/analysis`),
      ])
      setTeam(teamRes.data)
      setAnalysis(analysisRes.data)
      setNameInput(teamRes.data.name)
    } catch (err) {
      setError('Não foi possível carregar esse time.')
    } finally {
      setLoading(false)
    }
  }

  async function refreshAnalysis() {
    const response = await api.get(`/teams/${id}/analysis`)
    setAnalysis(response.data)
  }

  async function handleAddPokemon(pokemonId) {
    const response = await api.post(`/teams/${id}/pokemons`, { pokemonId })
    setTeam(response.data)
    setShowAddModal(false)
    refreshAnalysis()
  }

  async function handleRemovePokemon(entryId) {
    const response = await api.delete(`/teams/${id}/pokemons/${entryId}`)
    setTeam(response.data)
    refreshAnalysis()
  }

  async function handleRename(e) {
    e.preventDefault()
    if (!nameInput.trim()) return

    const response = await api.patch(`/teams/${id}`, { name: nameInput.trim() })
    setTeam(response.data)
    setEditingName(false)
  }

  async function handleDeleteTeam() {
    if (!window.confirm(`Apagar o time "${team.name}"? Essa ação não pode ser desfeita.`)) return

    await api.delete(`/teams/${id}`)
    navigate('/times')
  }

  if (loading) {
    return <p className="text-slate-400 text-center mt-10">Carregando...</p>
  }

  if (error || !team) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/times" className="text-blue-400 hover:underline">
          Voltar para times
        </Link>
      </div>
    )
  }

  const existingIds = team.pokemons.map((m) => m.pokemon.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/times" className="text-slate-400 hover:text-white text-sm">
        ← Voltar para times
      </Link>

      <div className="flex items-center justify-between mt-4 mb-8">
        {editingName ? (
          <form onSubmit={handleRename} className="flex gap-2 flex-1 max-w-sm">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={50}
              autoFocus
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-lg px-4 transition-colors"
            >
              Salvar
            </button>
          </form>
        ) : (
          <h1
            onClick={() => setEditingName(true)}
            className="font-display text-3xl font-bold cursor-pointer hover:text-slate-300 transition-colors"
            title="Clique para renomear"
          >
            {team.name} ✎
          </h1>
        )}

        <button
          onClick={handleDeleteTeam}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Apagar time
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {Array.from({ length: 6 }).map((_, i) => {
          const member = team.pokemons[i]

          if (!member) {
            return (
              <button
                key={i}
                onClick={() => setShowAddModal(true)}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600 hover:border-slate-500 hover:text-slate-400 transition-colors"
              >
                <span className="text-3xl">+</span>
              </button>
            )
          }

          return (
            <div
              key={member.entryId}
              className="relative bg-slate-800 rounded-2xl p-3 flex flex-col items-center"
            >
              <button
                onClick={() => handleRemovePokemon(member.entryId)}
                className="absolute top-2 right-2 text-slate-500 hover:text-red-400 text-sm leading-none"
                title="Remover do time"
              >
                ×
              </button>
              <Link to={`/pokemon/${member.pokemon.id}`}>
                <img
                  src={member.pokemon.imageUrl}
                  alt={member.pokemon.name}
                  className="w-16 h-16 object-contain"
                />
              </Link>
              <span className="text-xs font-medium capitalize mt-1">
                {member.pokemon.name}
              </span>
              <div className="flex gap-1 mt-1">
                <TypeBadge type={member.pokemon.primaryType} />
                {member.pokemon.secondaryType && (
                  <TypeBadge type={member.pokemon.secondaryType} />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="font-display text-xl font-bold mb-4">Análise do Time</h2>

      {team.pokemons.length === 0 ? (
        <p className="text-slate-400 text-sm">
          Adicione Pokémon ao time para ver a análise de cobertura e fraquezas.
        </p>
      ) : (
        analysis && <TeamAnalysisPanel analysis={analysis} />
      )}

      {showAddModal && (
        <AddPokemonToTeamModal
          existingIds={existingIds}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPokemon}
        />
      )}
    </div>
  )
}

export default TeamDetail