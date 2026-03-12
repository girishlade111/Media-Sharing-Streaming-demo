'use client';

import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Share Your Media with the World
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Upload, stream, and share your photos, videos, and documents.
              Powered by DigitalOcean Spaces for blazing fast delivery.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/register">
                <button className="h-11 px-8 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                  Get Started
                </button>
              </a>
              <a href="/upload">
                <button className="h-11 px-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-colors">
                  Start Uploading
                </button>
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Photo Sharing</h3>
              <p className="text-muted-foreground">
                Share your photos in stunning quality. Support for JPG, PNG, GIF, and WEBP formats.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Video Streaming</h3>
              <p className="text-muted-foreground">
                Stream videos in adaptive quality with HLS support. Automatic transcoding for optimal playback.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Document Sharing</h3>
              <p className="text-muted-foreground">
                Share PDFs, DOCX, PPTX, and XLSX files. In-browser preview for easy viewing.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">Global</div>
              <div className="text-sm text-muted-foreground">CDN Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">9</div>
              <div className="text-sm text-muted-foreground">9.99% Durability</div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Built with DigitalOcean Spaces for high-performance media storage and delivery.</p>
        </div>
      </footer>
    </div>
  );
}
