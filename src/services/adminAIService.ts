import { supabase } from '../config/supabase';
import GeminiService from './geminiService';
import type { DayContent } from '../types';

export interface AIGenerationRequest {
    type: 'summary' | 'content' | 'quiz';
    day?: number;
    startDay?: number;
    endDay?: number;
    weekNumber?: number;
    videos?: Array<{ title: string; url: string }>;
    customPrompt?: string;
}

export interface AIGenerationResult {
    success: boolean;
    data?: any;
    error?: string;
    generatedAt: string;
}

export class AdminAIService {
    private geminiService: GeminiService;

    constructor(apiKey: string) {
        this.geminiService = new GeminiService(apiKey);
    }

    // Generate summary for specific day or range of days
    static async generateSummary(request: AIGenerationRequest): Promise<AIGenerationResult> {
        try {
            const geminiService = new GeminiService(import.meta.env.VITE_GEMINI_API_KEY || '');

            if (request.day) {
                // Generate for single day
                const dayData = await this.getDayData(request.day);
                if (!dayData) {
                    return { success: false, error: 'Day data not found', generatedAt: new Date().toISOString() };
                }

                const summary = await geminiService.generateSummaryFromVideos(dayData.videos);
                return {
                    success: true,
                    data: {
                        day: request.day,
                        summary: summary.summary,
                        key_points: summary.keyPoints
                    },
                    generatedAt: new Date().toISOString()
                };
            } else if (request.startDay && request.endDay) {
                // Generate for range of days
                const results = [];
                for (let day = request.startDay; day <= request.endDay; day++) {
                    const dayData = await this.getDayData(day);
                    if (dayData) {
                        const summary = await geminiService.generateSummaryFromVideos(dayData.videos);
                        results.push({
                            day,
                            summary: summary.summary,
                            key_points: summary.keyPoints
                        });
                    }
                }
                return {
                    success: true,
                    data: results,
                    generatedAt: new Date().toISOString()
                };
            } else if (request.weekNumber) {
                // Generate for entire week
                const weekData = await this.getWeekData(request.weekNumber);
                if (!weekData) {
                    return { success: false, error: 'Week data not found', generatedAt: new Date().toISOString() };
                }

                const allVideos = weekData.flatMap(day => day.videos);
                const summary = await geminiService.generateSummaryFromVideos(allVideos);
                return {
                    success: true,
                    data: {
                        week: request.weekNumber,
                        summary: summary.summary,
                        key_points: summary.keyPoints,
                        days: weekData.map(day => ({
                            day: day.day,
                            summary: summary.summary,
                            key_points: summary.keyPoints
                        }))
                    },
                    generatedAt: new Date().toISOString()
                };
            }

            return { success: false, error: 'Invalid request parameters', generatedAt: new Date().toISOString() };
        } catch (error) {
            console.error('Error generating summary:', error);
            return {
                success: false,
                error: `Failed to generate summary: ${(error as Error).message}`,
                generatedAt: new Date().toISOString()
            };
        }
    }

    // Generate quiz for specific day or range of days
    static async generateQuiz(request: AIGenerationRequest): Promise<AIGenerationResult> {
        try {
            const geminiService = new GeminiService(import.meta.env.VITE_GEMINI_API_KEY || '');

            if (request.day) {
                // Generate for single day
                const dayData = await this.getDayData(request.day);
                if (!dayData) {
                    return { success: false, error: 'Day data not found', generatedAt: new Date().toISOString() };
                }

                const quiz = await geminiService.generateQuizFromVideos(dayData.videos);
                return {
                    success: true,
                    data: {
                        day: request.day,
                        questions: quiz.questions
                    },
                    generatedAt: new Date().toISOString()
                };
            } else if (request.startDay && request.endDay) {
                // Generate for range of days
                const results = [];
                for (let day = request.startDay; day <= request.endDay; day++) {
                    const dayData = await this.getDayData(day);
                    if (dayData) {
                        const quiz = await geminiService.generateQuizFromVideos(dayData.videos);
                        results.push({
                            day,
                            questions: quiz.questions
                        });
                    }
                }
                return {
                    success: true,
                    data: results,
                    generatedAt: new Date().toISOString()
                };
            } else if (request.weekNumber) {
                // Generate for entire week
                const weekData = await this.getWeekData(request.weekNumber);
                if (!weekData) {
                    return { success: false, error: 'Week data not found', generatedAt: new Date().toISOString() };
                }

                const allVideos = weekData.flatMap(day => day.videos);
                const quiz = await geminiService.generateQuizFromVideos(allVideos);
                return {
                    success: true,
                    data: {
                        week: request.weekNumber,
                        questions: quiz.questions,
                        days: weekData.map(day => ({
                            day: day.day,
                            questions: quiz.questions
                        }))
                    },
                    generatedAt: new Date().toISOString()
                };
            }

            return { success: false, error: 'Invalid request parameters', generatedAt: new Date().toISOString() };
        } catch (error) {
            console.error('Error generating quiz:', error);
            return {
                success: false,
                error: `Failed to generate quiz: ${(error as Error).message}`,
                generatedAt: new Date().toISOString()
            };
        }
    }

    // Generate detailed content for specific day or range of days
    static async generateContent(request: AIGenerationRequest): Promise<AIGenerationResult> {
        try {
            const geminiService = new GeminiService(import.meta.env.VITE_GEMINI_API_KEY || '');

            if (request.day) {
                // Generate for single day
                const dayData = await this.getDayData(request.day);
                if (!dayData) {
                    return { success: false, error: 'Day data not found', generatedAt: new Date().toISOString() };
                }

                const content = await geminiService.generateDetailedContentFromVideos(dayData.videos);
                return {
                    success: true,
                    data: {
                        day: request.day,
                        title: content.title,
                        content: content.content,
                        additional_notes: content.additionalNotes
                    },
                    generatedAt: new Date().toISOString()
                };
            } else if (request.startDay && request.endDay) {
                // Generate for range of days
                const results = [];
                for (let day = request.startDay; day <= request.endDay; day++) {
                    const dayData = await this.getDayData(day);
                    if (dayData) {
                        const content = await geminiService.generateDetailedContentFromVideos(dayData.videos);
                        results.push({
                            day,
                            title: content.title,
                            content: content.content,
                            additional_notes: content.additionalNotes
                        });
                    }
                }
                return {
                    success: true,
                    data: results,
                    generatedAt: new Date().toISOString()
                };
            } else if (request.weekNumber) {
                // Generate for entire week
                const weekData = await this.getWeekData(request.weekNumber);
                if (!weekData) {
                    return { success: false, error: 'Week data not found', generatedAt: new Date().toISOString() };
                }

                const allVideos = weekData.flatMap(day => day.videos);
                const content = await geminiService.generateDetailedContentFromVideos(allVideos);
                return {
                    success: true,
                    data: {
                        week: request.weekNumber,
                        title: content.title,
                        content: content.content,
                        additional_notes: content.additionalNotes,
                        days: weekData.map(day => ({
                            day: day.day,
                            title: content.title,
                            content: content.content,
                            additional_notes: content.additionalNotes
                        }))
                    },
                    generatedAt: new Date().toISOString()
                };
            }

            return { success: false, error: 'Invalid request parameters', generatedAt: new Date().toISOString() };
        } catch (error) {
            console.error('Error generating content:', error);
            return {
                success: false,
                error: `Failed to generate content: ${(error as Error).message}`,
                generatedAt: new Date().toISOString()
            };
        }
    }

    // Save generated content to database
    static async saveGeneratedSummary(day: number, summary: string, keyPoints: string[], createdBy: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('day_summaries')
                .upsert({
                    day,
                    summary,
                    key_points: keyPoints,
                    created_by: createdBy,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error saving summary:', err);
            return false;
        }
    }

    static async saveGeneratedContent(day: number, title: string, content: string, additionalNotes: string, createdBy: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('day_content')
                .upsert({
                    day,
                    title,
                    content,
                    additional_notes: additionalNotes,
                    created_by: createdBy,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error saving content:', err);
            return false;
        }
    }

    static async saveGeneratedQuiz(day: number, questions: any[], createdBy: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('day_quizzes')
                .upsert({
                    day,
                    questions,
                    created_by: createdBy,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error saving quiz:', err);
            return false;
        }
    }

    // Helper methods to get day and week data
    private static async getDayData(day: number): Promise<DayContent | null> {
        try {
            const { data: plan } = await supabase
                .from('learning_plans')
                .select('plan_data')
                .eq('is_active', true)
                .single();

            if (!plan) return null;

            const learningPlan = plan.plan_data;
            for (const week of learningPlan.weeks) {
                const dayData = week.days.find(d => d.day === day);
                if (dayData) {
                    return {
                        day: dayData.day,
                        videos: dayData.videos.map(v => ({
                            title: v.title,
                            link: v.url
                        })),
                        isWeekend: dayData.isWeekend,
                        timeAllocation: dayData.timeAllocation
                    };
                }
            }
            return null;
        } catch (err) {
            console.error('Error getting day data:', err);
            return null;
        }
    }

    private static async getWeekData(weekNumber: number): Promise<DayContent[]> {
        try {
            const { data: plan } = await supabase
                .from('learning_plans')
                .select('plan_data')
                .eq('is_active', true)
                .single();

            if (!plan) return [];

            const learningPlan = plan.plan_data;
            const week = learningPlan.weeks.find(w => w.weekNumber === weekNumber);
            if (!week) return [];

            return week.days.map(day => ({
                day: day.day,
                videos: day.videos.map(v => ({
                    title: v.title,
                    link: v.url
                })),
                isWeekend: day.isWeekend,
                timeAllocation: day.timeAllocation
            }));
        } catch (err) {
            console.error('Error getting week data:', err);
            return [];
        }
    }

    // Regenerate existing content
    static async regenerateContent(type: 'summary' | 'content' | 'quiz', day: number): Promise<AIGenerationResult> {
        const request: AIGenerationRequest = { type, day };

        switch (type) {
            case 'summary':
                return await this.generateSummary(request);
            case 'content':
                return await this.generateContent(request);
            case 'quiz':
                return await this.generateQuiz(request);
            default:
                return { success: false, error: 'Invalid content type', generatedAt: new Date().toISOString() };
        }
    }

    // Bulk regenerate for multiple days
    static async bulkRegenerateContent(type: 'summary' | 'content' | 'quiz', startDay: number, endDay: number): Promise<AIGenerationResult> {
        const request: AIGenerationRequest = { type, startDay, endDay };

        switch (type) {
            case 'summary':
                return await this.generateSummary(request);
            case 'content':
                return await this.generateContent(request);
            case 'quiz':
                return await this.generateQuiz(request);
            default:
                return { success: false, error: 'Invalid content type', generatedAt: new Date().toISOString() };
        }
    }
}
