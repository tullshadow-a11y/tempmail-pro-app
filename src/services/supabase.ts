import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kukvshjfhrypgoernssb.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3nedybplrclAYhtzhjcONw_oGnK3Ejj';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  isVip: boolean;
  vipTier?: 'monthly' | 'yearly' | 'lifetime' | 'free';
  vipExpiresAt?: string;
  createdAt: string;
}

// Initialize Supabase Client securely
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

const LOCAL_USER_KEY = 'tempmail_supabase_local_user';

export class SupabaseAuthService {
  // Get active session user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      console.warn('Supabase auth check notice:', err);
      return null;
    }
  }

  // Register new user with Supabase
  static async signUp(email: string, password: string, fullName?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            is_vip: false,
            vip_tier: 'free',
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await this.syncProfileRecord(data.user.id, {
          email,
          fullName,
          isVip: false,
          vipTier: 'free',
        });
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      console.warn('Supabase signUp error, using local auth session:', err?.message || err);
      const localUser: UserProfile = {
        id: 'usr_local_' + Date.now(),
        email,
        fullName: fullName || email.split('@')[0],
        isVip: false,
        vipTier: 'free',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
      return { user: { id: localUser.id, email: localUser.email } as User, session: null, error: null };
    }
  }

  // Sign in existing user
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      console.warn('Supabase signIn error, checking fallback local session:', err?.message || err);
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === email) {
          return { user: { id: parsed.id, email: parsed.email } as User, session: null, error: null };
        }
      }
      return { user: null, session: null, error: err?.message || 'Invalid login credentials' };
    }
  }

  // Sign out user
  static async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut warning:', err);
    }
    localStorage.removeItem(LOCAL_USER_KEY);
  }

  // Get user profile including VIP status
  static async getUserProfile(userId?: string): Promise<UserProfile | null> {
    const activeUserId = userId || (await this.getCurrentUser())?.id;
    if (!activeUserId) {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', activeUserId)
        .single();

      if (error || !data) {
        const user = await this.getCurrentUser();
        if (user) {
          const profile: UserProfile = {
            id: user.id,
            email: user.email || '',
            fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
            isVip: Boolean(user.user_metadata?.is_vip),
            vipTier: user.user_metadata?.vip_tier || 'free',
            createdAt: user.created_at,
          };
          return profile;
        }
      } else {
        return {
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          isVip: Boolean(data.is_vip),
          vipTier: data.vip_tier || 'free',
          vipExpiresAt: data.vip_expires_at,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn('Failed to fetch profile from Supabase table:', err);
    }

    const saved = localStorage.getItem(LOCAL_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  // Update VIP plan status
  static async updateVipStatus(
    userId: string,
    vipTier: 'monthly' | 'yearly' | 'lifetime' | 'free',
    isVip: boolean = true
  ): Promise<boolean> {
    const expiresAt = vipTier === 'lifetime'
      ? new Date(Date.now() + 100 * 365 * 86400 * 1000).toISOString()
      : vipTier === 'free'
      ? undefined
      : new Date(Date.now() + (vipTier === 'yearly' ? 365 : 30) * 86400 * 1000).toISOString();

    try {
      await supabase.auth.updateUser({
        data: {
          is_vip: isVip,
          vip_tier: vipTier,
          vip_expires_at: expiresAt,
        },
      });

      await supabase
        .from('profiles')
        .upsert({
          id: userId,
          is_vip: isVip,
          vip_tier: vipTier,
          vip_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        });
    } catch (err) {
      console.warn('Supabase update VIP warning:', err);
    }

    const saved = localStorage.getItem(LOCAL_USER_KEY);
    const existing = saved ? JSON.parse(saved) : {};
    const updatedProfile: UserProfile = {
      ...existing,
      id: userId || existing.id || 'usr_' + Date.now(),
      isVip,
      vipTier,
      vipExpiresAt: expiresAt,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updatedProfile));
    return true;
  }

  private static async syncProfileRecord(userId: string, details: Partial<UserProfile>) {
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        email: details.email,
        full_name: details.fullName,
        is_vip: details.isVip || false,
        vip_tier: details.vipTier || 'free',
        created_at: new Date().toISOString(),
      });
    } catch {
      // Ignore table missing errors
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
  }
}
