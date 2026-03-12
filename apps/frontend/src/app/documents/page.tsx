'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { useMedia } from '@/hooks/queries';
import { Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatFileSize, formatDate } from '@/lib/utils';
import { DocumentViewer } from '@/components/DocumentViewer';
import { Dialog } from '@/components/ui/dialog';

export default function DocumentsPage() {
  const [page, setPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const { data, isLoading } = useMedia({ page, limit: 20, type: 'document' });

  const documents = data?.media || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Documents</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No documents yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {documents.map((doc: any) => (
                <Card
                  key={doc.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-3">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium truncate">{doc.originalName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(Number(doc.fileSize))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(doc.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{selectedDoc.originalName}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDoc(null)}
              >
                Close
              </Button>
            </div>
            <div className="p-4">
              <DocumentViewer url={selectedDoc.cdnUrl} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
