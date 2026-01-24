import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../lib/api';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'management' | 'owner';
  is_owner: boolean;
  is_verified: boolean;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      if (!localStorage.getItem('access_token')) {
        throw new Error('No token');
      }
      const userData = await api.auth.me();
      setUser({ id: userData.id, email: userData.email, role: userData.role });
      setProfile(userData);
    } catch (error) {
      setUser(null);
      setProfile(null);
      api.clearTokens();
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    await api.auth.signup({ email, password, full_name: fullName });
    // After signup, user might need to verify email.
    // We don't auto-login usually if verification is required, or we do.
    // Backend returns User object.
    alert('Account created! Please check your email for verification code.');
  }

  async function signIn(email: string, password: string) {
    const data = await api.auth.login({ email, password }); // Fixed: Backend expects "email" in JSON body
    api.setTokens(data.access_token, data.refresh_token);
    await checkAuth();
  }

  async function signOut() {
    api.clearTokens();
    setUser(null);
    setProfile(null);
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    // TODO: Implement update profile endpoint in backend and client
    // For now, optimistic update or just simple backend call
    // await api.users.update(updates);
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
