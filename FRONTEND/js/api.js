const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:5000';
const TOKEN_KEY = 'authToken';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/index.html?page=login';
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

async function get(endpoint) {
  return apiCall(endpoint, { method: 'GET' });
}

async function post(endpoint, body) {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

async function put(endpoint, body) {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

async function del(endpoint) {
  return apiCall(endpoint, { method: 'DELETE' });
}

export { apiCall, get, post, put, del };
