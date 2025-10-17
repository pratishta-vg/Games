import { apiClient } from './api';
import { Game, GameResult, GameSubmission, Grade, Subject } from '../types/api';

export class GameService {
  static async getGrades(): Promise<Grade[]> {
    return apiClient.get<Grade[]>('/grades/');
  }

  static async getSubjects(gradeId?: number): Promise<Subject[]> {
    const endpoint = gradeId ? `/subjects/?grade_id=${gradeId}` : '/subjects/';
    return apiClient.get<Subject[]>(endpoint);
  }

  static async getGame(gameId: number): Promise<Game> {
    return apiClient.get<Game>(`/games/${gameId}/`);
  }

  static async getGames(filters?: {
    subject_id?: number;
    difficulty?: string;
    search?: string;
  }): Promise<Game[]> {
    const params = new URLSearchParams();
    if (filters?.subject_id) params.append('subject_id', filters.subject_id.toString());
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const endpoint = `/games/${queryString ? `?${queryString}` : ''}`;
    return apiClient.get<Game[]>(endpoint);
  }

  static async submitGame(gameId: number, submission: GameSubmission): Promise<GameResult> {
    return apiClient.post<GameResult>(`/games/${gameId}/submit/`, submission);
  }

  static async getGameResults(userId?: number): Promise<GameResult[]> {
    const endpoint = userId ? `/results/?user_id=${userId}` : '/results/';
    return apiClient.get<GameResult[]>(endpoint);
  }
}