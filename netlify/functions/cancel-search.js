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
    
    global.waitingQueue = global.waitingQueue || [];
    global.battles = global.battles || {};
    
    // Remover de la cola
    const index = global.waitingQueue.indexOf(battleId);
    if (index > -1) {
      global.waitingQueue.splice(index, 1);
    }
    
    // Eliminar batalla
    delete global.battles[battleId];
    
    console.log('❌ Búsqueda cancelada:', battleId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};