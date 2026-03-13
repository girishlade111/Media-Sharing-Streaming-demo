'use client';

import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentViewerProps {
  url: string;
  fileName?: string;
  className?: string;
}

export function DocumentViewer({ url, fileName, className }: DocumentViewerProps) {
  const download = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'document';
    link.target = '_blank';
    link.click();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
        <div className="text-sm text-muted-foreground">
          {fileName || 'Document'}
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={download}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-muted/30 min-h-[500px]">
        <iframe
          src={`https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`}
          className="w-full h-[70vh]"
          frameBorder="0"
          title={fileName || 'Document'}
        />
      </div>
    </div>
  );
}

export function PDFThumbnail({ url, className }: { url: string; className?: string }) {
  return (
    <div className={cn('bg-muted rounded-lg overflow-hidden', className)}>
      <div className="aspect-[3/4] flex items-center justify-center">
        <FileText className="h-16 w-16 text-muted-foreground" />
      </div>
    </div>
  );
}
