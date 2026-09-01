import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import TypeBadge from '../components/TypeBadge'
import { TYPE_COLORS, TYPE_COLORS_DARK } from '../utils/typeColors'
import { getDayOfYear } from '../utils/dayOfYear'

const QUICK_LINKS = [
  {
    label: 'Pokédex',
    description: 'Consulte todos os Pokémon, filtre por tipo e veja fraquezas.',
    path: '/pokedex',
    enabled: true,
  },
  {
    label: 'Coleção',
    description: 'Marque quais você já capturou e organize sua coleção.',
    path: '/colecao',
    enabled: false,
  },
  {
    label: 'Times',
    description: 'Monte times de até 6 e analise a cobertura de tipos.',
    path: '/times',
    enabled: false,
  },
]

function Home() {
  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatured()
  }, [])

  async function fetchFeatured() {
    try {
      const response = await api.get('/pokemon')
      const all = response.data

      if (all.length > 0) {
        const index = getDayOfYear() % all.length
        setFeatured(all[index])
      }
    } catch (err) {
      // silencioso: a home degrada bem sem o destaque
    } finally {
      setLoading(false)
    }
  }

  const accent = featured ? TYPE_COLORS[featured.primaryType] : '#F08030'
  const accentDark = featured ? TYPE_COLORS_DARK[featured.primaryType] : '#9C4A1A'
  const secondaryAccent = featured?.secondaryType
    ? TYPE_COLORS_DARK[featured.secondaryType]
    : accentDark

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HERO */}
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 mb-10"
        style={{
          background: `linear-gradient(135deg, ${accentDark} 0%, ${secondaryAccent} 100%)`,
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
              Sua coleção Pokémon,
              <br />
              organizada de verdade.
            </h1>
            <p className="text-white/80 mt-4 max-w-md">
              Consulte a Pokédex completa, monte sua coleção pessoal e analise
              a cobertura de tipos dos seus times.
            </p>
            <Link
              to="/pokedex"
              className="inline-block mt-6 bg-white text-slate-900 font-semibold px-6 py-2.5 rounded-xl hover:bg-white/90 transition-colors"
            >
              Explorar Pokédex
            </Link>
          </div>

          {featured && (
            <Link
              to={`/pokemon/${featured.id}`}
              className="relative shrink-0 flex flex-col items-center bg-black/20 rounded-2xl px-8 py-5 hover:bg-black/30 transition-colors"
            >
              <span className="font-display text-sm font-bold text-white bg-white/15 px-4 py-1.5 rounded-full uppercase tracking-wider">
                Destaque do dia
              </span>

              <div className="relative w-32 h-32 flex items-center justify-center mt-3">
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-50"
                  style={{ backgroundColor: accent }}
                />
                <img
                  src={featured.imageUrl}
                  alt={featured.name}
                  className="relative w-32 h-32 object-contain drop-shadow-2xl"
                />
              </div>

              <span className="font-display font-bold capitalize text-white mt-1">
                {featured.name}
              </span>
              <div className="flex gap-1 mt-1 justify-center">
                <TypeBadge type={featured.primaryType} />
                {featured.secondaryType && <TypeBadge type={featured.secondaryType} />}
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* ATALHOS */}
      <div className="grid sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map((link) => {
          const content = (
            <>
              <h2 className="font-display font-bold text-lg">{link.label}</h2>
              <p className="text-sm text-slate-400 mt-1">{link.description}</p>
              {!link.enabled && (
                <span className="inline-block mt-3 text-xs font-semibold text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                  Em breve
                </span>
              )}
            </>
          )

          if (!link.enabled) {
            return (
              <div
                key={link.label}
                className="min-h-[132px] rounded-2xl bg-slate-800/50 p-5 opacity-60 cursor-not-allowed"
              >
                {content}
              </div>
            )
          }

          return (
            <Link
              key={link.label}
              to={link.path}
              className="min-h-[132px] rounded-2xl bg-slate-800 p-5 hover:bg-slate-700 transition-colors"
            >
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Home