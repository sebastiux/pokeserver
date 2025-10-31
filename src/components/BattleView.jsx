import { useState } from 'react';
import { createBattle, joinBattle, getBattle } from '../services/battleService';

export default function BattleView({ battleData }) {
  const [battleId, setBattleId] = useState('');
  const [joinBattleId, setJoinBattleId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const handleCreateBattle = async () => {
    setLoading(true);
    try {
      const response = await createBattle(battleData);
      setBattleId(response.battleId);
      // Iniciar polling
      startPolling(response.battleId);
    } catch (error) {
      alert('Error creando batalla: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinBattle = async () => {
    if (!joinBattleId.trim()) {
      alert('Ingresa un Battle ID');
      return;
    }
    
    setLoading(true);
    try {
      const response = await joinBattle(joinBattleId, battleData);
      setResult(response);
    } catch (error) {
      alert('Error uniéndose a batalla: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = async (id) => {
    setPolling(true);
    const maxAttempts = 30;
    let attempts = 0;

    const poll = setInterval(async () => {
      attempts++;
      try {
        const battle = await getBattle(id);
        if (battle.status === 'finished') {
          setResult(battle.result);
          setPolling(false);
          clearInterval(poll);
        }
        if (attempts >= maxAttempts) {
          setPolling(false);
          clearInterval(poll);
          alert('Tiempo de espera agotado');
        }
      } catch (error) {
        console.error('Error polling:', error);
      }
    }, 2000);
  };

  const copyBattleId = () => {
    navigator.clipboard.writeText(battleId);
    alert('Battle ID copiado!');
  };

  if (result) {
    return (
      <div className="mt-8 p-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          🏆 Resultado de la Batalla
        </h2>
        
        <div className="bg-white rounded-lg p-6 mb-4">
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-yellow-600 mb-2">
              {result.winner}
            </p>
            <p className="text-2xl font-semibold text-gray-700">
              ¡GANADOR!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-4 rounded-lg ${result.player1.isWinner ? 'bg-green-100 ring-4 ring-green-500' : 'bg-red-100'}`}>
              <p className="font-bold text-lg">{result.player1.teamName}</p>
              <p className="text-2xl font-bold">{result.player1.totalPower}</p>
              {result.player1.isWinner && <p className="text-green-600 font-bold">✓ GANADOR</p>}
            </div>
            
            <div className={`p-4 rounded-lg ${result.player2.isWinner ? 'bg-green-100 ring-4 ring-green-500' : 'bg-red-100'}`}>
              <p className="font-bold text-lg">{result.player2.teamName}</p>
              <p className="text-2xl font-bold">{result.player2.totalPower}</p>
              {result.player2.isWinner && <p className="text-green-600 font-bold">✓ GANADOR</p>}
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xl">
              Diferencia de puntaje: <span className="font-bold text-blue-600">{result.scoreDifference}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setResult(null);
            setBattleId('');
            setJoinBattleId('');
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg"
        >
          🔄 Nueva Batalla
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Crear Batalla */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
        <h3 className="text-2xl font-bold mb-4">⚔️ Crear Nueva Batalla</h3>
        <p className="text-gray-600 mb-4">
          Crea una batalla y comparte el código con tu oponente
        </p>
        
        {!battleId ? (
          <button
            onClick={handleCreateBattle}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg text-lg"
          >
            {loading ? '⏳ Creando...' : '🎮 Crear Batalla'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Battle ID:</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-gray-900 text-green-400 p-3 rounded font-mono text-sm break-all">
                  {battleId}
                </code>
                <button
                  onClick={copyBattleId}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
                >
                  📋
                </button>
              </div>
            </div>
            
            {polling && (
              <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg text-center">
                <p className="font-bold">⏳ Esperando oponente...</p>
                <p className="text-sm text-gray-600">Comparte el Battle ID con tu rival</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Unirse a Batalla */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
        <h3 className="text-2xl font-bold mb-4">🎯 Unirse a Batalla</h3>
        <p className="text-gray-600 mb-4">
          ¿Te retaron? Ingresa el código de batalla
        </p>
        
        <div className="space-y-3">
          <input
            type="text"
            value={joinBattleId}
            onChange={(e) => setJoinBattleId(e.target.value)}
            placeholder="Pega aquí el Battle ID"
            className="w-full p-4 border-2 border-gray-300 rounded-lg font-mono text-sm"
          />
          
          <button
            onClick={handleJoinBattle}
            disabled={loading || !joinBattleId.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg text-lg"
          >
            {loading ? '⏳ Uniéndose...' : '⚔️ Unirse y Pelear'}
          </button>
        </div>
      </div>
    </div>
  );
}