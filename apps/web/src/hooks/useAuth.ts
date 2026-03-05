import { useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, ensureProfile } from '../lib/supabase.js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      // On first OAuth sign-in, ensure profile row exists
      if ((event === 'SIGNED_IN') && s?.user) {
        const provider = s.user.app_metadata?.['provider'];
        if (provider === 'google') {
          void ensureProfile(s.user.id, s.user.email ?? '');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, username: string) => {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const updateUsername = async (username: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    return supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);
  };

  return { user, session, loading, signIn, signUp, signOut, updateUsername };
}
