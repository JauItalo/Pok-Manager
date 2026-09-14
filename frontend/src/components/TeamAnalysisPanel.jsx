import WeaknessBar from './WeaknessBar'
import ScoreRing from './ScoreRing'
import { TYPE_LABELS_PT } from '../utils/typeColors'

function TeamAnalysisPanel({ analysis }) {
  const { weaknesses, typeCoverage, balance, suggestions } = analysis

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6">
      <div className="flex justify-center gap-8 mb-6">
        <ScoreRing label="Cobertura de tipos" percentage={typeCoverage} />
        <ScoreRing label="Equilíbrio" percentage={balance} />
      </div>

      <h3 className="font-display font-bold mb-3">Fraquezas do time</h3>
      {weaknesses.length === 0 ? (
        <p className="text-sm text-slate-500 mb-6">
          Nenhuma fraqueza significativa detectada.
        </p>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {weaknesses.map((w) => (
            <WeaknessBar key={w.type} type={w.type} percentage={w.percentage} />
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <>
          <h3 className="font-display font-bold mb-3">Sugestões</h3>
          <div className="flex flex-col gap-2">
            {suggestions.map((s) => (
              <div
                key={s.weakAgainstType}
                className="bg-slate-900 rounded-lg px-4 py-3 text-sm text-slate-300"
              >
                Seu time possui{' '}
                <span className="text-white font-semibold">
                  {s.weaknessPercentage}% de vulnerabilidade
                </span>{' '}
                contra ataques do tipo{' '}
                <span className="text-white font-semibold">
                  {TYPE_LABELS_PT[s.weakAgainstType]}
                </span>
                . Considere adicionar um Pokémon do tipo{' '}
                <span className="text-white font-semibold">
                  {s.recommendedTypes.map((t) => TYPE_LABELS_PT[t]).join(' ou ')}
                </span>
                .
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TeamAnalysisPanel