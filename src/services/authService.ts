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
}
