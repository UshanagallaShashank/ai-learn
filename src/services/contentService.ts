import { supabase } from '../config/supabase';

export interface DaySummary {
    id?: number;
    day: number;
    summary: string;
    key_points: string[];
    created_at?: string;
    updated_at?: string;
    created_by: string;
}

export interface DayContent {
    id?: number;
    day: number;
    title: string;
    content: string;
    additional_notes?: string;
    created_at?: string;
    updated_at?: string;
    created_by: string;
}

export interface DayQuiz {
    id?: number;
    day: number;
    questions: QuizQuestion[];
    created_at?: string;
    updated_at?: string;
    created_by: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer: number;
    explanation?: string;
}

export class ContentService {
    // Day Summaries Management
    static async getAllDaySummaries(): Promise<DaySummary[]> {
        try {
            const { data, error } = await supabase
                .from('day_summaries')
                .select('*')
                .order('day', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error fetching day summaries:', err);
            return [];
        }
    }

    static async getDaySummary(day: number): Promise<DaySummary | null> {
        try {
            const { data, error } = await supabase
                .from('day_summaries')
                .select('*')
                .eq('day', day)
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error fetching day summary:', err);
            return null;
        }
    }

    static async createDaySummary(summary: Omit<DaySummary, 'id' | 'created_at' | 'updated_at'>): Promise<DaySummary | null> {
        try {
            const { data, error } = await supabase
                .from('day_summaries')
                .insert({
                    ...summary,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error creating day summary:', err);
            return null;
        }
    }

    static async updateDaySummary(id: number, updates: Partial<DaySummary>): Promise<DaySummary | null> {
        try {
            const { data, error } = await supabase
                .from('day_summaries')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error updating day summary:', err);
            return null;
        }
    }

    static async deleteDaySummary(id: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('day_summaries')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error deleting day summary:', err);
            return false;
        }
    }

    // Day Content Management
    static async getAllDayContent(): Promise<DayContent[]> {
        try {
            const { data, error } = await supabase
                .from('day_content')
                .select('*')
                .order('day', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error fetching day content:', err);
            return [];
        }
    }

    static async getDayContent(day: number): Promise<DayContent | null> {
        try {
            const { data, error } = await supabase
                .from('day_content')
                .select('*')
                .eq('day', day)
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error fetching day content:', err);
            return null;
        }
    }

    static async createDayContent(content: Omit<DayContent, 'id' | 'created_at' | 'updated_at'>): Promise<DayContent | null> {
        try {
            const { data, error } = await supabase
                .from('day_content')
                .insert({
                    ...content,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error creating day content:', err);
            return null;
        }
    }

    static async updateDayContent(id: number, updates: Partial<DayContent>): Promise<DayContent | null> {
        try {
            const { data, error } = await supabase
                .from('day_content')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error updating day content:', err);
            return null;
        }
    }

    static async deleteDayContent(id: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('day_content')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error deleting day content:', err);
            return false;
        }
    }

    // Day Quiz Management
    static async getAllDayQuizzes(): Promise<DayQuiz[]> {
        try {
            const { data, error } = await supabase
                .from('day_quizzes')
                .select('*')
                .order('day', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error fetching day quizzes:', err);
            return [];
        }
    }

    static async getDayQuiz(day: number): Promise<DayQuiz | null> {
        try {
            const { data, error } = await supabase
                .from('day_quizzes')
                .select('*')
                .eq('day', day)
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error fetching day quiz:', err);
            return null;
        }
    }

    static async createDayQuiz(quiz: Omit<DayQuiz, 'id' | 'created_at' | 'updated_at'>): Promise<DayQuiz | null> {
        try {
            const { data, error } = await supabase
                .from('day_quizzes')
                .insert({
                    ...quiz,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error creating day quiz:', err);
            return null;
        }
    }

    static async updateDayQuiz(id: number, updates: Partial<DayQuiz>): Promise<DayQuiz | null> {
        try {
            const { data, error } = await supabase
                .from('day_quizzes')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error updating day quiz:', err);
            return null;
        }
    }

    static async deleteDayQuiz(id: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('day_quizzes')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error deleting day quiz:', err);
            return false;
        }
    }

    // Bulk operations
    static async bulkCreateSummaries(summaries: Omit<DaySummary, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
        try {
            const summariesWithTimestamps = summaries.map(summary => ({
                ...summary,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            const { error } = await supabase
                .from('day_summaries')
                .insert(summariesWithTimestamps);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error bulk creating summaries:', err);
            return false;
        }
    }

    static async bulkCreateContent(content: Omit<DayContent, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
        try {
            const contentWithTimestamps = content.map(item => ({
                ...item,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            const { error } = await supabase
                .from('day_content')
                .insert(contentWithTimestamps);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error bulk creating content:', err);
            return false;
        }
    }

    static async bulkCreateQuizzes(quizzes: Omit<DayQuiz, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
        try {
            const quizzesWithTimestamps = quizzes.map(quiz => ({
                ...quiz,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            const { error } = await supabase
                .from('day_quizzes')
                .insert(quizzesWithTimestamps);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error bulk creating quizzes:', err);
            return false;
        }
    }

    // Helper methods for generating default content
    static generateDefaultSummary(day: number): Omit<DaySummary, 'id' | 'created_at' | 'updated_at'> {
        return {
            day,
            summary: `Day ${day} focuses on fundamental AI concepts and practical applications.`,
            key_points: [
                'Understanding core AI principles',
                'Practical implementation techniques',
                'Real-world applications and examples'
            ],
            created_by: 'admin'
        };
    }

    static generateDefaultContent(day: number): Omit<DayContent, 'id' | 'created_at' | 'updated_at'> {
        return {
            day,
            title: `Day ${day} Learning Content`,
            content: `This is the main content for Day ${day}. It covers essential AI concepts and provides practical examples for better understanding.`,
            additional_notes: 'Additional notes and resources for this day.',
            created_by: 'admin'
        };
    }

    static generateDefaultQuiz(day: number): Omit<DayQuiz, 'id' | 'created_at' | 'updated_at'> {
        return {
            day,
            questions: [
                {
                    question: `What is the main focus of Day ${day}?`,
                    options: ['Basic concepts', 'Advanced techniques', 'Practical applications', 'All of the above'],
                    correct_answer: 3,
                    explanation: 'Day covers all aspects of AI learning.'
                }
            ],
            created_by: 'admin'
        };
    }
}
