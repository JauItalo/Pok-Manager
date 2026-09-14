import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import TeamCard from '../components/TeamCard'

function Teams() {
  const navigate = useNavigate()

  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [creating, setCreating] = useState(false)

  const [compareMode, setCompareMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    fetchTeams()
  }, [])

  async function fetchTeams() {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/teams')
      setTeams(response.data)
    } catch (err) {
      setError('Não foi possível carregar seus times.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newTeamName.trim()) return

    setCreating(true)
    try {
      const response = await api.post('/teams', { name: newTeamName.trim() })
      setTeams([...teams, response.data])
      setNewTeamName('')
      setShowCreateForm(false)
    } finally {
      setCreating(false)
    }
  }

  function toggleCompareMode() {
    setCompareMode(!compareMode)
    setSelectedIds([])
  }

  function toggleSelect(teamId) {
    setSelectedIds((prev) => {
      if (prev.includes(teamId)) {
        return prev.filter((id) => id !== teamId)
      }
      if (prev.length >= 2) {
        return prev
      }
      return [...prev, teamId]
    })
  }

  function goToComparison() {
    if (selectedIds.length !== 2) return
    navigate(`/times/comparar?a=${selectedIds[0]}&b=${selectedIds[1]}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 pb-24">
      <header className="mb-8 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold">Times</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monte suas equipes e analise a cobertura de tipos.
          </p>
        </div>

        <div className="flex gap-2">
          {teams.length >= 2 && (
            <button
              onClick={toggleCompareMode}
              className={`font-semibold rounded-lg px-5 py-2.5 transition-colors ${
                compareMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {compareMode ? 'Cancelar' : 'Comparar times'}
            </button>
          )}

          {!compareMode && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg px-5 py-2.5 transition-colors"
            >
              + Novo time
            </button>
          )}
        </div>
      </header>

      {compareMode && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-3 mb-6 text-sm text-slate-300">
          Selecione 2 times para comparar ({selectedIds.length}/2)
        </div>
      )}

      {showCreateForm && !compareMode && (
        <form
          onSubmit={handleCreate}
          className="bg-slate-800 rounded-2xl p-5 mb-6 flex gap-3"
        >
          <input
            type="text"
            placeholder="Nome do time"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            maxLength={50}
            autoFocus
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold rounded-lg px-5 py-2 transition-colors"
          >
            Criar
          </button>
        </form>
      )}

      {loading && <p className="text-slate-400">Carregando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && teams.length === 0 && (
        <p className="text-slate-400">
          Você ainda não tem times. Crie um para começar a montar sua equipe.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            selectionMode={compareMode}
            selected={selectedIds.includes(team.id)}
            onToggleSelect={() => toggleSelect(team.id)}
          />
        ))}
      </div>

      {compareMode && selectedIds.length === 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
          <button
            onClick={goToComparison}
            className="bg-red-500 hover:bg-red-400 text-white font-semibold rounded-full px-8 py-3 shadow-lg shadow-red-500/30 transition-colors"
          >
            Comparar times selecionados →
          </button>
        </div>
      )}
    </div>
  )
}

export default Teams