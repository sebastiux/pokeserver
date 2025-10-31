const API_URL = import.meta.env.DEV 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

export const createBattle = async (battleData) => {
  const response = await fetch(`${API_URL}/create-battle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(battleData),
  });
  return response.json();
};

export const joinBattle = async (battleId, battleData) => {
  const response = await fetch(`${API_URL}/join-battle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ battleId, ...battleData }),
  });
  return response.json();
};

export const getBattle = async (battleId) => {
  const response = await fetch(`${API_URL}/get-battle?battleId=${battleId}`);
  return response.json();
};