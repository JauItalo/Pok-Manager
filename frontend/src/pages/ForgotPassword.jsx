import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
    } finally {
      // sempre mostra a mesma mensagem, exista ou não o e-mail (mesma lógica do backend)
      setSubmitted(true)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-800 rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Esqueci minha senha</h1>
        <p className="text-slate-400 text-sm mb-6">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        {submitted ? (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3">
            Se esse e-mail estiver cadastrado, enviamos um link de redefinição.
            Confira sua caixa de entrada.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-2.5 mt-2 transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar link'}
            </button>
          </form>
        )}

        <p className="text-sm text-slate-400 text-center mt-6">
          <Link to="/login" className="text-white hover:underline">
            ← Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword