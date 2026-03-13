const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type RequestInitWithAuth = RequestInit & {
  requiresAuth?: boolean;
};

const isBrowser = typeof window !== 'undefined';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInitWithAuth = {}
): Promise<T> {
  const { requiresAuth = false, headers = {}, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (requiresAuth) {
    const token = isBrowser ? localStorage.getItem('accessToken') : null;
    if (token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 && requiresAuth) {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        return fetchApi(endpoint, { ...options, requiresAuth });
      }
      if (isBrowser) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    throw new ApiError(data.message || 'Request failed', response.status, data);
  }

  return data;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function refreshAuthToken(): Promise<boolean> {
  const refreshToken = isBrowser ? localStorage.getItem('refreshToken') : null;
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (isBrowser) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return true;
  } catch {
    return false;
  }
}

import type { User, AuthUser, PresignedUrlResponse, MediaUrlResponse, PaginatedResponse, Post, Media } from '@/types';

export const authApi = {
  register: (data: { email: string; username: string; password: string; displayName?: string }) =>
    fetchApi<{ user: AuthUser; accessToken: string; refreshToken: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    fetchApi<{ user: AuthUser; accessToken: string; refreshToken: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () => fetchApi<{ message: string }>('/auth/logout', { method: 'POST', requiresAuth: true }),

  getMe: () => fetchApi<User>('/auth/me', { requiresAuth: true }),

  updateProfile: (data: { displayName?: string; bio?: string }) =>
    fetchApi<User>('/auth/profile', { method: 'PATCH', body: JSON.stringify(data), requiresAuth: true }),
};

export const uploadApi = {
  getPresignedUrl: (data: { fileName: string; fileType: string; fileSize: number; mediaType: 'image' | 'video' | 'document' }) =>
    fetchApi<PresignedUrlResponse>(`/uploads/presigned?fileName=${encodeURIComponent(data.fileName)}&fileType=${encodeURIComponent(data.fileType)}&fileSize=${data.fileSize}&mediaType=${data.mediaType}`, { requiresAuth: true }),

  initMultipart: (data: { fileName: string; fileType: string; mediaType: 'image' | 'video' | 'document' }) =>
    fetchApi<{ uploadId: string; storageKey: string }>('/uploads/multipart/init', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),

  getPartUrl: (storageKey: string, uploadId: string, partNumber: number) =>
    fetchApi<{ uploadUrl: string }>(`/uploads/multipart/part?storageKey=${encodeURIComponent(storageKey)}&uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`, { requiresAuth: true }),

  completeMultipart: (data: { storageKey: string; uploadId: string; parts: { partNumber: number; etag: string }[] }) =>
    fetchApi<{ message: string }>('/uploads/multipart/complete', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),
};

export const mediaApi = {
  list: (params?: { page?: number; limit?: number; type?: 'image' | 'video' | 'document' }): Promise<PaginatedResponse<Media>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.type) query.set('type', params.type);
    return fetchApi(`/media?${query}`, { requiresAuth: true });
  },

  get: (id: string): Promise<Media> => fetchApi(`/media/${id}`),

  register: (data: { storageKey: string; originalName: string; mimeType: string; fileSize: number; duration?: number; width?: number; height?: number }) =>
    fetchApi<Media>('/media', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),

  delete: (id: string) => fetchApi<{ message: string }>(`/media/${id}`, { method: 'DELETE', requiresAuth: true }),

  getUrl: (id: string): Promise<MediaUrlResponse> => fetchApi(`/media/${id}/url`),
};

export const postsApi = {
  list: (params?: { page?: number; limit?: number; type?: string; userId?: string }): Promise<PaginatedResponse<Post>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.type) query.set('type', params.type);
    if (params?.userId) query.set('userId', params.userId);
    return fetchApi(`/posts?${query}`);
  },

  get: (id: string): Promise<Post> => fetchApi(`/posts/${id}`),

  create: (data: { content?: string; mediaIds?: string[]; type?: string; visibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' }) =>
    fetchApi<Post>('/posts', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),

  update: (id: string, data: { content?: string; type?: string; visibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE'; isPinned?: boolean }) =>
    fetchApi<Post>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data), requiresAuth: true }),

  delete: (id: string) => fetchApi<{ message: string }>(`/posts/${id}`, { method: 'DELETE', requiresAuth: true }),

  like: (id: string) => fetchApi<{ message: string }>(`/posts/${id}/like`, { method: 'POST', requiresAuth: true }),

  unlike: (id: string) => fetchApi<{ message: string }>(`/posts/${id}/like`, { method: 'DELETE', requiresAuth: true }),

  comment: (id: string, content: string, parentId?: string) =>
    fetchApi(`/posts/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
      requiresAuth: true,
    }),
};

export { ApiError };
