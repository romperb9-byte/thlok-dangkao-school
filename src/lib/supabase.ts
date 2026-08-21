import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isProductionBackendConfigured = Boolean(
  url && publishableKey && !url.includes('YOUR_PROJECT') && !publishableKey.includes('YOUR_'),
);

export const appMode = import.meta.env.VITE_APP_MODE === 'production' ? 'production' : 'demo';

export const supabase: SupabaseClient | null = isProductionBackendConfigured
  ? createClient(url!, publishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;


