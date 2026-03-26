import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, isAuthenticated, verifyAuth } from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (isAuthenticated()) {
        // verifyAuth hits /auth/me. If the token is invalid or expired it clears
        // storage and returns null. Never fall back to stale localStorage data.
        const verifiedUser = await verifyAuth();
        if (verifiedUser) {
          setUser(verifiedUser);
        }
        // If verifiedUser is null, verifyAuth already cleared the stale session.
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password, businessName, industry) => {
    const data = await apiSignup(name, email, password, businessName, industry);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
