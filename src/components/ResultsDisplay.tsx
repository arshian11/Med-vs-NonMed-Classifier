import React from 'react';
import { Activity, FileText, Link, Clock, TrendingUp } from 'lucide-react';
import { ClassificationResult } from '../types/types';

interface ResultsDisplayProps {
  results: ClassificationResult[];
  isProcessing: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isProcessing }) => {
  const medicalCount = results.filter(r => r.classification === 'medical').length;
  const nonMedicalCount = results.filter(r => r.classification === 'non-medical').length;

  if (isProcessing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Processing Images</h3>
          <p className="text-slate-600">Extracting and classifying images...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Ready for Classification</h3>
          <p className="text-slate-600">Upload a PDF or enter a URL to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Classification Results</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{results.length}</div>
            <div className="text-xs text-slate-600">Total Images</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{medicalCount}</div>
            <div className="text-xs text-slate-600">Medical</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{nonMedicalCount}</div>
            <div className="text-xs text-slate-600">Non-Medical</div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h4 className="text-md font-medium text-slate-900 mb-4">Image Classifications</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={result.imageUrl}
                  alt="Classified image"
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.classification === 'medical'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {result.classification === 'medical' ? 'Medical' : 'Non-Medical'}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      {result.source === 'pdf' ? (
                        <FileText className="h-3 w-3" />
                      ) : (
                        <Link className="h-3 w-3" />
                      )}
                      <span>
                        {result.source === 'pdf' && result.pageNumber
                          ? `Page ${result.pageNumber}`
                          : 'URL'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-3 w-3 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        result.classification === 'medical'
                          ? 'bg-green-500'
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center space-x-1 mt-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;