import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/axios'
import TypeBadge from '../components/TypeBadge'
import ScoreRing from '../components/ScoreRing'
import ComparisonWeaknessRow from '../components/ComparisonWeaknessRow'

function TeamCompare() {
  const [searchParams] = useSearchParams()
  const idA = searchParams.get('a')
  const idB = searchParams.get('b')

  const [teamA, setTeamA] = useState(null)
  const [teamB, setTeamB] = useState(null)
  const [analysisA, setAnalysisA] = useState(null)
  const [analysisB, setAnalysisB] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!idA || !idB) {
      setError('Selecione dois times na listagem para comparar.')
      setLoading(false)
      return
    }
    fetchComparison()
  }, [idA, idB])

  async function fetchComparison() {
    setLoading(true)
    setError(null)
    try {
      const [teamARes, teamBRes, analysisARes, analysisBRes] = await Promise.all([
        api.get(`/teams/${idA}`),
        api.get(`/teams/${idB}`),
        api.get(`/teams/${idA}/analysis`),
        api.get(`/teams/${idB}/analysis`),
      ])
      setTeamA(teamARes.data)
      setTeamB(teamBRes.data)
      setAnalysisA(analysisARes.data)
      setAnalysisB(analysisBRes.data)
    } catch (err) {
      setError('Não foi possível carregar a comparação.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-slate-400 text-center mt-10">Carregando...</p>
  }

  if (error || !teamA || !teamB) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/times" className="text-blue-400 hover:underline">
          Voltar para times
        </Link>
      </div>
    )
  }

  const allWeaknessTypes = Array.from(
    new Set([
      ...analysisA.weaknesses.map((w) => w.type),
      ...analysisB.weaknesses.map((w) => w.type),
    ])
  )

  function findPercentage(analysis, type) {
    return analysis.weaknesses.find((w) => w.type === type)?.percentage ?? 0
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/times" className="text-slate-400 hover:text-white text-sm">
        ← Voltar para times
      </Link>

      <h1 className="font-display text-3xl font-bold mt-4 mb-8 text-center">
        Comparando times
      </h1>

      <div className="grid grid-cols-2 gap-6 mb-10">
        {[teamA, teamB].map((team, index) => (
          <div key={team.id} className="text-center">
            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${
                index === 0 ? 'bg-indigo-500/20 text-indigo-300' : 'bg-orange-500/20 text-orange-300'
              }`}
            >
              Time {index === 0 ? 'A' : 'B'}
            </span>
            <h2 className="font-display font-bold text-xl mb-3">{team.name}</h2>

            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => {
                const member = team.pokemons[i]
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden"
                  >
                    {member ? (
                      <img
                        src={member.pokemon.imageUrl}
                        alt={member.pokemon.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-slate-700">-</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 mb-6">
        <h3 className="font-display font-bold text-center mb-6">Cobertura & Equilíbrio</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex justify-center gap-6">
            <ScoreRing label="Cobertura" percentage={analysisA.typeCoverage} />
            <ScoreRing label="Equilíbrio" percentage={analysisA.balance} />
          </div>
          <div className="flex justify-center gap-6">
            <ScoreRing label="Cobertura" percentage={analysisB.typeCoverage} />
            <ScoreRing label="Equilíbrio" percentage={analysisB.balance} />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6">
        <div className="flex justify-center gap-8 mb-6 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-indigo-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Time A
          </span>
          <span className="flex items-center gap-1.5 text-orange-300">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" /> Time B
          </span>
        </div>

        <h3 className="font-display font-bold text-center mb-4">Fraquezas comparadas</h3>

        {allWeaknessTypes.length === 0 ? (
          <p className="text-sm text-slate-500 text-center">
            Nenhum dos dois times possui fraquezas significativas.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {allWeaknessTypes.map((type) => (
              <ComparisonWeaknessRow
                key={type}
                type={type}
                percentageA={findPercentage(analysisA, type)}
                percentageB={findPercentage(analysisB, type)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamCompare