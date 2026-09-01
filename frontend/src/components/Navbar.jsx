import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Pokédex', path: '/', enabled: true },
  { label: 'Coleção', path: '/colecao', enabled: false },
  { label: 'Times', path: '/times', enabled: false },
]

function Navbar() {
  const location = useLocation()

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
        </div>
      </div>
    </nav>
  )
}

export default Navbar