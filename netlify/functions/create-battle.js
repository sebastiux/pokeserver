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
    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Guardamos en memoria temporal (se reinicia al reiniciar el servidor)
    global.battles = global.battles || {};
    global.battles[battleId] = {
      battleId,
      player1: body,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };

    console.log('Batalla creada:', battleId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ battleId, status: 'waiting' }),
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