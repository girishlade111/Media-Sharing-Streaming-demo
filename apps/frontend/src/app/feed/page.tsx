'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/hooks/queries';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeedPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = usePosts({
    page,
    limit: 10,
  });

  const posts = data?.posts || [];

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
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}

              {data?.pagination && data.pagination.page < data.pagination.totalPages && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Load More
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
