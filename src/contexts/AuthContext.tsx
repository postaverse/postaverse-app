import * as React from 'react';
const { createContext, useContext, useEffect, useState } = React;
import type { ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials, TwoFactorChallenge, TwoFactorSetupData, TwoFactorConfirmData } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  requiresTwoFactor: boolean;
  twoFactorChallenge: TwoFactorChallenge | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  setupTwoFactor: () => Promise<TwoFactorSetupData>;
  confirmTwoFactor: (data: TwoFactorConfirmData) => Promise<void>;
  disableTwoFactor: () => Promise<void>;
  generateRecoveryCodes: () => Promise<{ recovery_codes: string[] }>;
  clearTwoFactorChallenge: () => void;
  submitTwoFactorChallenge: (data: { code?: string; recovery_code?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [twoFactorChallenge, setTwoFactorChallenge] = useState<TwoFactorChallenge | null>(null);

  useEffect(() => {
    // Initialize API with dynamic base URL and check auth status
    const initializeApp = async () => {
      await checkAuthStatus();
    };
    initializeApp();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await authAPI.isAuthenticated();
      if (isAuthenticated) {
        const storedUser = await authAPI.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          // Try to fetch fresh user data
          const freshUser = await authAPI.me();
          setUser(freshUser);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear any invalid auth data
      await authAPI.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const result = await authAPI.login(credentials);
      
      // Check if result is a 2FA challenge
      if ('two_factor' in result) {
        setTwoFactorChallenge(result);
        return;
      }
      
      // If we reach here, login was successful
      const { user: loggedInUser } = result;
      setUser(loggedInUser);
      setTwoFactorChallenge(null);
    } catch (error) {
      setTwoFactorChallenge(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      const { user: registeredUser } = await authAPI.register(credentials);
      setUser(registeredUser);
      setTwoFactorChallenge(null);
    } catch (error) {
      setTwoFactorChallenge(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
      setUser(null);
      setTwoFactorChallenge(null);
    } catch (error) {
      console.error('Error logging out:', error);
      // Clear local state anyway
      setUser(null);
      setTwoFactorChallenge(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const setupTwoFactor = async (): Promise<TwoFactorSetupData> => {
    return await authAPI.setupTwoFactor();
  };

  const confirmTwoFactor = async (data: TwoFactorConfirmData): Promise<void> => {
    await authAPI.confirmTwoFactor(data);
    // Refresh user data to get updated two_factor_confirmed_at
    const updatedUser = await authAPI.me();
    setUser(updatedUser);
  };

  const disableTwoFactor = async (): Promise<void> => {
    await authAPI.disableTwoFactor();
    // Refresh user data to get updated two_factor_confirmed_at
    const updatedUser = await authAPI.me();
    setUser(updatedUser);
  };

  const generateRecoveryCodes = async (): Promise<{ recovery_codes: string[] }> => {
    return await authAPI.generateRecoveryCodes();
  };

  const clearTwoFactorChallenge = () => {
    setTwoFactorChallenge(null);
  };

  const submitTwoFactorChallenge = async (data: { code?: string; recovery_code?: string }) => {
    if (!twoFactorChallenge) {
      throw new Error('No two-factor challenge active');
    }
    
    try {
      setIsLoading(true);
      const response = await authAPI.submitTwoFactorChallenge(data);
      
      // Clear the challenge and set the authenticated user
      setTwoFactorChallenge(null);
      setUser(response.user);
    } catch (error) {
      throw error; // Re-throw to let the component handle the error
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    requiresTwoFactor: !!twoFactorChallenge,
    twoFactorChallenge,
    login,
    register,
    logout,
    updateUser,
    setupTwoFactor,
    confirmTwoFactor,
    disableTwoFactor,
    generateRecoveryCodes,
    clearTwoFactorChallenge,
    submitTwoFactorChallenge,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
