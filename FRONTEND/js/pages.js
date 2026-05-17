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

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  const expiresAt = new Date().getTime() + 5184000000;
  localStorage.setItem('tokenExpiresAt', expiresAt);
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('tokenExpiresAt');
}

function showPage(pageName) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  const page = document.getElementById(`page-${pageName}`);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);

    if (pageName === 'groups') loadGroups();
    if (pageName === 'profile') loadProfile();
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

function updateUserMenu() {
  const user = getCurrentUser();
  const userNameEl = document.querySelector('.user-name');
  const userAvatarEl = document.querySelector('.user-avatar');

  if (user && userNameEl && userAvatarEl) {
    userNameEl.textContent = user.name || 'Usuário';
    userAvatarEl.textContent = getInitials(user.name);
  }
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

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.message || 'Erro ao fazer login', 'error');
      return;
    }

    setToken(data.token);
    setCurrentUser(data.user);
    updateUserMenu();
    showAlert('Login realizado com sucesso!', 'success');
    showPage('home');
  } catch (error) {
    showAlert('Erro ao fazer login', 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.message || 'Erro ao registrar', 'error');
      return;
    }

    setToken(data.token);
    setCurrentUser(data.user);
    updateUserMenu();
    showAlert('Conta criada com sucesso!', 'success');
    showPage('home');
  } catch (error) {
    showAlert('Erro ao registrar', 'error');
  }
}

async function handleLogout() {
  clearAuth();
  showAlert('Você foi desconectado', 'info');
  showPage('login');
}

async function handleCreateGroup(event) {
  event.preventDefault();
  const name = document.getElementById('group-name').value;
  const description = document.getElementById('group-description').value;

  try {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.message || 'Erro ao criar grupo', 'error');
      return;
    }

    closeModal('create-group-modal');
    document.getElementById('group-name').value = '';
    document.getElementById('group-description').value = '';
    showAlert('Grupo criado com sucesso!', 'success');
    loadGroups();
  } catch (error) {
    showAlert('Erro ao criar grupo', 'error');
  }
}

async function loadGroups() {
  const container = document.getElementById('groups-container');
  container.innerHTML = '<div class="loading"><div class="spinner"></div><span>Carregando grupos...</span></div>';

  try {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    const groups = await response.json();

    if (!response.ok) {
      container.innerHTML = '<div class="empty-state"><h3>Erro ao carregar grupos</h3></div>';
      return;
    }

    if (groups.length === 0) {
      container.innerHTML = '<div class="empty-state"><h3>Você não está em nenhum grupo ainda</h3><p>Crie um novo grupo para começar!</p></div>';
      return;
    }

    container.innerHTML = groups.map(group => `
      <div class="card group-card">
        <h3>${group.name}</h3>
        <p>${group.description || 'Sem descrição'}</p>
        <div class="members">
          ${group.members.map(m => `<span class="member-badge">${m.role}</span>`).join('')}
        </div>
        <button class="btn-primary" onclick="loadGroupDetail('${group._id}')" style="margin-top: 15px;">Ver Detalhes</button>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><h3>Erro ao carregar grupos</h3></div>';
  }
}

async function loadGroupDetail(groupId) {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    const group = await response.json();

    if (!response.ok) {
      showAlert('Erro ao carregar grupo', 'error');
      return;
    }

    const container = document.getElementById('group-detail-container');
    container.innerHTML = `
      <h1>${group.name}</h1>
      <p>${group.description || 'Sem descrição'}</p>
      <div class="divider"></div>
      <h2>Membros</h2>
      <div class="grid grid-2" id="members-container"></div>
      <div class="divider"></div>
      <h2>Projetos</h2>
      <button class="btn-primary" onclick="showModal('create-project-modal'); window.currentGroupId = '${groupId}'">+ Novo Projeto</button>
      <div class="grid grid-2" id="projects-container" style="margin-top: 20px;"></div>
    `;

    loadGroupMembers(groupId);
    loadGroupProjects(groupId);
    showPage('group-detail');
  } catch (error) {
    showAlert('Erro ao carregar grupo', 'error');
  }
}

async function loadGroupMembers(groupId) {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    const group = await response.json();
    const container = document.getElementById('members-container');

    container.innerHTML = group.members.map(m => `
      <div class="card">
        <div class="flex-center" style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #EC4899 0%, #BE185D 100%); color: white; font-weight: bold; margin: 0 auto 10px;">
          ${getInitials(m.userId.name)}
        </div>
        <h4 style="text-align: center; margin: 10px 0;">${m.userId.name}</h4>
        <p style="text-align: center; font-size: 12px; color: #64748B;">${m.role}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar membros:', error);
  }
}

async function loadGroupProjects(groupId) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/group/${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    const projects = await response.json();
    const container = document.getElementById('projects-container');

    if (projects.length === 0) {
      container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><h3>Nenhum projeto criado</h3></div>';
      return;
    }

    container.innerHTML = projects.map(p => `
      <div class="card project-card">
        <div class="project-cover">
          ${p.coverImage ? `<img src="${p.coverImage}" alt="${p.name}">` : '📖'}
        </div>
        <div class="project-info">
          <h3>${p.name}</h3>
          <p><strong>Autor:</strong> ${p.author}</p>
          <p><strong>Status:</strong> <span class="badge badge-primary">${p.status}</span></p>
          ${p.deadline ? `<p><strong>Prazo:</strong> ${formatDateOnly(p.deadline)}</p>` : ''}
          <button class="btn-primary" onclick="loadProjectDetail('${p._id}')" style="margin-top: 10px;">Ver Projeto</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
  }
}

async function loadProjectDetail(projectId) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    const project = await response.json();

    if (!response.ok) {
      showAlert('Erro ao carregar projeto', 'error');
      return;
    }

    const container = document.getElementById('group-detail-container');
    container.innerHTML = `
      <button class="btn-outline" onclick="window.location.reload()">← Voltar</button>
      <h1>${project.name}</h1>
      <p><strong>Autor:</strong> ${project.author}</p>
      <p><strong>Status:</strong> <span class="badge badge-primary">${project.status}</span></p>
      ${project.deadline ? `<p><strong>Prazo:</strong> ${formatDateOnly(project.deadline)}</p>` : ''}
      <div class="divider"></div>
      <h2>Check-ins</h2>
      <button class="btn-primary" onclick="showModal('create-checkin-modal'); window.currentProjectId = '${projectId}'">+ Novo Check-in</button>
      <div id="checkins-container" style="margin-top: 20px;"></div>
    `;

    loadCheckIns(projectId);
    showPage('group-detail');
  } catch (error) {
    showAlert('Erro ao carregar projeto', 'error');
  }
}

async function loadCheckIns(projectId) {
  try {
    const response = await fetch(`${API_BASE_URL}/checkins/project/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    const checkIns = await response.json();
    const container = document.getElementById('checkins-container');

    if (checkIns.length === 0) {
      container.innerHTML = '<div class="empty-state"><h3>Nenhum check-in registrado</h3></div>';
      return;
    }

    container.innerHTML = checkIns.map(c => `
      <div class="card checkin-item">
        ${c.photo ? `<div class="checkin-photo"><img src="${c.photo}" alt="Check-in"></div>` : '<div class="checkin-photo">📸</div>'}
        <div class="checkin-content">
          <h4>${c.userId.name}</h4>
          <p>${c.comment || 'Sem comentário'}</p>
          <div class="checkin-meta">
            ${c.chapter ? `<span>Capítulo: ${c.chapter}</span>` : ''}
            ${c.page ? `<span>Página: ${c.page}</span>` : ''}
            <span>${formatDate(c.createdAt)}</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar check-ins:', error);
  }
}

async function handleCreateProject(event) {
  event.preventDefault();
  const groupId = window.currentGroupId;
  const name = document.getElementById('project-name').value;
  const author = document.getElementById('project-author').value;
  const coverImage = document.getElementById('project-cover').value;
  const description = document.getElementById('project-description').value;
  const deadline = document.getElementById('project-deadline').value;

  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId, name, author, coverImage, description, deadline })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.message || 'Erro ao criar projeto', 'error');
      return;
    }

    closeModal('create-project-modal');
    document.getElementById('project-name').value = '';
    document.getElementById('project-author').value = '';
    document.getElementById('project-cover').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-deadline').value = '';
    showAlert('Projeto criado com sucesso!', 'success');
    loadGroupProjects(groupId);
  } catch (error) {
    showAlert('Erro ao criar projeto', 'error');
  }
}

async function handleCreateCheckIn(event) {
  event.preventDefault();
  const projectId = window.currentProjectId;
  const photo = document.getElementById('checkin-photo').value;
  const comment = document.getElementById('checkin-comment').value;
  const chapter = document.getElementById('checkin-chapter').value;
  const page = document.getElementById('checkin-page').value;

  try {
    const response = await fetch(`${API_BASE_URL}/checkins`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectId, photo, comment, chapter: chapter ? parseInt(chapter) : null, page: page ? parseInt(page) : null })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.message || 'Erro ao criar check-in', 'error');
      return;
    }

    closeModal('create-checkin-modal');
    document.getElementById('checkin-photo').value = '';
    document.getElementById('checkin-comment').value = '';
    document.getElementById('checkin-chapter').value = '';
    document.getElementById('checkin-page').value = '';
    showAlert('Check-in registrado com sucesso!', 'success');
    loadCheckIns(projectId);
  } catch (error) {
    showAlert('Erro ao criar check-in', 'error');
  }
}

async function loadProfile() {
  const user = getCurrentUser();
  const container = document.getElementById('profile-container');

  if (!user) {
    container.innerHTML = '<div class="empty-state"><h3>Erro ao carregar perfil</h3></div>';
    return;
  }

  container.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${getInitials(user.name)}</div>
      <div class="profile-info">
        <h1>${user.name}</h1>
        <p>${user.email}</p>
        <p>${user.bio || 'Sem bio'}</p>
      </div>
    </div>
    <div class="card" style="max-width: 600px;">
      <h2 style="color: var(--primary); margin-bottom: 20px;">Editar Perfil</h2>
      <form onsubmit="handleUpdateProfile(event)">
        <div class="form-group">
          <label>Nome</label>
          <input type="text" id="profile-name" value="${user.name}" required>
        </div>
        <div class="form-group">
          <label>Bio</label>
          <textarea id="profile-bio" rows="4">${user.bio || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Avatar (URL)</label>
          <input type="url" id="profile-avatar" value="${user.avatar || ''}">
        </div>
        <button type="submit" class="btn-primary">Salvar Alterações</button>
      </form>
      <div class="divider"></div>
      <h2 style="color: var(--primary); margin-bottom: 20px;">Segurança</h2>
      <button class="btn-secondary" onclick="showModal('change-password-modal')" style="margin-right: 10px;">Alterar Senha</button>
      <button class="btn-danger" onclick="handleDeleteAccount()">Deletar Conta</button>
    </div>
    <div id="change-password-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Alterar Senha</h2>
          <button class="modal-close" onclick="closeModal('change-password-modal')">×</button>
        </div>
        <form onsubmit="handleChangePassword(event)">
          <div class="form-group">
            <label>Senha Atual</label>
            <input type="password" id="current-password" required>
          </div>
          <div class="form-group">
            <label>Nova Senha</label>
            <input type="password" id="new-password" required>
          </div>
          <button type="submit" class="btn-primary w-full">Alterar Senha</button>
        </form>
      </div>
    </div>
  `;

  setupModalCloseListeners();
}

async function handleUpdateProfile(event) {
  event.preventDefault();
  const name = document.getElementById('profile-name').value;
  const bio = document.getElementById('profile-bio').value;
  const avatar = document.getElementById('profile-avatar').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, bio, avatar })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.message || 'Erro ao atualizar perfil', 'error');
      return;
    }

    setCurrentUser(data.user);
    updateUserMenu();
    showAlert('Perfil atualizado com sucesso!', 'success');
    loadProfile();
  } catch (error) {
    showAlert('Erro ao atualizar perfil', 'error');
  }
}

async function handleChangePassword(event) {
  event.preventDefault();
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.message || 'Erro ao alterar senha', 'error');
      return;
    }

    closeModal('change-password-modal');
    showAlert('Senha alterada com sucesso!', 'success');
  } catch (error) {
    showAlert('Erro ao alterar senha', 'error');
  }
}

async function handleDeleteAccount() {
  if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
    return;
  }

  const password = prompt('Digite sua senha para confirmar:');
  if (!password) return;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.message || 'Erro ao deletar conta', 'error');
      return;
    }

    clearAuth();
    showAlert('Conta deletada com sucesso!', 'success');
    showPage('login');
  } catch (error) {
    showAlert('Erro ao deletar conta', 'error');
  }
}

function updateApiUrl() {
  const url = document.getElementById('api-url-input').value;
  localStorage.setItem('apiBaseUrl', url);
  showAlert('URL da API atualizada com sucesso!', 'success');
}

function checkAuthAndRedirect() {
  const params = new URLSearchParams(window.location.search);
  const requestedPage = params.get('page') || 'home';
  const token = getToken();

  if (!token && requestedPage !== 'login' && requestedPage !== 'register') {
    showPage('login');
    return;
  }

  if (token && (requestedPage === 'login' || requestedPage === 'register')) {
    showPage('home');
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
