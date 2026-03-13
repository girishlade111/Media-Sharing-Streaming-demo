'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/hooks/queries';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImagesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePosts({ page, limit: 12, type: 'IMAGE' });

  const posts = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Images</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No images yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: unknown) => (
                  <PostCard key={(post as { id: string }).id} post={post as never} />
                ))}
              </div>
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
