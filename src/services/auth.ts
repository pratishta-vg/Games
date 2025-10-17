import { apiClient, setAuthToken, removeAuthToken } from './api';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/api';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login/', credentials);
    setAuthToken(response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }

  static async register(userData: RegisterRequest): Promise<User> {
    return apiClient.post<User>('/auth/register/', userData);
  }

  static async logout(): Promise<void> {
    removeAuthToken();
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  static async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ access: string }>('/auth/token/refresh/', {
      refresh: refreshToken,
    });

    setAuthToken(response.access);
    return response.access;
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}