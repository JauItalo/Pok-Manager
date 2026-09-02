import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Link inválido ou incompleto.')
      return
    }

    verifyEmail()
  }, [token])

  async function verifyEmail() {
    try {
      await api.post('/auth/verify-email', { token })
      setStatus('success')
    } catch (err) {
      const message =
        err.response?.data?.message ?? 'Não foi possível confirmar sua conta.'
      setStatus('error')
      setErrorMessage(message)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-slate-800 rounded-2xl p-8">
        {status === 'loading' && (
          <p className="text-slate-400">Confirmando sua conta...</p>
        )}

        {status === 'success' && (
          <>
            <h1 className="font-display text-2xl font-bold mb-2">
              Conta confirmada! 🎉
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              Sua conta foi ativada com sucesso. Já pode fazer login.
            </p>
            <Link
              to="/login"
              className="inline-block bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg px-6 py-2.5 transition-colors"
            >
              Ir para o login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="font-display text-2xl font-bold mb-2 text-red-400">
              Não foi possível confirmar
            </h1>
            <p className="text-slate-400 text-sm mb-6">{errorMessage}</p>
            <Link to="/login" className="text-white hover:underline">
              Voltar para o login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail