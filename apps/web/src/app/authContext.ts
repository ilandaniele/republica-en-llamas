import { createContext } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthState>({ user: null, loading: true });
