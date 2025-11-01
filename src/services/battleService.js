const API_URL = import.meta.env.DEV 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

export const findMatch = async (battleData) => {
  const response = await fetch(`${API_URL}/find-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(battleData),
  });
  return response.json();
};

export const cancelSearch = async (battleId) => {
  const response = await fetch(`${API_URL}/cancel-search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ battleId }),
  });
  return response.json();
};

export const getBattle = async (battleId) => {
  const response = await fetch(`${API_URL}/get-battle?battleId=${battleId}`);
  return response.json();
};