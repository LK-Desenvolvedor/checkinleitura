const TOKEN_KEY = 'authToken';
const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function createGroup(name, description) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar grupo');
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
    throw error;
  }
}

async function getMyGroups() {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar grupos');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    throw error;
  }
}

async function getGroupById(groupId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar grupo');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar grupo:', error);
    throw error;
  }
}

async function updateGroup(groupId, name, description) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar grupo');
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error);
    throw error;
  }
}

async function inviteUserToGroup(groupId, userId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/groups/invite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId, userId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao convidar usuário');
    }

    return data;
  } catch (error) {
    console.error('Erro ao convidar usuário:', error);
    throw error;
  }
}

async function respondToInvitation(invitationId, response) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const res = await fetch(`${API_BASE_URL}/groups/invitation/respond`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ invitationId, response })
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

async function removeMemberFromGroup(groupId, memberId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/groups/member/remove`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId, memberId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao remover membro');
    }

    return data;
  } catch (error) {
    console.error('Erro ao remover membro:', error);
    throw error;
  }
}

async function banMemberFromGroup(groupId, memberId, banDays = 7) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/groups/member/ban`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId, memberId, banDays })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao banir membro');
    }

    return data;
  } catch (error) {
    console.error('Erro ao banir membro:', error);
    throw error;
  }
}

async function promoteToAdmin(groupId, memberId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/groups/member/promote-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId, memberId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao promover membro');
    }

    return data;
  } catch (error) {
    console.error('Erro ao promover membro:', error);
    throw error;
  }
}

async function promoteToCreator(groupId, memberId) {
  try {
    const token = getToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${API_BASE_URL}/groups/member/promote-creator`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId, memberId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao promover membro a criador');
    }

    return data;
  } catch (error) {
    console.error('Erro ao promover membro a criador:', error);
    throw error;
  }
}
