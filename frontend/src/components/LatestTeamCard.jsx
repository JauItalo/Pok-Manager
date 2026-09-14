import { Link } from 'react-router-dom'
import ScoreRing from './ScoreRing'

function LatestTeamCard({ team, analysis }) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wide">
            Seu time mais recente
          </span>
          <h3 className="font-display font-bold text-lg">{team.name}</h3>
        </div>
        <Link
          to={`/times/${team.id}`}
          className="text-sm text-white bg-slate-700 hover:bg-slate-600 rounded-lg px-4 py-2 transition-colors shrink-0"
        >
          Ver time
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => {
            const member = team.pokemons[i]
            return (
              <div
                key={i}
                className="w-11 h-11 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden shrink-0"
              >
                {member ? (
                  <img
                    src={member.pokemon.imageUrl}
                    alt={member.pokemon.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-slate-700 text-sm">+</span>
                )}
              </div>
            )
          })}
        </div>

        {analysis && (
          <div className="flex gap-4 ml-auto">
            <ScoreRing label="Cobertura" percentage={analysis.typeCoverage} />
            <ScoreRing label="Equilíbrio" percentage={analysis.balance} />
          </div>
        )}
      </div>
    </div>
  )
}

export default LatestTeamCard