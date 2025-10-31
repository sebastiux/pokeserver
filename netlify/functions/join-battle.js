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
    const { battleId, teamName, pokemons, totalPower } = JSON.parse(event.body);
    
    global.battles = global.battles || {};
    const battle = global.battles[battleId];
    
    if (!battle) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Batalla no encontrada' }),
      };
    }

    if (battle.status !== 'waiting') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Batalla ya completada' }),
      };
    }

    battle.player2 = { teamName, pokemons, totalPower };
    const diff = battle.player1.totalPower - totalPower;
    const winner = diff > 0 ? battle.player1 : battle.player2;

    battle.result = {
      winner: winner.teamName,
      winnerPower: winner.totalPower,
      loserPower: diff > 0 ? totalPower : battle.player1.totalPower,
      scoreDifference: Math.abs(diff),
      player1: {
        teamName: battle.player1.teamName,
        totalPower: battle.player1.totalPower,
        isWinner: diff > 0,
      },
      player2: {
        teamName,
        totalPower,
        isWinner: diff <= 0,
      },
    };

    battle.status = 'finished';
    console.log('Batalla completada:', battleId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(battle.result),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};