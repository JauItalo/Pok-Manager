import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await api.post('/auth/register', form)
      navigate('/login', { state: { justRegistered: true } })
    } catch (err) {
      const message = err.response?.data?.message ?? 'Não foi possível criar sua conta.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-800 rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Criar conta</h1>
        <p className="text-slate-400 text-sm mb-6">
          Monte sua coleção e seus times de Pokémon.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-2.5 mt-2 transition-colors"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-sm text-slate-400 text-center mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-white hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register