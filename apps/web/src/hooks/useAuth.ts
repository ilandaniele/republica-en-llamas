import { useContext } from 'react';
import { supabase, signIn, signUp, signOut } from '../lib/supabase.js';
import { AuthContext } from '../app/authContext.js';

export function useAuth() {
  const { user, session, loading, passwordRecovery } = useContext(AuthContext);

  const updateUsername = async (username: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    return supabase.from('profiles').update({ username }).eq('id', user.id);
  };

  return { user, session, loading, passwordRecovery, signIn, signUp, signOut, updateUsername };
}
