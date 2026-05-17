const TOKEN_KEY = 'authToken';
const USER_KEY = 'currentUser';
const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
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
  return getToken() !== null;
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
      clearAuth();
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

function showPage(pageName) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  const page = document.getElementById(`page-${pageName}`);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
  }
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => modal.classList.remove('active'));
}

function showAlert(message, type = 'info') {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) return;

  const alertId = `alert-${Date.now()}`;
  const alert = document.createElement('div');
  alert.id = alertId;
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <div>${message}</div>
    <button class="alert-close" onclick="document.getElementById('${alertId}').remove()">×</button>
  `;

  alertsContainer.appendChild(alert);

  setTimeout(() => {
    const element = document.getElementById(alertId);
    if (element) element.remove();
  }, 5000);
}

function showToast(message, type = 'info') {
  const toastId = `toast-${Date.now()}`;
  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div>${message}</div>
    <button class="toast-close" onclick="document.getElementById('${toastId}').remove()">×</button>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    const element = document.getElementById(toastId);
    if (element) element.remove();
  }, 3000);
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatDateOnly(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }
}

function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div><span>Carregando...</span></div>';
  }
}

function showEmptyState(containerId, message = 'Nenhum item encontrado') {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div class="empty-state"><h3>${message}</h3></div>`;
  }
}

function setupTabsListener(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tabs = container.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      const tabContents = container.querySelectorAll('.tab-content');
      const tabButtons = container.querySelectorAll('.tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      tab.classList.add('active');
      const activeContent = container.querySelector(`[data-tab-content="${tabName}"]`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}

function setupDropdownListener() {
  const userMenu = document.querySelector('.user-menu');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (userMenu && dropdownMenu) {
    userMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('active');
    });
  }
}

function setupModalCloseListeners() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

function updateUserMenu() {
  const user = getCurrentUser();
  const userNameEl = document.querySelector('.user-name');
  const userAvatarEl = document.querySelector('.user-avatar');

  if (user && userNameEl && userAvatarEl) {
    userNameEl.textContent = user.name || 'Usuário';
    userAvatarEl.textContent = getInitials(user.name);
  }
}

function checkAuthAndRedirect() {
  const params = new URLSearchParams(window.location.search);
  const requestedPage = params.get('page') || 'home';

  if (!isAuthenticated() && requestedPage !== 'login' && requestedPage !== 'register') {
    window.location.href = '/index.html?page=login';
    return;
  }

  if (isAuthenticated() && (requestedPage === 'login' || requestedPage === 'register')) {
    window.location.href = '/index.html?page=home';
    return;
  }

  showPage(requestedPage);
}

function initializeApp() {
  loadDarkModePreference();
  setupDropdownListener();
  setupModalCloseListeners();
  updateUserMenu();
  checkAuthAndRedirect();
}

document.addEventListener('DOMContentLoaded', initializeApp);
