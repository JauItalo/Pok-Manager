import { useEffect, useState } from 'react'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

function Profile() {
  const storeUsername = useAuthStore((state) => state.username)
  const login = useAuthStore((state) => state.login)
  const token = useAuthStore((state) => state.token)

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [usernameInput, setUsernameInput] = useState('')
  const [savingUsername, setSavingUsername] = useState(false)
  const [usernameMessage, setUsernameMessage] = useState(null)

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/users/me')
      setProfile(response.data)
      setUsernameInput(response.data.username)
    } catch (err) {
      setError('Não foi possível carregar seu perfil.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateUsername(e) {
    e.preventDefault()
    setUsernameMessage(null)
    setSavingUsername(true)

    try {
      const response = await api.patch('/users/me', { username: usernameInput })
      setProfile(response.data)
      login(token, response.data.username) // sincroniza o username no Navbar também
      setUsernameMessage({ type: 'success', text: 'Username atualizado!' })
    } catch (err) {
      const text = err.response?.data?.message ?? 'Não foi possível atualizar.'
      setUsernameMessage({ type: 'error', text })
    } finally {
      setSavingUsername(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPasswordMessage(null)
    setPasswordError(null)
    setSavingPassword(true)

    try {
      await api.post('/users/me/change-password', passwordForm)
      setPasswordMessage('Senha alterada com sucesso!')
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (err) {
      setPasswordError(err.response?.data?.message ?? 'Não foi possível alterar a senha.')
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return <p className="text-slate-400 text-center mt-10">Carregando...</p>
  }

  if (error || !profile) {
    return <p className="text-red-400 text-center mt-10">{error}</p>
  }

  const memberSince = new Date(profile.memberSince).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold">Meu Perfil</h1>
        <p className="text-slate-400 text-sm mt-1">Membro desde {memberSince}</p>
      </header>

      {/* RESUMO */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 rounded-2xl p-5 text-center">
          <span className="font-display text-3xl font-bold block">
            {profile.collectionCount}
          </span>
          <span className="text-xs text-slate-400">Na coleção</span>
        </div>
        <div className="bg-slate-800 rounded-2xl p-5 text-center">
          <span className="font-display text-3xl font-bold block">
            {profile.favoriteCount}
          </span>
          <span className="text-xs text-slate-400">Favoritos</span>
        </div>
        <div className="bg-slate-800 rounded-2xl p-5 text-center">
          <span className="font-display text-3xl font-bold block">
            {profile.teamCount}
          </span>
          <span className="text-xs text-slate-400">Times</span>
        </div>
      </div>

      {/* DADOS DA CONTA */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="font-display font-bold text-lg mb-4">Dados da conta</h2>

        <div className="mb-4">
          <span className="text-sm text-slate-400 block mb-1">Email</span>
          <span className="text-sm">{profile.email}</span>
        </div>

        <form onSubmit={handleUpdateUsername} className="flex flex-col gap-2">
          <label className="text-sm text-slate-400">Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              maxLength={50}
              minLength={3}
              required
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              disabled={savingUsername || usernameInput === profile.username}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white font-medium rounded-lg px-4 transition-colors"
            >
              {savingUsername ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          {usernameMessage && (
            <p
              className={`text-sm mt-1 ${
                usernameMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {usernameMessage.text}
            </p>
          )}
        </form>
      </div>

      {/* TROCAR SENHA */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg mb-4">Alterar senha</h2>

        {passwordMessage && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-2 mb-4">
            {passwordMessage}
          </div>
        )}
        {passwordError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1">Senha atual</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Nova senha</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              required
              minLength={6}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-2.5 self-start transition-colors"
          >
            {savingPassword ? 'Salvando...' : 'Alterar senha'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile