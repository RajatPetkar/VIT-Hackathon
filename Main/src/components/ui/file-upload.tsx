
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  buttonText?: string;
  className?: string;
  defaultValue?: string;
}

export function FileUpload({
  onFileSelect,
  acceptedFileTypes = '.pdf,.doc,.docx,.ppt,.pptx',
  maxSizeMB = 5,
  buttonText = 'Upload File',
  className,
  defaultValue
}: FileUploadProps) {
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    uploaded: boolean;
  } | null>(defaultValue ? {
    name: defaultValue.split('/').pop() || defaultValue,
    size: 0,
    uploaded: true
  } : null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Reset error state
    setError(null);

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = acceptedFileTypes
      .split(',')
      .map(type => type.trim().replace('.', '').toLowerCase());

    if (!acceptedExtensions.includes(fileExtension || '')) {
      setError(`File type not accepted. Accepted types: ${acceptedFileTypes}`);
      return;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    // File is valid, set file info and call the callback
    setFileInfo({
      name: file.name,
      size: file.size,
      uploaded: true
    });

    onFileSelect(file);
    toast({
      title: 'File uploaded',
      description: `${file.name} has been successfully uploaded.`,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
          error && "border-destructive/50 bg-destructive/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          className="hidden"
        />
        
        {fileInfo ? (
          <div className="space-y-2">
            <div className="bg-primary/10 p-4 rounded-lg inline-flex items-center gap-2">
              <File className="h-5 w-5 text-primary" />
              <span className="font-medium">{fileInfo.name}</span>
            </div>
            {fileInfo.size > 0 && (
              <p className="text-sm text-muted-foreground">{formatFileSize(fileInfo.size)}</p>
            )}
            <div className="flex items-center justify-center gap-2 mt-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Successfully uploaded</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick();
              }}
            >
              Replace File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {error ? (
                  <span className="text-destructive flex items-center justify-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Error
                  </span>
                ) : (
                  buttonText
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {error || `Drag and drop or click to upload. (Max: ${maxSizeMB}MB)`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
