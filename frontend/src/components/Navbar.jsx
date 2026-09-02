import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const NAV_ITEMS = [
  { label: 'Início', path: '/', enabled: true },
  { label: 'Pokédex', path: '/pokedex', enabled: true },
  { label: 'Coleção', path: '/colecao', enabled: false },
  { label: 'Times', path: '/times', enabled: false },
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, username, logout } = useAuthStore()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          Poké<span className="text-red-400">Manager</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path

            if (!item.enabled) {
              return (
                <span
                  key={item.label}
                  title="Em breve"
                  className="px-3 py-1.5 text-sm text-slate-600 cursor-not-allowed select-none"
                >
                  {item.label}
                </span>
              )
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          <div className="w-px h-6 bg-slate-700 mx-2" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">
                Olá, <span className="text-white font-medium">{username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="px-3 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-400 text-white font-medium transition-colors"
              >
                Criar conta
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar