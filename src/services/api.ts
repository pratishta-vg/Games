interface ApiConfig {
  baseURL: string;
  token?: string;
}

class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.config.token) {
      headers.Authorization = `Bearer ${this.config.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setToken(token: string) {
    this.config.token = token;
  }

  removeToken() {
    this.config.token = undefined;
  }
}

// Get Django backend URL from localStorage or default to localhost
const getApiBaseUrl = () => {
  return localStorage.getItem('django_api_url') || 'http://localhost:8000/api/v1';
};

export const apiClient = new ApiClient({
  baseURL: getApiBaseUrl(),
  token: localStorage.getItem('access_token') || undefined,
});

// Auth token management
export const setAuthToken = (token: string) => {
  localStorage.setItem('access_token', token);
  apiClient.setToken(token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('access_token');
  apiClient.removeToken();
};

export const getStoredToken = () => localStorage.getItem('access_token');