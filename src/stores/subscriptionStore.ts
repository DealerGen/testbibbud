import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { UserSubscription } from '../types';

interface SubscriptionState {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  fetchSubscription: (userId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  loading: false,
  error: null,
  fetchSubscription: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('users')
        .select('subscription_status, subscription_tier, current_period_end')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        set({
          subscription: {
            status: data.subscription_status,
            tier: data.subscription_tier,
            currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : null,
          },
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));