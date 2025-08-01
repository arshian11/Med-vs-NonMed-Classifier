import { ClassificationResult } from '../types/types';

// Backend API configuration
const API_BASE_URL = 'http://localhost:5000/api';

export async function classifyFromURL(url: string): Promise<ClassificationResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/classify-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error classifying from URL:', error);
    throw error;
  }
}

export async function classifyFromPDF(file: File): Promise<ClassificationResult[]> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/classify-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error classifying from PDF:', error);
    throw error;
  }
}

export async function classifyImages(images: File[]): Promise<ClassificationResult[]> {
  // This function can be implemented similarly if you want direct image upload
  const results: ClassificationResult[] = [];
  // TODO: Implement direct image classification endpoint
  return results;
}

// Model configuration mock
export const modelConfig = {
  type: 'cnn' as const,
  imageSize: [224, 224] as [number, number],
  threshold: 0.5
};