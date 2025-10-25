import { supabase } from '../config/supabase';

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

export class ProgressService {
    static async getUserProgress(userId: string): Promise<UserProgress[]> {
        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .order('day', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    static async markDayComplete(userId: string, day: number, timeSpent?: number, quizScore?: number, notes?: string) {
        const { data, error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                day,
                completed: true,
                completed_at: new Date().toISOString(),
                time_spent: timeSpent,
                quiz_score: quizScore,
                notes,
                updated_at: new Date().toISOString(),
            })
            .select();

        if (error) throw error;
        return data;
    }

    static async markDayIncomplete(userId: string, day: number) {
        const { data, error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                day,
                completed: false,
                completed_at: null,
                updated_at: new Date().toISOString(),
            })
            .select();

        if (error) throw error;
        return data;
    }

    static async getUserStats(userId: string): Promise<UserStats> {
        const { data: progress, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('completed', true);

        if (error) throw error;

        const completedDays = progress || [];
        const totalDaysCompleted = completedDays.length;
        const totalHoursLearned = completedDays.reduce((total, day) => {
            return total + (day.time_spent || 0) / 60; // Convert minutes to hours
        }, 0);

        // Calculate current streak
        const sortedDays = completedDays
            .map(d => d.day)
            .sort((a, b) => b - a);

        let currentStreak = 0;
        let expectedDay = 90; // Start from the last day

        for (const day of sortedDays) {
            if (day === expectedDay) {
                currentStreak++;
                expectedDay--;
            } else {
                break;
            }
        }

        // Calculate longest streak
        let longestStreak = 0;
        let tempStreak = 0;
        const allDays = Array.from({ length: 90 }, (_, i) => i + 1);

        for (const day of allDays) {
            if (completedDays.some(d => d.day === day)) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        // Calculate average quiz score
        const quizScores = completedDays
            .filter(d => d.quiz_score !== null && d.quiz_score !== undefined)
            .map(d => d.quiz_score!);

        const averageQuizScore = quizScores.length > 0
            ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
            : 0;

        return {
            total_days_completed: totalDaysCompleted,
            total_hours_learned: Math.round(totalHoursLearned * 10) / 10,
            current_streak: currentStreak,
            longest_streak: longestStreak,
            average_quiz_score: Math.round(averageQuizScore * 10) / 10,
        };
    }

    static async getCompletedDays(userId: string): Promise<Set<number>> {
        const progress = await this.getUserProgress(userId);
        return new Set(progress.filter(p => p.completed).map(p => p.day));
    }

    static async updateProgress(userId: string, day: number, updates: Partial<UserProgress>) {
        const { data, error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                day,
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .select();

        if (error) throw error;
        return data;
    }
}
