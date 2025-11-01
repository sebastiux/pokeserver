import { useState, useEffect } from 'react';
import { getRandomPokemons, calculatePokemonStats } from '../services/pokeapi';

export const usePokemon = () => {
  const [pokemons, setPokemons] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchRandomPokemons = async () => {
    setLoading(true);
    try {
      const data = await getRandomPokemons(5);
      const withStats = data.map(p => ({
        ...p,
        customStats: calculatePokemonStats(p)
      }));
      setPokemons(withStats);
      setSelectedTeam([]);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleSelection = (pokemon) => {
    if (selectedTeam.find(p => p.id === pokemon.id)) {
      setSelectedTeam(selectedTeam.filter(p => p.id !== pokemon.id));
    } else if (selectedTeam.length < 3) {
      setSelectedTeam([...selectedTeam, pokemon]);
    }
  };
  
  const getTeamPower = () => {
    return selectedTeam.reduce((sum, p) => sum + p.customStats.totalPower, 0);
  };
  
  const getBattleData = () => {
    return {
      teamName: "Mi Equipo",
      pokemons: selectedTeam.map(p => ({
        id: p.id,
        name: p.name,
        sprite: p.sprites?.front_default || p.sprites?.other?.['official-artwork']?.front_default || '', // ← AÑADIR SPRITE
        varo: p.customStats.varo,
        inteligencia: p.customStats.inteligencia,
        barrio: p.customStats.barrio,
        totalPower: p.customStats.totalPower
      })),
      totalPower: getTeamPower()
    };
  };
  
  useEffect(() => {
    fetchRandomPokemons();
  }, []);
  
  return {
    pokemons,
    selectedTeam,
    loading,
    fetchRandomPokemons,
    toggleSelection,
    getTeamPower,
    getBattleData
  };
};