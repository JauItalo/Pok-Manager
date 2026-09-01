import { Routes, Route } from 'react-router-dom'
import Pokedex from './pages/Pokedex'
import PokemonDetail from './pages/PokemonDetail'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </div>
  )
}

export default App