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
    
    global.battles = global.battles || {};
    global.waitingQueue = global.waitingQueue || [];

    // Limpiar batallas viejas (más de 5 minutos)
    const now = Date.now();
    global.waitingQueue = global.waitingQueue.filter(id => {
      const battle = global.battles[id];
      if (!battle) return false;
      const age = now - new Date(battle.createdAt).getTime();
      if (age > 300000) { // 5 minutos
        delete global.battles[id];
        return false;
      }
      return battle.status === 'waiting';
    });

    // Buscar batalla disponible
    if (global.waitingQueue.length > 0) {
      const battleId = global.waitingQueue.shift();
      const battle = global.battles[battleId];
      
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

        battle.result = {
          winner: winnerName,
          winnerPower: winnerPower,
          loserPower: loserPower,
          scoreDifference: Math.abs(p1Power - p2Power),
          player1: {
            teamName: battle.player1.teamName,
            totalPower: p1Power,
            isWinner: p1Wins,
          },
          player2: {
            teamName: body.teamName,
            totalPower: p2Power,
            isWinner: p2Wins,
          },
        };

        battle.status = 'finished';
        battle.matchedAt = new Date().toISOString();
        
        console.log('⚔️ MATCH! Ganador:', winnerName, `(${winnerPower} vs ${loserPower})`);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            matched: true, 
            battleId, 
            result: battle.result 
          }),
        };
      }
    }

    // Crear nueva batalla
    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    global.battles[battleId] = {
      battleId,
      player1: body,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    
    global.waitingQueue.push(battleId);
    console.log('⏳ Nueva batalla creada:', battleId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        matched: false, 
        battleId,
        status: 'waiting' 
      }),
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};