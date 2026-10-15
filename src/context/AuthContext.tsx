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
export const DEFAULT_MASTER_PIN = '1973';
export const DEFAULT_ADMIN_USERNAME = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'alex2024';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const PIN_SESSION_KEY = 'alex_liver_admin_unlocked';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPinUnlocked: boolean;
  isConnected: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  unlockWithPin: (enteredPin: string, correctPin?: string) => boolean;
  unlockWithCredentials: (
    enteredUsername: string,
    enteredPassword: string,
    correctUsername?: string,
    correctPassword?: string
  ) => boolean;
  lockAdmin: () => void;
  authError: string | null;
  sessionNotice: string | null;
  clearAuthError: () => void;
  clearSessionNotice: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isPinUnlocked: false,
  isConnected: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  unlockWithPin: () => false,
  unlockWithCredentials: () => false,
  lockAdmin: () => {},
  authError: null,
  sessionNotice: null,
  clearAuthError: () => {},
  clearSessionNotice: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  // Check session storage for PIN unlock
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(PIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

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

  const isGoogleAdmin = Boolean(
    user && (user.email === BOOTSTRAP_ADMIN_EMAIL || user.email?.endsWith('@alexandrianliver.om'))
  );

  const isAdmin = isGoogleAdmin || isPinUnlocked;

  // Auto-lock on 15 minutes of inactivity
  useEffect(() => {
    if (!isAdmin) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Inactivity reached -> lock admin
        setIsPinUnlocked(false);
        try {
          sessionStorage.removeItem(PIN_SESSION_KEY);
        } catch {
          // ignore
        }
        setSessionNotice('تم قفل لوحة الإدارة تلقائياً بعد مرور 15 دقيقة من عدم النشاط لحماية بيانات المتجر.');
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [isAdmin]);

  const unlockWithPin = (enteredPin: string, correctPin?: string): boolean => {
    const validPin = (correctPin || DEFAULT_MASTER_PIN).trim();
    if (enteredPin.trim() === validPin) {
      setIsPinUnlocked(true);
      try {
        sessionStorage.setItem(PIN_SESSION_KEY, 'true');
      } catch {
        // ignore
      }
      setAuthError(null);
      setSessionNotice(null);
      return true;
    }
    setAuthError('رمز الحماية السري غير صحيح. يرجى إعادة المحاولة.');
    return false;
  };

  const unlockWithCredentials = (
    enteredUsername: string,
    enteredPassword: string,
    correctUsername?: string,
    correctPassword?: string
  ): boolean => {
    const validUser = (correctUsername || DEFAULT_ADMIN_USERNAME).trim().toLowerCase();
    const validPass = (correctPassword || DEFAULT_ADMIN_PASSWORD).trim();

    if (
      enteredUsername.trim().toLowerCase() === validUser &&
      enteredPassword.trim() === validPass
    ) {
      setIsPinUnlocked(true);
      try {
        sessionStorage.setItem(PIN_SESSION_KEY, 'true');
      } catch {
        // ignore
      }
      setAuthError(null);
      setSessionNotice(null);
      return true;
    }
    setAuthError('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.');
    return false;
  };

  const lockAdmin = () => {
    setIsPinUnlocked(false);
    try {
      sessionStorage.removeItem(PIN_SESSION_KEY);
    } catch {
      // ignore
    }
    if (user) {
      signOutUser();
    }
  };

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
  const clearSessionNotice = () => setSessionNotice(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isPinUnlocked,
        isConnected,
        signInWithGoogle,
        signOutUser,
        unlockWithPin,
        unlockWithCredentials,
        lockAdmin,
        authError,
        sessionNotice,
        clearAuthError,
        clearSessionNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

