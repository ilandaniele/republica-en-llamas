import { useContext } from 'react';
import { saveUsername, signIn, signOut, signUp } from '../lib/auth.js';
import { AuthContext } from '../app/authContext.js';

async function updateUsername(username: string): Promise<{ error: Error | null }> {
  try {
    await saveUsername(username);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Request failed') };
  }
}

export function useAuth() {
  const { user, loading } = useContext(AuthContext);
  return { user, loading, signIn, signUp, signOut, updateUsername };
}
