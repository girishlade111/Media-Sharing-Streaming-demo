'use client';

import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api';
import { useEffect } from 'react';

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      authApi.getMe()
        .then((userData) => {
          // Token is valid, user data loaded
        })
        .catch(() => {
          clearAuth();
        });
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading: !user && !!localStorage.getItem('accessToken'),
  };
}
