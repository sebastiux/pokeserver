import { useState, useEffect } from 'react';
import { findMatch, cancelSearch, getBattle } from '../services/battleService';

export default function BattleView({ battleData }) {
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [battleId, setBattleId] = useState('');

  useEffect(() => {
    let interval;
    
    if (searching && battleId) {
      // Solo hacer polling con GET (no con find-match)
      interval = setInterval(async () => {
        try {
          const battle = await getBattle(battleId);
          if (battle.status === 'finished' && battle.result) {
            setResult(battle.result);
            setSearching(false);
            clearInterval(interval);
          }
        } catch (error) {
          // Batalla no encontrada o error
          console.log('Esperando...');
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [searching, battleId]);

  const handleFindMatch = async () => {
    setSearching(true);
    try {
      const response = await findMatch(battleData);
      
      if (response.matched && response.result) {
        // ¡Match inmediato!
        setResult(response.result);
        setSearching(false);
      } else {
        // Esperando rival
        setBattleId(response.battleId);
        console.log('Esperando rival con ID:', response.battleId);
      }
    } catch (error) {
      alert('Error: ' + error.message);
      setSearching(false);
    }
  };

  const handleCancelSearch = async () => {
    if (battleId) {
      try {
        await cancelSearch(battleId);
      } catch (error) {
        console.error('Error cancelando:', error);
      }
    }
    setSearching(false);
    setBattleId('');
  };

  if (result) {
    return (
      <div className="mt-8 p-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
          🏆 ¡Batalla Terminada!
        </h2>
        
        <div className="bg-white rounded-xl p-8 mb-6 shadow-lg">
          <div className="text-center mb-8">
            <p className="text-5xl font-black text-yellow-600 mb-3 animate-bounce">
              {result.winner}
            </p>
            <p className="text-3xl font-bold text-gray-700">
              ¡GANADOR! 🎉
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className={`p-6 rounded-xl shadow-md transition-all ${
              result.player1.isWinner 
                ? 'bg-gradient-to-br from-green-100 to-green-200 ring-4 ring-green-500 scale-105' 
                : 'bg-gradient-to-br from-red-100 to-red-200'
            }`}>
              <p className="font-bold text-xl mb-2">{result.player1.teamName}</p>
              <p className="text-4xl font-black mb-3">{result.player1.totalPower}</p>
              {result.player1.isWinner && (
                <p className="text-green-700 font-bold text-2xl">✓ GANÓ</p>
              )}
              {!result.player1.isWinner && (
                <p className="text-red-700 font-bold text-2xl">✗ PERDIÓ</p>
              )}
            </div>
            
            <div className={`p-6 rounded-xl shadow-md transition-all ${
              result.player2.isWinner 
                ? 'bg-gradient-to-br from-green-100 to-green-200 ring-4 ring-green-500 scale-105' 
                : 'bg-gradient-to-br from-red-100 to-red-200'
            }`}>
              <p className="font-bold text-xl mb-2">{result.player2.teamName}</p>
              <p className="text-4xl font-black mb-3">{result.player2.totalPower}</p>
              {result.player2.isWinner && (
                <p className="text-green-700 font-bold text-2xl">✓ GANÓ</p>
              )}
              {!result.player2.isWinner && (
                <p className="text-red-700 font-bold text-2xl">✗ PERDIÓ</p>
              )}
            </div>
          </div>

          <div className="text-center pt-6 border-t-2 border-gray-300">
            <p className="text-2xl font-semibold">
              Diferencia: <span className="font-black text-blue-600">{result.scoreDifference}</span> puntos
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setResult(null);
            setBattleId('');
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl text-xl shadow-lg transform transition hover:scale-105"
        >
          🔄 Nueva Batalla
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 p-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6">⚔️ Matchmaking</h2>
      
      {!searching ? (
        <button
          onClick={handleFindMatch}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-8 rounded-xl text-3xl shadow-lg transform transition hover:scale-105 active:scale-95"
        >
          🎮 Buscar Rival
        </button>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl text-center shadow-lg">
            <div className="mb-6">
              <div className="text-7xl mb-4 animate-pulse">🔍</div>
              <p className="text-2xl font-bold text-purple-600 mb-2">
                Buscando rival...
              </p>
              <p className="text-gray-600 text-lg">
                Abre otra pestaña para emparejar
              </p>
            </div>
            
            <div className="flex justify-center gap-3 mt-6">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
          
          <button
            onClick={handleCancelSearch}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition"
          >
            ❌ Cancelar Búsqueda
          </button>
        </div>
      )}
    </div>
  );
}