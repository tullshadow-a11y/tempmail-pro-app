import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface VIPSubscriber {
  id?: string;
  email: string;
  plan: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'cancelled' | 'expired';
  created_at?: string;
}

export class SupabaseService {
  static async registerSubscriber(email: string, plan: 'monthly' | 'yearly' | 'lifetime'): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('vip_subscribers').upsert({
        email,
        plan,
        status: 'active',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      if (error) {
        console.warn('Supabase upsert error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase service error:', err);
      return false;
    }
  }

  static async checkSubscriberStatus(email: string): Promise<boolean> {
    if (!supabase || !email) return false;
    try {
      const { data, error } = await supabase
        .from('vip_subscribers')
        .select('status')
        .eq('email', email)
        .single();

      if (error || !data) return false;
      return data.status === 'active';
    } catch (err) {
      return false;
    }
  }
}
