import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import TypeBadge from '../components/TypeBadge'
import StatBar from '../components/StatBar'
import TypeEffectPill from '../components/TypeEffectPill'
import { TYPE_COLORS, TYPE_COLORS_DARK } from '../utils/typeColors'

const STAT_LABELS = [
  ['hp', 'HP'],
  ['attack', 'Ataque'],
  ['defense', 'Defesa'],
  ['specialAttack', 'Atq. Especial'],
  ['specialDefense', 'Def. Especial'],
  ['speed', 'Velocidade'],
]

function PokemonDetail() {
  const { id } = useParams()

  const [pokemon, setPokemon] = useState(null)
  const [effectiveness, setEffectiveness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    setLoading(true)
    setError(null)

    try {
      const [pokemonRes, effectivenessRes] = await Promise.all([
        api.get(`/pokemon/${id}`),
        api.get(`/pokemon/${id}/effectiveness`),
      ])
      setPokemon(pokemonRes.data)
      setEffectiveness(effectivenessRes.data)
    } catch (err) {
      setError('Não foi possível carregar esse Pokémon.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-slate-400 text-center mt-10">Carregando...</p>
  }

  if (error || !pokemon) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/" className="text-blue-400 hover:underline">
          Voltar pra Pokédex
        </Link>
      </div>
    )
  }

  const accent = TYPE_COLORS[pokemon.primaryType]
  const accentDark = TYPE_COLORS_DARK[pokemon.primaryType]
  const secondaryAccent = pokemon.secondaryType
    ? TYPE_COLORS_DARK[pokemon.secondaryType]
    : accentDark

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* HERO */}
      <div
        className="relative overflow-hidden rounded-b-[2.5rem] px-6 pt-6 pb-10"
        style={{
          background: `linear-gradient(160deg, ${accentDark} 0%, ${secondaryAccent} 100%)`,
        }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
        >
          ← Voltar
        </Link>

        <div className="flex flex-col items-center mt-2">
          <span className="font-display text-white/50 text-lg font-semibold">
            #{String(pokemon.pokeapiId).padStart(3, '0')}
          </span>

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-40"
            style={{ backgroundColor: accent }}
          />

          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            className="relative w-52 h-52 object-contain drop-shadow-2xl"
          />

          <h1 className="font-display text-4xl font-bold capitalize text-white mt-1">
            {pokemon.name}
          </h1>

          <div className="flex gap-2 mt-3">
            <TypeBadge type={pokemon.primaryType} />
            {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-6 px-4 mt-8">
        <section>
          <h2
            className="font-display text-lg font-bold mb-4 pl-3 border-l-4"
            style={{ borderColor: accent }}
          >
            Status Base
          </h2>
          <div className="flex flex-col gap-3">
            {STAT_LABELS.map(([key, label]) => (
              <StatBar key={key} label={label} value={pokemon[key]} accentColor={accent} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div>
            <h2
              className="font-display text-lg font-bold mb-3 pl-3 border-l-4"
              style={{ borderColor: accent }}
            >
              Fraquezas
            </h2>
            {effectiveness.weaknesses.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma fraqueza notável.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {effectiveness.weaknesses.map((w) => (
                  <TypeEffectPill key={w.type} type={w.type} multiplier={w.multiplier} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2
              className="font-display text-lg font-bold mb-3 pl-3 border-l-4"
              style={{ borderColor: accent }}
            >
              Resistências
            </h2>
            {effectiveness.resistances.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma resistência notável.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {effectiveness.resistances.map((r) => (
                  <TypeEffectPill key={r.type} type={r.type} multiplier={r.multiplier} />
                ))}
              </div>
            )}
          </div>

          {effectiveness.immunities.length > 0 && (
            <div>
              <h2
                className="font-display text-lg font-bold mb-3 pl-3 border-l-4"
                style={{ borderColor: accent }}
              >
                Imunidades
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {effectiveness.immunities.map((i) => (
                  <TypeEffectPill key={i.type} type={i.type} multiplier={i.multiplier} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default PokemonDetail