import { apiClient } from './api';
import { UserProgress, LeaderboardEntry } from '../types/api';

export class UserService {
  static async getUserProgress(): Promise<UserProgress> {
    return apiClient.get<UserProgress>('/users/me/progress/');
  }

  static async getLeaderboard(filters?: {
    grade_id?: number;
    subject_id?: number;
    period?: 'week' | 'month' | 'all';
  }): Promise<LeaderboardEntry[]> {
    const params = new URLSearchParams();
    if (filters?.grade_id) params.append('grade_id', filters.grade_id.toString());
    if (filters?.subject_id) params.append('subject_id', filters.subject_id.toString());
    if (filters?.period) params.append('period', filters.period);
    
    const queryString = params.toString();
    const endpoint = `/leaderboard/${queryString ? `?${queryString}` : ''}`;
    return apiClient.get<LeaderboardEntry[]>(endpoint);
  }

  static async updateProfile(data: {
    full_name?: string;
    avatar?: File;
  }): Promise<void> {
    const formData = new FormData();
    if (data.full_name) formData.append('full_name', data.full_name);
    if (data.avatar) formData.append('avatar', data.avatar);

    return apiClient.put('/users/me/', formData);
  }
}