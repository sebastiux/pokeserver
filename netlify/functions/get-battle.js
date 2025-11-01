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

    // Acceder al mismo global que find-match usa
    global.battles = global.battles || {};
    const battle = global.battles[battleId];

    if (!battle) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Batalla no encontrada' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(battle),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};