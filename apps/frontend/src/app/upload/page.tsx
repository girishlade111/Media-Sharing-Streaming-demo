'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaUploader } from '@/components/MediaUploader';
import { useCreatePost } from '@/hooks/queries';
import { useToast } from '@/hooks/useToast';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Header } from '@/components/Header';
import { Loader2 } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const isAuthenticated = useRequireAuth();
  const [content, setContent] = useState('');
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'UNLISTED' | 'PRIVATE'>('PUBLIC');
  const createPost = useCreatePost();
  const { toast } = useToast();

  const handleUploadComplete = (ids: string[]) => {
    setMediaIds(ids);
  };

  const handleSubmit = async () => {
    if (!content && mediaIds.length === 0) {
      toast({
        title: 'Nothing to post',
        description: 'Add some content or media to create a post',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPost.mutateAsync({
        content: content || undefined,
        mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
        visibility,
      });

      toast({
        title: 'Post created',
        description: 'Your post has been published successfully',
      });

      setContent('');
      setMediaIds([]);
      router.push('/');
    } catch (error) {
      toast({
        title: 'Failed to create post',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <Button onClick={() => router.push('/login')}>Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
              />

              <MediaUploader
                onUploadComplete={handleUploadComplete}
                maxFiles={10}
              />

              <div className="flex items-center justify-between pt-4 border-t">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="UNLISTED">Unlisted</option>
                  <option value="PRIVATE">Private</option>
                </select>

                <Button onClick={handleSubmit} disabled={createPost.isPending}>
                  {createPost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {mediaIds.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attached Media ({mediaIds.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {mediaIds.length} file(s) will be attached to your post
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
