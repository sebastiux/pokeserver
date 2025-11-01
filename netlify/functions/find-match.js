const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body);
    
    // LOG para debug
    console.log('📥 Datos recibidos:', JSON.stringify(body, null, 2));
    
    // Limpiar batallas viejas (más de 5 minutos)
    const now = Date.now();
    const queueKeys = await redis.lrange('waiting_queue', 0, -1);
    
    for (const battleId of queueKeys) {
      const battleData = await redis.get(`battle:${battleId}`);
      if (battleData) {
        const battle = typeof battleData === 'string' ? JSON.parse(battleData) : battleData;
        const age = now - new Date(battle.createdAt).getTime();
        if (age > 300000) {
          await redis.lrem('waiting_queue', 0, battleId);
          await redis.del(`battle:${battleId}`);
        }
      }
    }

    // Buscar batalla disponible en la cola
    const waitingBattleId = await redis.lpop('waiting_queue');
    
    if (waitingBattleId) {
      const battleData = await redis.get(`battle:${waitingBattleId}`);
      const battle = typeof battleData === 'string' ? JSON.parse(battleData) : battleData;
      
      if (battle && battle.status === 'waiting') {
        battle.player2 = body;
        const p1Power = battle.player1.totalPower;
        const p2Power = body.totalPower;
        
        let winnerName, winnerPower, loserPower, p1Wins, p2Wins;
        
        if (p1Power > p2Power) {
          winnerName = battle.player1.teamName;
          winnerPower = p1Power;
          loserPower = p2Power;
          p1Wins = true;
          p2Wins = false;
        } else {
          winnerName = body.teamName;
          winnerPower = p2Power;
          loserPower = p1Power;
          p1Wins = false;
          p2Wins = true;
        }

        // IMPORTANTE: Incluir los pokemons en el resultado
        battle.result = {
          winner: winnerName,
          winnerPower: winnerPower,
          loserPower: loserPower,
          scoreDifference: Math.abs(p1Power - p2Power),
          player1: {
            teamName: battle.player1.teamName,
            totalPower: p1Power,
            isWinner: p1Wins,
            pokemons: battle.player1.pokemons || [] // ← ESTO ES CRÍTICO
          },
          player2: {
            teamName: body.teamName,
            totalPower: p2Power,
            isWinner: p2Wins,
            pokemons: body.pokemons || [] // ← ESTO ES CRÍTICO
          },
        };

        battle.status = 'finished';
        battle.matchedAt = new Date().toISOString();
        
        // LOG para debug
        console.log('⚔️ MATCH! Battle:', waitingBattleId);
        console.log('👤 Player 1 pokemons:', battle.player1.pokemons?.length || 0);
        console.log('👤 Player 2 pokemons:', body.pokemons?.length || 0);
        console.log('🏆 Resultado player1 pokemons:', battle.result.player1.pokemons?.length || 0);
        console.log('🏆 Resultado player2 pokemons:', battle.result.player2.pokemons?.length || 0);
        
        await redis.set(`battle:${waitingBattleId}`, JSON.stringify(battle), { ex: 600 });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            battleId: waitingBattleId,
            matched: true,
            result: battle.result,
          }),
        };
      }
    }

    // No hay batalla disponible, crear nueva
    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newBattle = {
      battleId,
      player1: body, // Guarda TODO el body, incluyendo pokemons
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    
    // LOG para debug
    console.log('🆕 Nueva batalla creada:', battleId);
    console.log('👤 Player 1 pokemons guardados:', body.pokemons?.length || 0);
    
    await redis.set(`battle:${battleId}`, JSON.stringify(newBattle), { ex: 600 });
    await redis.rpush('waiting_queue', battleId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        battleId,
        matched: false,
        status: 'waiting',
      }),
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    };
  }
};