import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  maxFiles = 10,
  disabled = false
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newFiles = [...selectedFiles, ...imageFiles].slice(0, maxFiles);
    setSelectedFiles(newFiles);
    onImageSelect(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onImageSelect(newFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          disabled
            ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
            : isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400 cursor-pointer'
        }`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className={`h-8 w-8 mx-auto mb-4 ${disabled ? 'text-slate-300' : 'text-slate-400'}`} />
        <p className={`mb-2 ${disabled ? 'text-slate-400' : 'text-slate-600'}`}>
          {disabled ? 'Processing...' : 'Drop images here or click to browse'}
        </p>
        <p className={`text-sm ${disabled ? 'text-slate-300' : 'text-slate-500'}`}>
          Supports JPG, PNG, GIF (max {maxFiles} files)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            handleFileSelect(files);
          }}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-slate-200"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;