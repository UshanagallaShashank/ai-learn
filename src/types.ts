export interface VideoContent {
  title: string;
  link: string;
}

export interface DayContent {
  day: number;
  videos: VideoContent[];
  summary?: string;
  keyPoints?: string[];
  quiz?: QuizQuestion[];
  isWeekend: boolean;
  timeAllocation: number; // in hours
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface LearningPlan {
  [key: string]: VideoContent[];
}

export interface GeneratedContent {
  summary: string;
  keyPoints: string[];
  quiz: QuizQuestion[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  enrolledDate: string;
}

export interface UserProgress {
  id?: string;
  user_id: string;
  day: number;
  completed: boolean;
  completed_at?: string;
  time_spent?: number; // in minutes
  quiz_score?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserStats {
  total_days_completed: number;
  total_hours_learned: number;
  current_streak: number;
  longest_streak: number;
  average_quiz_score: number;
}
