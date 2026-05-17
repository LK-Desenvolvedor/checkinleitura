const TOKEN_KEY = 'authToken';
const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function createCheckIn(projectId, photo, comment, chapter, page) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/checkins`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectId, photo, comment, chapter, page })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar check-in');
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar check-in:', error);
    throw error;
  }
}

async function getCheckInsByProject(projectId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/checkins/project/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar check-ins');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar check-ins:', error);
    throw error;
  }
}

async function getCheckInsByUser(projectId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/checkins/project/${projectId}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar meus check-ins');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar meus check-ins:', error);
    throw error;
  }
}

async function getCheckInById(checkInId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/checkins/${checkInId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar check-in');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar check-in:', error);
    throw error;
  }
}

async function updateCheckIn(checkInId, photo, comment, chapter, page) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/checkins/${checkInId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ photo, comment, chapter, page })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar check-in');
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar check-in:', error);
    throw error;
  }
}

async function deleteCheckIn(checkInId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/checkins/${checkInId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao deletar check-in');
    }

    return data;
  } catch (error) {
    console.error('Erro ao deletar check-in:', error);
    throw error;
  }
}

async function getProjectProgress(projectId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/checkins/project/${projectId}/progress`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar progresso');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    throw error;
  }
}
