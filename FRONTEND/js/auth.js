const TOKEN_KEY = 'authToken';
const USER_KEY = 'currentUser';
const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:5000';
const TOKEN_EXPIRATION = 5184000000;

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  const expiresAt = new Date().getTime() + TOKEN_EXPIRATION;
  localStorage.setItem('tokenExpiresAt', expiresAt);
}

function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('tokenExpiresAt');
}

function isAuthenticated() {
  const token = getToken();
  const expiresAt = localStorage.getItem('tokenExpiresAt');

  if (!token || !expiresAt) return false;

  if (new Date().getTime() > expiresAt) {
    clearAuth();
    return false;
  }

  return true;
}

async function register(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao registrar');
    }

    setToken(data.token);
    setCurrentUser(data.user);

    return data;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
}

async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    setToken(data.token);
    setCurrentUser(data.user);

    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}

async function logout() {
  clearAuth();
}

async function getProfile() {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      clearAuth();
      throw new Error('Sessão expirada');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar perfil');
    }

    setCurrentUser(data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
}

async function updateProfile(name, bio, avatar) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, bio, avatar })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar perfil');
    }

    setCurrentUser(data.user);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}

async function updatePassword(currentPassword, newPassword) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar senha');
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    throw error;
  }
}

async function deleteAccount(password) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/auth/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao deletar conta');
    }

    clearAuth();
    return data;
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    throw error;
  }
}
