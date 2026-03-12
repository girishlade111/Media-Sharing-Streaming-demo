'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, Video, FileText, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn, formatFileSize } from '@/lib/utils';
import { uploadApi, mediaApi } from '@/lib/api';
import { useToast } from '@/hooks/useToast';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  mediaId?: string;
  storageKey?: string;
  error?: string;
}

interface MediaUploaderProps {
  onUploadComplete: (mediaIds: string[]) => void;
  acceptedTypes?: {
    images?: boolean;
    videos?: boolean;
    documents?: boolean;
  };
  maxFiles?: number;
}

const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
};

const ACCEPTED_VIDEO_TYPES = {
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
};

const ACCEPTED_DOCUMENT_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/plain': ['.txt'],
};

export function MediaUploader({
  onUploadComplete,
  acceptedTypes = { images: true, videos: true, documents: true },
  maxFiles = 10,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const buildAccept = () => {
    const accept: Record<string, string[]> = {};
    if (acceptedTypes.images) Object.assign(accept, ACCEPTED_IMAGE_TYPES);
    if (acceptedTypes.videos) Object.assign(accept, ACCEPTED_VIDEO_TYPES);
    if (acceptedTypes.documents) Object.assign(accept, ACCEPTED_DOCUMENT_TYPES);
    return accept;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: buildAccept(),
    maxFiles,
    multiple: true,
  });

  const getMediaType = (mimeType: string): 'image' | 'video' | 'document' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  };

  const getFileIcon = (file: UploadedFile) => {
    if (file.file.type.startsWith('image/')) return Image;
    if (file.file.type.startsWith('video/')) return Video;
    return FileText;
  };

  const uploadFile = async (uploadedFile: UploadedFile) => {
    const { file } = uploadedFile;
    const mediaType = getMediaType(file.type);

    try {
      // Get presigned URL
      const { uploadUrl, storageKey } = await uploadApi.getPresignedUrl({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        mediaType,
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: 'uploading', storageKey }
            : f
        )
      );

      // Upload to Spaces
      const xhr = new XMLHttpRequest();
      
      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id ? { ...f, progress } : f
              )
            );
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      // Register media in database
      const media = await mediaApi.register({
        storageKey,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: 'uploaded', mediaId: media.id, progress: 100 }
            : f
        )
      );

      return media.id;
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: 'error', error: 'Upload failed' }
            : f
        )
      );
      throw error;
    }
  };

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending' || f.status === 'uploading');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    const mediaIds: string[] = [];

    for (const file of pendingFiles) {
      try {
        const mediaId = await uploadFile(file);
        mediaIds.push(mediaId);
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.file.name}`,
          variant: 'destructive',
        });
      }
    }

    setIsUploading(false);

    const uploadedCount = files.filter((f) => f.status === 'uploaded').length;
    if (uploadedCount > 0) {
      const allMediaIds = files.filter((f) => f.mediaId).map((f) => f.mediaId!);
      onUploadComplete(allMediaIds);
      
      toast({
        title: 'Upload complete',
        description: `${uploadedCount} file(s) uploaded successfully`,
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const uploadedFiles = files.filter((f) => f.status === 'uploaded');

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {acceptedTypes.images && 'Images (JPG, PNG, GIF, WEBP)'}
          {acceptedTypes.videos && ', Videos (MP4, WEBM)'}
          {acceptedTypes.documents && ', Documents (PDF, DOCX, PPTX, XLSX, TXT)'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Max {maxFiles} files
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Files ({files.length})</h4>
            <div className="space-x-2">
              {!isUploading && uploadedFiles.length > 0 && (
                <Button size="sm" variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              )}
              {!isUploading && files.some((f) => f.status === 'pending') && (
                <Button size="sm" onClick={handleUpload}>
                  Upload {files.filter((f) => f.status === 'pending').length} File(s)
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file) => {
              const Icon = getFileIcon(file);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file.size)}
                    </p>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-1 mt-1" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'uploaded' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {file.status === 'error' && (
                      <span className="text-xs text-destructive">{file.error}</span>
                    )}
                    {file.status !== 'uploaded' && file.status !== 'uploading' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
