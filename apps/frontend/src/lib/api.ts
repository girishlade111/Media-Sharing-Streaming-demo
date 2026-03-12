const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type RequestInitWithAuth = RequestInit & {
  requiresAuth?: boolean;
};

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

  // Add auth token if required
  if (requiresAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401 && requiresAuth) {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        // Retry with new token
        return fetchApi(endpoint, { ...options, requiresAuth });
      }
      // Clear auth and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }

    throw new ApiError(data.message || 'Request failed', response.status, data);
  }

  return data;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function refreshAuthToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// Auth API
export const authApi = {
  register: (data: { email: string; username: string; password: string; displayName?: string }) =>
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () => fetchApi('/auth/logout', { method: 'POST', requiresAuth: true }),

  getMe: () => fetchApi('/auth/me', { requiresAuth: true }),

  updateProfile: (data: { displayName?: string; bio?: string }) =>
    fetchApi('/auth/profile', { method: 'PATCH', body: JSON.stringify(data), requiresAuth: true }),
};

// Upload API
export const uploadApi = {
  getPresignedUrl: (data: { fileName: string; fileType: string; fileSize: number; mediaType: 'image' | 'video' | 'document' }) =>
    fetchApi(`/uploads/presigned?fileName=${encodeURIComponent(data.fileName)}&fileType=${encodeURIComponent(data.fileType)}&fileSize=${data.fileSize}&mediaType=${data.mediaType}`, { requiresAuth: true }),

  initMultipart: (data: { fileName: string; fileType: string; mediaType: 'image' | 'video' | 'document' }) =>
    fetchApi('/uploads/multipart/init', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),

  getPartUrl: (storageKey: string, uploadId: string, partNumber: number) =>
    fetchApi(`/uploads/multipart/part?storageKey=${encodeURIComponent(storageKey)}&uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`, { requiresAuth: true }),

  completeMultipart: (data: { storageKey: string; uploadId: string; parts: { partNumber: number; etag: string }[] }) =>
    fetchApi('/uploads/multipart/complete', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),
};

// Media API
export const mediaApi = {
  list: (params?: { page?: number; limit?: number; type?: 'image' | 'video' | 'document' }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.type) query.set('type', params.type);
    return fetchApi(`/media?${query}`, { requiresAuth: true });
  },

  get: (id: string) => fetchApi(`/media/${id}`),

  register: (data: { storageKey: string; originalName: string; mimeType: string; fileSize: number; duration?: number; width?: number; height?: number }) =>
    fetchApi('/media', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),

  delete: (id: string) => fetchApi(`/media/${id}`, { method: 'DELETE', requiresAuth: true }),

  getUrl: (id: string) => fetchApi(`/media/${id}/url`),
};

// Posts API
export const postsApi = {
  list: (params?: { page?: number; limit?: number; type?: string; userId?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.type) query.set('type', params.type);
    if (params?.userId) query.set('userId', params.userId);
    return fetchApi(`/posts?${query}`);
  },

  get: (id: string) => fetchApi(`/posts/${id}`),

  create: (data: { content?: string; mediaIds?: string[]; type?: string; visibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' }) =>
    fetchApi('/posts', { method: 'POST', body: JSON.stringify(data), requiresAuth: true }),

  update: (id: string, data: { content?: string; type?: string; visibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE'; isPinned?: boolean }) =>
    fetchApi(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data), requiresAuth: true }),

  delete: (id: string) => fetchApi(`/posts/${id}`, { method: 'DELETE', requiresAuth: true }),

  like: (id: string) => fetchApi(`/posts/${id}/like`, { method: 'POST', requiresAuth: true }),

  unlike: (id: string) => fetchApi(`/posts/${id}/like`, { method: 'DELETE', requiresAuth: true }),

  comment: (id: string, content: string, parentId?: string) =>
    fetchApi(`/posts/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
      requiresAuth: true,
    }),
};

export { ApiError };
