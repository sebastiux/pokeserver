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
    const { battleId } = JSON.parse(event.body);
    
    if (!battleId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'battleId requerido' }),
      };
    }

    // Remover de la cola
    await redis.lrem('waiting_queue', 0, battleId);
    
    // Eliminar batalla
    await redis.del(`battle:${battleId}`);
    
    console.log(`🚫 Búsqueda cancelada: ${battleId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
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