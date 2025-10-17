export interface User {
  id: number;
  email: string;
  full_name: string;
  grade: Grade;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
}

export interface Grade {
  id: number;
  name: string;
  level: number;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  grade: number;
}

export interface Game {
  id: number;
  title: string;
  description: string;
  subject: Subject;
  game_type: 'mcq' | 'sequencing' | 'fill_blanks';
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit: number;
  xp_reward: number;
  questions: Question[];
}

export interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string | number;
  explanation?: string;
}

export interface GameResult {
  id: number;
  game: Game;
  user: User;
  score: number;
  max_score: number;
  xp_earned: number;
  time_taken: number;
  completed_at: string;
  answers: any[];
}

export interface UserProgress {
  total_xp: number;
  level: number;
  current_level_xp: number;
  next_level_xp: number;
  games_played: number;
  average_score: number;
  badges: Badge[];
  recent_games: GameResult[];
  subject_progress: SubjectProgress[];
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  earned_at?: string;
}

export interface SubjectProgress {
  subject: Subject;
  games_completed: number;
  total_games: number;
  average_score: number;
  total_xp: number;
  progress_percentage: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  total_xp: number;
  level: number;
  games_played: number;
  average_score: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  grade_id: number;
}

export interface GameSubmission {
  answers: any[];
  time_taken: number;
}