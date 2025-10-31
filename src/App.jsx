import { usePokemon } from './hooks/usePokemon';
import PokemonCard from './components/PokemonCard';
import TeamView from './components/TeamView';
import BattleView from './components/BattleView';

function App() {
  const {
    pokemons,
    selectedTeam,
    loading,
    fetchRandomPokemons,
    toggleSelection,
    getTeamPower,
    getBattleData
  } = usePokemon();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">🔴 Pokédex Battle</h1>
        <p className="text-center text-gray-600 mb-6">Selecciona 3 Pokémon para tu equipo</p>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">
            Seleccionados: <span className="text-blue-600">{selectedTeam.length}/3</span>
          </div>
          
          <button
            onClick={fetchRandomPokemons}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            {loading ? '⏳ Cargando...' : '🔄 Nuevos Pokémon'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {pokemons.map(pokemon => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isSelected={selectedTeam.some(p => p.id === pokemon.id)}
              onToggle={() => toggleSelection(pokemon)}
              disabled={selectedTeam.length >= 3 && !selectedTeam.some(p => p.id === pokemon.id)}
            />
          ))}
        </div>
        
        {selectedTeam.length === 3 && (
          <>
            <TeamView 
              team={selectedTeam}
              totalPower={getTeamPower()}
              battleData={getBattleData()}
            />
            
            <BattleView battleData={getBattleData()} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;