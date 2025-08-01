import React, { useState } from 'react';
import { FileText, Link, Upload, Zap } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import URLExtractor from './components/URLExtractor';
import PDFProcessor from './components/PDFProcessor';
import ResultsDisplay from './components/ResultsDisplay';
import { ClassificationResult } from './types/types';

function App() {
  const [activeTab, setActiveTab] = useState<'url' | 'pdf'>('url');
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResults = (newResults: ClassificationResult[]) => {
    setResults(newResults);
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">MedClassify AI</h1>
              <p className="text-slate-600">Medical Image Classification System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === 'url'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Link className="h-4 w-4" />
              <span>URL Extraction</span>
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === 'pdf'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>PDF Processing</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {activeTab === 'url' && (
              <URLExtractor
                onResults={handleResults}
                onProcessingStart={handleProcessingStart}
                isProcessing={isProcessing}
              />
            )}
            {activeTab === 'pdf' && (
              <PDFProcessor
                onResults={handleResults}
                onProcessingStart={handleProcessingStart}
                isProcessing={isProcessing}
              />
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <ResultsDisplay
              results={results}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Model Info */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Model Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">CNN + ViT</div>
              <div className="text-sm text-slate-600">Architecture</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">95.2%</div>
              <div className="text-sm text-slate-600">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">ResNet-18</div>
              <div className="text-sm text-slate-600">Base Model</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;