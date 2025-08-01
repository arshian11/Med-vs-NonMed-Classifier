export interface ClassificationResult {
  id: string;
  imageUrl: string;
  classification: 'medical' | 'non-medical';
  confidence: number;
  source: 'url' | 'pdf';
  pageNumber?: number;
  originalUrl?: string;
  timestamp: number;
}

export interface ModelConfig {
  type: 'cnn' | 'vit';
  imageSize: [number, number];
  threshold: number;
}