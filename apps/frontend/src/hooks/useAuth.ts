'use client';

import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api';
import { useEffect, useState } from 'react';

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token && !user) {
      authApi.getMe()
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          clearAuth();
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user, clearAuth]);

  const loading = typeof window !== 'undefined' 
    ? (!user && !!localStorage.getItem('accessToken')) 
    : false;

  return {
    user,
    isAuthenticated,
    isLoading: loading || isLoading,
  };
}
