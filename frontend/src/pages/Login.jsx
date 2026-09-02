import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const justRegistered = location.state?.justRegistered
  const passwordReset = location.state?.passwordReset

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await api.post('/auth/login', form)
      login(response.data.token, response.data.username)
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message ?? 'Não foi possível entrar.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-800 rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Entrar</h1>
        <p className="text-slate-400 text-sm mb-6">
          Acesse sua coleção e seus times.
        </p>

        {justRegistered && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-2 mb-4">
            Conta criada! Faça login para continuar.
          </div>
        )}
        {passwordReset && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-2 mb-4">
            Senha redefinida! Faça login com sua nova senha.
          </div>
        )}

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
            <label className="text-sm text-slate-400 block mb-1">Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-2.5 mt-2 transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="text-right -mt-2">
            <Link to="/esqueci-senha" className="text-sm text-slate-400 hover:text-white hover:underline">
              Esqueci minha senha
            </Link>
          </div>
        </form>


        <p className="text-sm text-slate-400 text-center mt-6">
          Não tem conta?{' '}
          <Link to="/cadastro" className="text-white hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login