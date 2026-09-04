import { useEffect, useState } from 'react'
import api from '../api/axios'
import { NATURE_LABELS_PT } from '../utils/natures'

function EditEntryModal({ entry, onClose, onSaved }) {
  const [abilities, setAbilities] = useState([])
  const [loadingAbilities, setLoadingAbilities] = useState(true)

  const [form, setForm] = useState({
    captured: entry.captured,
    level: entry.level ?? '',
    nature: entry.nature ?? '',
    abilityName: entry.ability ?? '',
    nickname: entry.nickname ?? '',
    obtainedMethod: entry.obtainedMethod ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAbilities()
  }, [])

  async function fetchAbilities() {
    try {
      const response = await api.get(`/pokemon/${entry.pokemon.id}`)
      setAbilities(response.data.abilities)
    } finally {
      setLoadingAbilities(false)
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const selectedAbility = abilities.find((a) => a.name === form.abilityName)

    const payload = {
      captured: form.captured,
      level: form.level === '' ? null : Number(form.level),
      nature: form.nature === '' ? null : form.nature,
      abilityId: selectedAbility ? selectedAbility.id : null,
      nickname: form.nickname === '' ? null : form.nickname,
      obtainedMethod: form.obtainedMethod === '' ? null : form.obtainedMethod,
    }

    try {
      const response = await api.patch(`/collection/${entry.id}`, payload)
      onSaved(response.data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold capitalize">
            Editar {entry.nickname || entry.pokemon.name}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="captured"
              checked={form.captured}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Capturado
          </label>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Apelido</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              maxLength={50}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Nível</label>
            <input
              type="number"
              name="level"
              value={form.level}
              onChange={handleChange}
              min={1}
              max={100}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Natureza</label>
            <select
              name="nature"
              value={form.nature}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-slate-500"
            >
              <option value="">Não definida</option>
              {Object.entries(NATURE_LABELS_PT).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Habilidade</label>
            <select
              name="abilityName"
              value={form.abilityName}
              onChange={handleChange}
              disabled={loadingAbilities}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-slate-500 disabled:opacity-50"
            >
              <option value="">Não definida</option>
              {abilities.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name.replace('-', ' ')} {a.hidden ? '(oculta)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Como conseguiu</label>
            <input
              type="text"
              name="obtainedMethod"
              value={form.obtainedMethod}
              onChange={handleChange}
              maxLength={255}
              placeholder="Ex: Trocado com um amigo"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-4 py-2.5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-2.5 transition-colors"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEntryModal