import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi, mediaApi } from '@/lib/api';

export function usePosts(params?: { page?: number; limit?: number; type?: string; userId?: string }) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.list(params),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.get(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { content?: string; mediaIds?: string[]; type?: string; visibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' }) =>
      postsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) =>
      liked ? postsApi.unlike(id) : postsApi.like(id),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, content, parentId }: { postId: string; content: string; parentId?: string }) =>
      postsApi.comment(postId, content, parentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useMedia(params?: { page?: number; limit?: number; type?: 'image' | 'video' | 'document' }) {
  return useQuery({
    queryKey: ['media', params],
    queryFn: () => mediaApi.list(params),
  });
}

export function useRegisterMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { storageKey: string; originalName: string; mimeType: string; fileSize: number; duration?: number; width?: number; height?: number }) =>
      mediaApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mediaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
