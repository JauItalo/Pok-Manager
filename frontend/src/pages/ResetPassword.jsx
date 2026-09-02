import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/reset-password', { token, newPassword })
      navigate('/login', { state: { passwordReset: true } })
    } catch (err) {
      const message =
        err.response?.data?.message ?? 'Não foi possível redefinir sua senha.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-red-400 mb-4">Link inválido ou incompleto.</p>
        <Link to="/esqueci-senha" className="text-white hover:underline">
          Pedir um novo link
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-800 rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Redefinir senha</h1>
        <p className="text-slate-400 text-sm mb-6">
          Escolha uma nova senha para sua conta.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1">Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Confirmar senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword