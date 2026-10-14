import { useContext } from 'react';
import { supabase } from '../lib/supabase.js';
import { AuthContext } from '../app/authContext.js';

const signIn = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });

const signUp = (email: string, password: string, username: string) =>
  supabase.auth.signUp({ email, password, options: { data: { username } } });

const signOut = () => supabase.auth.signOut();

export function useAuth() {
  const { user, session, loading } = useContext(AuthContext);

  const updateUsername = async (username: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    return supabase.from('profiles').update({ username }).eq('id', user.id);
  };

  return { user, session, loading, signIn, signUp, signOut, updateUsername };
}
