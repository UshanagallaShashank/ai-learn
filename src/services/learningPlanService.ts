import { supabase } from '../config/supabase';
import type { LearningPlan, WeekContent, DayContent } from '../types';

export interface LearningPlanDB {
    id?: number;
    plan_name: string;
    total_days: number;
    plan_data: LearningPlan;
    created_at?: string;
    updated_at?: string;
    is_active: boolean;
}

export class LearningPlanService {
    static async getActiveLearningPlan(): Promise<LearningPlan | null> {
        try {
            const { data, error } = await supabase
                .from('learning_plans')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                console.error('Error fetching learning plan:', error);
                return null;
            }

            return data?.plan_data || null;
        } catch (err) {
            console.error('Error in getActiveLearningPlan:', err);
            return null;
        }
    }

    static async getAllLearningPlans(): Promise<LearningPlanDB[]> {
        try {
            const { data, error } = await supabase
                .from('learning_plans')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching learning plans:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('Error in getAllLearningPlans:', err);
            return [];
        }
    }

    static async createLearningPlan(planData: LearningPlan, planName: string = 'AI Learning Plan'): Promise<LearningPlanDB | null> {
        try {
            // First, deactivate all existing plans
            await supabase
                .from('learning_plans')
                .update({ is_active: false })
                .neq('id', 0); // Update all records

            // Create new plan
            const { data, error } = await supabase
                .from('learning_plans')
                .insert({
                    plan_name: planName,
                    total_days: planData.totalDays,
                    plan_data: planData,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating learning plan:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('Error in createLearningPlan:', err);
            return null;
        }
    }

    static async updateLearningPlan(id: number, planData: LearningPlan, planName?: string): Promise<LearningPlanDB | null> {
        try {
            const updateData: any = {
                plan_data: planData,
                total_days: planData.totalDays,
                updated_at: new Date().toISOString()
            };

            if (planName) {
                updateData.plan_name = planName;
            }

            const { data, error } = await supabase
                .from('learning_plans')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating learning plan:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('Error in updateLearningPlan:', err);
            return null;
        }
    }

    static async setActiveLearningPlan(id: number): Promise<boolean> {
        try {
            // First, deactivate all plans
            await supabase
                .from('learning_plans')
                .update({ is_active: false })
                .neq('id', 0);

            // Then activate the selected plan
            const { error } = await supabase
                .from('learning_plans')
                .update({ is_active: true })
                .eq('id', id);

            if (error) {
                console.error('Error setting active learning plan:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error in setActiveLearningPlan:', err);
            return false;
        }
    }

    static async deleteLearningPlan(id: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('learning_plans')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting learning plan:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error in deleteLearningPlan:', err);
            return false;
        }
    }

    static async initializeDefaultPlan(): Promise<void> {
        try {
            // Check if any plans exist
            const existingPlans = await this.getAllLearningPlans();

            if (existingPlans.length === 0) {
                // Import the default plan
                const { sampleAiLearningPlan } = await import('../utils/learningPlanGenerator');

                await this.createLearningPlan(sampleAiLearningPlan, 'Default AI Learning Plan');
                console.log('Default learning plan initialized');
            }
        } catch (err) {
            console.error('Error initializing default plan:', err);
        }
    }

    // Helper method to validate learning plan structure
    static validateLearningPlan(plan: any): plan is LearningPlan {
        return (
            plan &&
            typeof plan.totalDays === 'number' &&
            Array.isArray(plan.weeks) &&
            plan.weeks.length > 0 &&
            plan.weeks.every((week: any) =>
                week &&
                typeof week.weekNumber === 'number' &&
                Array.isArray(week.days) &&
                week.days.length > 0
            )
        );
    }
}
