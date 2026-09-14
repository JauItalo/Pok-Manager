import { Link } from 'react-router-dom'

function ProfileSummaryStrip({ collectionCount, favoriteCount, teamCount }) {
  const items = [
    { label: 'Na coleção', value: collectionCount, path: '/colecao' },
    { label: 'Favoritos', value: favoriteCount, path: '/colecao' },
    { label: 'Times', value: teamCount, path: '/times' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className="bg-slate-800 rounded-2xl p-4 text-center hover:bg-slate-700 transition-colors"
        >
          <span className="font-display text-2xl font-bold block">{item.value}</span>
          <span className="text-xs text-slate-400">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}

export default ProfileSummaryStrip