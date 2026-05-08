import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  full_name?: string;
  phone?: string;
  image?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  getToken: () => string | null;
}

const STORAGE_TOKEN = 'auth_token';
const STORAGE_USER = 'auth_user';

function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

function userFromToken(token: string): User | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.sub) return null;
  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role || 'user',
    name: payload.name,
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Synchronous init from localStorage so the first render already has token.
    // Eliminates the "token=null on mount → redirect to /login" race that
    // bites pages whose useEffect fires immediately on mount.
    if (typeof window === 'undefined') {
      return { user: null, token: null, isAuthenticated: false, isLoading: false };
    }
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (!token) {
      return { user: null, token: null, isAuthenticated: false, isLoading: false };
    }
    const user = userFromToken(token);
    if (!user) {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_USER);
      return { user: null, token: null, isAuthenticated: false, isLoading: false };
    }
    return { user, token, isAuthenticated: true, isLoading: false };
  });

  // Keep tabs in sync: another tab logging in/out updates this one too.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_TOKEN) return;
      const token = e.newValue;
      if (!token) {
        setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }
      const user = userFromToken(token);
      setAuthState({
        user,
        token: user ? token : null,
        isAuthenticated: !!user,
        isLoading: false,
      });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem(STORAGE_TOKEN, token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    setAuthState({ user, token, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  const getToken = useCallback((): string | null => {
    return authState.token || localStorage.getItem(STORAGE_TOKEN);
  }, [authState.token]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...authState, login, logout, getToken }),
    [authState, login, logout, getToken],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
