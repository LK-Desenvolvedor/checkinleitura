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

export {
  showPage,
  showModal,
  closeModal,
  closeAllModals,
  showAlert,
  showToast,
  formatDate,
  formatDateOnly,
  getInitials,
  toggleDarkMode,
  loadDarkModePreference,
  showLoading,
  showEmptyState,
  setupTabsListener,
  setupDropdownListener,
  setupModalCloseListeners
};
