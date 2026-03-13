'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Pin } from 'lucide-react';
import { formatRelativeTime, cn, getMediaType } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from './VideoPlayer';
import { DocumentViewer } from './DocumentViewer';
import { useLikePost, useDeletePost } from '@/hooks/queries';
import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';

interface PostCardProps {
  post: {
    id: string;
    content: string | null;
    type: string;
    visibility: string;
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
    _count: {
      likes: number;
      comments: number;
    };
  };
  onComment?: () => void;
}

export function PostCard({ post, onComment }: PostCardProps) {
  const { user: currentUser } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const likeMutation = useLikePost();
  const deleteMutation = useDeletePost();

  const handleLike = () => {
    likeMutation.mutate({ id: post.id, liked: isLiked });
    setIsLiked(!isLiked);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(post.id);
    }
  };

  const handleComment = () => {
    if (commentText.trim()) {
      // Would call comment mutation here
      setCommentText('');
    }
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    const mediaItems = post.media.map((pm) => pm.media);

    // Single image
    if (mediaItems.length === 1 && mediaItems[0].mimeType.startsWith('image/')) {
      const media = mediaItems[0];
      return (
        <div className="relative aspect-video">
          <Image
            src={media.cdnUrl || media.thumbnailUrl || ''}
            alt={media.originalName || 'Post image'}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      );
    }

    // Multiple images - grid
    if (mediaItems.every((m) => m.mimeType.startsWith('image/'))) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {mediaItems.slice(0, 4).map((media, index) => (
            <div key={media.id} className="relative aspect-square">
              <Image
                src={media.cdnUrl || media.thumbnailUrl || ''}
                alt={media.originalName || `Image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              {index === 3 && mediaItems.length > 4 && (
                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{mediaItems.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Video
    const video = mediaItems.find((m) => m.mimeType.startsWith('video/'));
    if (video) {
      return (
        <VideoPlayer
          src={video.hlsPlaylistUrl || video.cdnUrl || ''}
          poster={video.thumbnailUrl || undefined}
        />
      );
    }

    // Document
    const document = mediaItems.find(
      (m) =>
        m.mimeType === 'application/pdf' ||
        m.mimeType.includes('document') ||
        m.mimeType.includes('office')
    );
    if (document) {
      return (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium">{document.originalName}</p>
              <p className="text-sm text-muted-foreground">
                {(document.fileSize / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
              onClick={() => window.open(document.cdnUrl, '_blank')}
            >
              View
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.user.avatarUrl || undefined} />
              <AvatarFallback>
                {post.user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {post.user.displayName || post.user.username}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>@{post.user.username}</span>
                <span>•</span>
                <span>{formatRelativeTime(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {post.isPinned && (
              <Pin className="h-4 w-4 text-muted-foreground" />
            )}
            {currentUser?.id === post.user.id && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {post.content && (
          <div className="px-4 pb-3">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
        )}

        {/* Media */}
        {renderMedia() && <div className="px-4 pb-3">{renderMedia()}</div>}

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(isLiked && 'text-red-500')}
              onClick={handleLike}
            >
              <Heart className={cn('h-5 w-5 mr-2', isLiked && 'fill-current')} />
              {likeCount}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {post._count.comments}
            </Button>

            <Button variant="ghost" size="sm">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="p-4 border-t bg-muted/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              />
              <Button onClick={handleComment}>Post</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
