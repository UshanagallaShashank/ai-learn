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
