'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerProps {
  url: string;
  fileName?: string;
  className?: string;
}

export function DocumentViewer({ url, fileName, className }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setCurrentPage(1);
  }

  const goToPage = (page: number) => {
    if (numPages && page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const download = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'document.pdf';
    link.target = '_blank';
    link.click();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            Page {currentPage} of {numPages || '--'}
          </span>

          <Button
            size="icon"
            variant="outline"
            disabled={currentPage >= (numPages || 1)}
            onClick={() => goToPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-sm w-16 text-center">{Math.round(scale * 100)}%</span>

          <Button size="icon" variant="outline" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="outline" onClick={download}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document */}
      <div className="border rounded-lg overflow-auto max-h-[70vh] bg-muted/30">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-96">
              <div className="text-muted-foreground">Loading document...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-96">
              <div className="text-destructive">Failed to load document</div>
            </div>
          }
          className="flex flex-col items-center p-4"
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            className="shadow-lg rounded"
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}

// Simple PDF thumbnail preview
export function PDFThumbnail({ url, className }: { url: string; className?: string }) {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  useState(() => {
    // Could implement thumbnail generation here
  });

  return (
    <div className={cn('bg-muted rounded-lg overflow-hidden', className)}>
      <div className="aspect-[3/4] flex items-center justify-center">
        <span className="text-4xl">📕</span>
      </div>
    </div>
  );
}
