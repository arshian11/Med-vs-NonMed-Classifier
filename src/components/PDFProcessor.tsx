import React, { useState, useRef } from 'react';
import { FileText, Upload, AlertCircle, Loader2, X } from 'lucide-react';
import { classifyFromPDF } from '../services/modelService';
import { ClassificationResult } from '../types/types';

interface PDFProcessorProps {
  onResults: (results: ClassificationResult[]) => void;
  onProcessingStart: () => void;
  isProcessing: boolean;
}

const PDFProcessor: React.FC<PDFProcessorProps> = ({
  onResults,
  onProcessingStart,
  isProcessing
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    onProcessingStart();

    try {
      const results = await classifyFromPDF(selectedFile);
      onResults(results);
    } catch (err) {
      setError('Failed to process PDF file');
      onResults([]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <FileText className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">PDF Processing</h3>
          <p className="text-sm text-slate-600">Convert PDF pages to images and classify</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload PDF File
          </label>
          
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                isDragOver
                  ? 'border-green-400 bg-green-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">
                Drop your PDF here or <span className="text-green-600 font-medium">browse</span>
              </p>
              <p className="text-sm text-slate-500">Maximum file size: 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
                disabled={isProcessing}
              />
            </div>
          ) : (
            <div className="border border-slate-300 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-slate-900">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                disabled={isProcessing}
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !selectedFile}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing PDF...</span>
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              <span>Process PDF</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="text-sm font-medium text-slate-900 mb-2">Processing steps:</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Converts each PDF page to high-quality images</li>
          <li>• Preprocesses images for model compatibility</li>
          <li>• Runs classification on each page image</li>
          <li>• Shows results with page numbers and confidence</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFProcessor;