export interface User {
  id: string;
  username: string;
  displayName?: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  createdAt: string;
}

export interface Media {
  id: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  cdnUrl?: string;
  type: 'image' | 'video' | 'document';
  duration?: number;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  content: string | null;
  type: string;
  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
  isPinned: boolean;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  media: {
    media: {
      id: string;
      mimeType: string;
      thumbnailUrl: string | null;
      cdnUrl: string | null;
      hlsPlaylistUrl: string | null;
      duration: number | null;
      width: number | null;
      height: number | null;
      fileSize: number;
      originalName?: string;
    };
  }[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  updatedAt?: string;
  _count: {
    likes: number;
    comments: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  storageKey: string;
  expiresIn: number;
}

export interface MediaUrlResponse {
  url: string;
  expiresAt: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  postId: string;
  parentId?: string;
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}
