import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingState } from './StateComponents';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = '/auth',
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.replace(redirectTo as any);
      } else if (!requireAuth && isAuthenticated) {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo]);

  if (isLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect
  }

  if (!requireAuth && isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
};
