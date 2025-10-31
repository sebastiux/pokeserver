export default function PokemonCard({ pokemon, isSelected, onToggle, disabled }) {
  const { customStats } = pokemon;
  const typeColors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0'
  };
  
  const primaryType = pokemon.types[0].type.name;
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default;
  
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative p-4 rounded-xl transition-all duration-200 ${
        isSelected 
          ? 'ring-4 ring-blue-500 scale-105 shadow-xl' 
          : 'ring-1 ring-gray-300 hover:scale-102 shadow-md'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
      bg-white`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          ✓
        </div>
      )}
      
      <img 
        src={imageUrl} 
        alt={pokemon.name}
        className="w-32 h-32 mx-auto"
      />
      
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</p>
        <h3 className="text-lg font-bold capitalize">{pokemon.name}</h3>
        
        <div className="flex gap-1 justify-center mt-1">
          {pokemon.types.map(t => (
            <span 
              key={t.type.name}
              className="px-2 py-1 rounded text-xs text-white font-semibold"
              style={{ backgroundColor: typeColors[t.type.name] || '#777' }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
        
        <div className="mt-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span>🪙 Varo:</span>
            <span className="font-bold">{customStats.varo}</span>
          </div>
          <div className="flex justify-between">
            <span>🧠 Inteligencia:</span>
            <span className="font-bold">{customStats.inteligencia}</span>
          </div>
          <div className="flex justify-between">
            <span>🏘️ Barrio:</span>
            <span className="font-bold">{customStats.barrio}</span>
          </div>
          <div className="flex justify-between border-t pt-1 mt-2">
            <span className="font-bold">💪 Poder:</span>
            <span className="font-bold text-blue-600">{customStats.totalPower}</span>
          </div>
        </div>
      </div>
    </button>
  );
}