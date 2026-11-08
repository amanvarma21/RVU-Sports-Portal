/**
 * RVU Sports Portal - API Client Service
 * Connects React frontend to Express backend REST APIs
 */

const API_BASE_URL = 'https://rvu-sports-portal-backend.onrender.com/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('rvu_sports_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const api = {
  // --- Authentication ---
  async login({ email, password, role }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }
    return data
  },

  async register({ email, password, name, role, department }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role, department }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed')
    }
    return data
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch session')
    }
    return data
  },

  // --- Sports ---
  async getSports() {
    const res = await fetch(`${API_BASE_URL}/sports`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to load sports')
    return data.data
  },

  async getSportById(id) {
    const res = await fetch(`${API_BASE_URL}/sports/${id}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to load sport')
    return data.data
  },

  async createSport(data) {
    const res = await fetch(`${API_BASE_URL}/sports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Failed to create sport')
    return result
  },

  async updateSport(id, data) {
    const res = await fetch(`${API_BASE_URL}/sports/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Failed to update sport')
    return result
  },

  async deleteSport(id) {
    const res = await fetch(`${API_BASE_URL}/sports/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Failed to delete sport')
    return result
  },

  async getRecentMatches() {
    const res = await fetch(`${API_BASE_URL}/sports/matches/recent`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to load match scores')
    return data.data
  },

  // --- Tournaments ---
  async getTournaments() {
    const res = await fetch(`${API_BASE_URL}/tournaments`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to load tournaments')
    return data.data
  },

  async createTournament(data) {
    const res = await fetch(`${API_BASE_URL}/tournaments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Failed to create tournament')
    return result
  },

  async updateTournament(id, data) {
    const res = await fetch(`${API_BASE_URL}/tournaments/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Failed to update tournament')
    return result
  },

  async deleteTournament(id) {
    const res = await fetch(`${API_BASE_URL}/tournaments/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Failed to delete tournament')
    return result
  },

  async registerForTournament(tournamentId) {
    const res = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Registration failed')
    return data
  },
}
