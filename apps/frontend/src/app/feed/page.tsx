'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/hooks/queries';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Post } from '@/types';

export default function FeedPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePosts({
    page,
    limit: 10,
  });

  const posts = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Feed</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to share something!
              </p>
            </div>
          ) : (
            <>
              {posts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {pagination && pagination.page < pagination.totalPages && (
                <div className="flex justify-center pt-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
