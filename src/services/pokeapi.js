const BASE_URL = 'https://pokeapi.co/api/v2';

export const getRandomPokemons = async (count = 5) => {
  const randomIds = [];
  while (randomIds.length < count) {
    const randomId = Math.floor(Math.random() * 898) + 1; // Gen 1-8
    if (!randomIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }
  
  const promises = randomIds.map(id => 
    fetch(`${BASE_URL}/pokemon/${id}`).then(res => res.json())
  );
  
  return Promise.all(promises);
};

export const calculatePokemonStats = (pokemon) => {
  // Extraer 3 stats aleatorios
  const allStats = pokemon.stats.map(s => s.base_stat);
  const shuffled = [...allStats].sort(() => Math.random() - 0.5);
  const [stat1, stat2, stat3] = shuffled.slice(0, 3);
  
  // Aplicar multiplicadores como en iOS
  const varo = stat1 * 3;
  const inteligencia = stat2 * 1;
  const barrio = stat3 * 4;
  
  return {
    varo,
    inteligencia,
    barrio,
    totalPower: varo + inteligencia + barrio
  };
};