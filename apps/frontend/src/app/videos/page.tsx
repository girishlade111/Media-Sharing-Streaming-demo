'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/hooks/queries';
import { Loader2 } from 'lucide-react';

export default function VideosPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePosts({ page, limit: 10, type: 'VIDEO' });

  const posts = data?.posts || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Videos</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No videos yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
