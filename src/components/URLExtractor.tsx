import React, { useState } from 'react';
import { Link, Download, AlertCircle, Loader2 } from 'lucide-react';
import { classifyFromURL } from '../services/modelService';
import { ClassificationResult } from '../types/types';

interface URLExtractorProps {
  onResults: (results: ClassificationResult[]) => void;
  onProcessingStart: () => void;
  isProcessing: boolean;
}

const URLExtractor: React.FC<URLExtractorProps> = ({
  onResults,
  onProcessingStart,
  isProcessing
}) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setError('');
    onProcessingStart();

    try {
      // Simulate cloudscaper extraction and classification
      const results = await classifyFromURL(url);
      onResults(results);
    } catch (err) {
      setError('Failed to extract and classify images from URL');
      onResults([]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Link className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">URL Image Extraction</h3>
          <p className="text-sm text-slate-600">Extract and classify images from web pages</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-2">
            Website URL
          </label>
          <div className="relative">
            <input
              type="url"
              id="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isProcessing}
            />
            <Download className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !url.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Extracting & Classifying...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Extract Images</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="text-sm font-medium text-slate-900 mb-2">How it works:</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Uses Cloudscaper to extract images from web pages</li>
          <li>• Preprocesses images for model inference</li>
          <li>• Classifies each image as medical or non-medical</li>
          <li>• Displays results with confidence scores</li>
        </ul>
      </div>
    </div>
  );
};

export default URLExtractor;