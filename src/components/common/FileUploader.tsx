import React, { useCallback, useState } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/helpers';

export interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  maxSize = 10,
  className
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File) => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isAcceptedType = acceptedTypes.includes(extension) || acceptedTypes.includes('*');
    const isValidSize = file.size <= maxSize * 1024 * 1024;
    
    if (!isAcceptedType) {
      setError(`File type not accepted. Accepted: ${acceptedTypes.join(', ')}`);
      return false;
    }
    if (!isValidSize) {
      setError(`File is too large. Max size: ${maxSize}MB`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [onFileSelect, acceptedTypes, maxSize]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className={className}>
      {!selectedFile ? (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors bg-gray-50",
            dragActive ? "border-blue-900 bg-blue-50" : "border-gray-300 hover:border-gray-400",
            error ? "border-red-300 bg-red-50" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept={acceptedTypes.join(',')}
          />
          <UploadCloud className={cn("w-10 h-10 mb-3", error ? "text-red-400" : "text-gray-400")} />
          <p className="mb-2 text-sm font-medium text-gray-900">
            <span className="text-blue-900">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {acceptedTypes.join(', ')} (max. {maxSize}MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
              <File className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1.5" />
          {error}
        </div>
      )}
    </div>
  );
};