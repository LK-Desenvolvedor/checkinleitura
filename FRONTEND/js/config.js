const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:5000';
const TOKEN_KEY = 'authToken';
const USER_KEY = 'currentUser';
const TOKEN_EXPIRATION = 5184000000;

const config = {
  apiBaseUrl: API_BASE_URL,
  tokenKey: TOKEN_KEY,
  userKey: USER_KEY,
  tokenExpiration: TOKEN_EXPIRATION
};

function setApiBaseUrl(url) {
  localStorage.setItem('apiBaseUrl', url);
  config.apiBaseUrl = url;
}

function getApiBaseUrl() {
  return config.apiBaseUrl;
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  const expiresAt = new Date().getTime() + TOKEN_EXPIRATION;
  localStorage.setItem('tokenExpiresAt', expiresAt);
}

function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAt = localStorage.getItem('tokenExpiresAt');

  if (!token || !expiresAt) return null;

  if (new Date().getTime() > expiresAt) {
    clearAuth();
    return null;
  }

  return token;
}

function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('tokenExpiresAt');
}

function isAuthenticated() {
  return getToken() !== null;
}

export {
  config,
  setApiBaseUrl,
  getApiBaseUrl,
  setToken,
  getToken,
  setCurrentUser,
  getCurrentUser,
  clearAuth,
  isAuthenticated
};
