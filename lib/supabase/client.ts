import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Don't create client during static generation
  if (typeof window === 'undefined') {
    // biome-ignore lint/suspicious/noExplicitAny: <ok now>
    return null as any;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anonymous key are required.');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
