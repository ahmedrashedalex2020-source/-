import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider, testConnection } from '../lib/firebase';
import { ensureDatabaseInitialized } from '../services/menuService';

// Bootstrapped administrator email
export const BOOTSTRAP_ADMIN_EMAIL = 'ahmedrashedalex2020@gmail.com';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isConnected: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isConnected: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  authError: null,
  clearAuthError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Test initial connection and ensure initial data is in Firestore
    testConnection().then((ok) => {
      setIsConnected(ok);
      ensureDatabaseInitialized();
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    user && (user.email === BOOTSTRAP_ADMIN_EMAIL || user.email?.endsWith('@alexandrianliver.om'))
  );

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setAuthError(msg);
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      setAuthError(null);
      await signOut(auth);
    } catch (err: unknown) {
      console.error('Sign Out Error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to sign out';
      setAuthError(msg);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isConnected,
        signInWithGoogle,
        signOutUser,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
