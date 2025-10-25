import { supabase } from '../config/supabase';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    enrolledDate: string;
}

export class AuthService {
    static async signUp(email: string, password: string, name: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    enrolled_date: new Date().toISOString(),
                }
            }
        });

        if (error) throw error;
        return data;
    }

    static async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    }

    static async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    static async getCurrentUser(): Promise<AuthUser | null> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        return {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            enrolledDate: user.user_metadata?.enrolled_date || new Date().toISOString(),
        };
    }

    static onAuthStateChange(callback: (user: AuthUser | null) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const authUser: AuthUser = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || '',
                    enrolledDate: session.user.user_metadata?.enrolled_date || new Date().toISOString(),
                };
                callback(authUser);
            } else {
                callback(null);
            }
        });
    }

    static async getAllUsers(): Promise<any[]> {
        // Create a users table to store user information
        // This is a simplified approach - in production you'd use proper RLS policies
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching users:', error);
                // Fallback: return current user if table doesn't exist or RLS blocks access
                const currentUser = await this.getCurrentUser();
                return currentUser ? [{
                    id: currentUser.id,
                    email: currentUser.email,
                    name: currentUser.name,
                    created_at: currentUser.enrolledDate,
                    user_metadata: { name: currentUser.name }
                }] : [];
            }
            return data || [];
        } catch (err) {
            console.error('Error in getAllUsers:', err);
            // Fallback: return current user
            const currentUser = await this.getCurrentUser();
            return currentUser ? [{
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                created_at: currentUser.enrolledDate,
                user_metadata: { name: currentUser.name }
            }] : [];
        }
    }

    static async createUser(userData: { email: string; name: string; password: string }): Promise<any> {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert({
                    email: userData.email,
                    name: userData.name,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error creating user:', err);
            throw err;
        }
    }

    static async updateUser(userId: string, updates: { name?: string; email?: string; status?: string }): Promise<any> {
        try {
            const { data, error } = await supabase
                .from('users')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error updating user:', err);
            throw err;
        }
    }

    static async deleteUser(userId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error deleting user:', err);
            return false;
        }
    }
}
