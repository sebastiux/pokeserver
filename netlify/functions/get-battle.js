const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const battleId = event.queryStringParameters?.battleId;
    
    if (!battleId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'battleId requerido' }),
      };
    }

    const battleData = await redis.get(`battle:${battleId}`);

    if (!battleData) {
      console.log(`❌ Batalla no encontrada: ${battleId}`);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Batalla no encontrada' }),
      };
    }

    const battle = typeof battleData === 'string' ? JSON.parse(battleData) : battleData;

    console.log(`📊 Get battle ${battleId}: status=${battle.status}`);
    if (battle.result) {
      console.log(`🏆 Winner: ${battle.result.winner}`);
      console.log(`👤 Player1 pokemons: ${battle.result.player1.pokemons?.length || 0}`);
      console.log(`👤 Player2 pokemons: ${battle.result.player2.pokemons?.length || 0}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(battle),
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