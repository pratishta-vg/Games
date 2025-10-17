const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  // Auth endpoints
  async register(userData: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{ user: any; token: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout/', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile/');
  }

  async updateProfile(profileData: any) {
    return this.request('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // Games endpoints
  async getGames() {
    return this.request('/games/');
  }

  async getGame(id: number) {
    return this.request(`/games/${id}/`);
  }

  async getGameStats(id: number) {
    return this.request(`/games/${id}/stats/`);
  }

  async getUserStats() {
    return this.request('/games/stats/');
  }

  async getGameSessions() {
    return this.request('/games/sessions/');
  }

  async createGameSession(sessionData: { game: number }) {
    return this.request('/games/sessions/', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateGameSession(id: number, sessionData: any) {
    return this.request(`/games/sessions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(sessionData),
    });
  }

  async getAchievements() {
    return this.request('/games/achievements/');
  }

  async getUserAchievements() {
    return this.request('/games/user-achievements/');
  }

  async getLeaderboard(period: string = 'all_time', gameId?: number) {
    const params = new URLSearchParams({ period });
    if (gameId) params.append('game', gameId.toString());
    return this.request(`/games/leaderboard/?${params}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health/');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
