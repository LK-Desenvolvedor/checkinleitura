const TOKEN_KEY = 'authToken';
const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function createProject(groupId, name, author, coverImage, description, deadline) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId, name, author, coverImage, description, deadline })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar projeto');
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    throw error;
  }
}

async function getProjectsByGroup(groupId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/projects/group/${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar projetos');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    throw error;
  }
}

async function getProjectById(projectId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar projeto');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    throw error;
  }
}

async function updateProject(projectId, name, author, coverImage, description, deadline) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, author, coverImage, description, deadline })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar projeto');
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw error;
  }
}

async function pauseProject(projectId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pause`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao pausar projeto');
    }

    return data;
  } catch (error) {
    console.error('Erro ao pausar projeto:', error);
    throw error;
  }
}

async function reopenProject(projectId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/reopen`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao reabrir projeto');
    }

    return data;
  } catch (error) {
    console.error('Erro ao reabrir projeto:', error);
    throw error;
  }
}

async function deleteProject(projectId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao deletar projeto');
    }

    return data;
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    throw error;
  }
}

async function respondToProjectInvitation(projectId, response) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const res = await fetch(`${API_BASE_URL}/projects/invitation/respond`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectId, response })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao responder convite');
    }

    return data;
  } catch (error) {
    console.error('Erro ao responder convite:', error);
    throw error;
  }
}

async function removeParticipantFromProject(projectId, participantId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/projects/participant/remove`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectId, participantId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao remover participante');
    }

    return data;
  } catch (error) {
    console.error('Erro ao remover participante:', error);
    throw error;
  }
}

async function banParticipantFromProject(projectId, participantId, banDays = 7) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/projects/participant/ban`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectId, participantId, banDays })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao banir participante');
    }

    return data;
  } catch (error) {
    console.error('Erro ao banir participante:', error);
    throw error;
  }
}
