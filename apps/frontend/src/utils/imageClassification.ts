import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
// import { AnalysisResult } from '../types';

export interface ImagePrediction {
  className: string;
  probability: number;
}

export interface AnalysisResult {
  isSports: boolean;
  predictions: ImagePrediction[];
  confidence: number;
}

let model: mobilenet.MobileNet | null = null;

const SPORTS_KEYWORDS = [
  'sports',
  'ball',
  'racket',
  'court',
  'stadium',
  'player',
  'game',
  'athletic',
  'sport',
  'football',
  'basketball',
  'tennis',
  'baseball',
  'soccer',
  'athlete',
  'team',
  'field',
  'equipment',
];

const initializeModel = async () => {
  if (!model) {
    model = await mobilenet.load();
  }
  return model;
};

export const classifyImage = async (
  imageElement: HTMLImageElement
): Promise<AnalysisResult> => {
  try {
    const model = await initializeModel();
    
    // Ensure the image is loaded and has dimensions
    if (!imageElement.complete || !imageElement.naturalHeight) {
      throw new Error('Image not fully loaded');
    }

    // Convert image to tensor and normalize
    const tfImg = tf.browser.fromPixels(imageElement);
    const normalizedImg = tfImg.toFloat().expandDims();
    
    // Get predictions
    const predictions = await model.classify(imageElement, 5);
    tfImg.dispose();
    normalizedImg.dispose();

    // Process predictions
    const sportsPredictions = predictions.filter((pred) =>
      SPORTS_KEYWORDS.some((keyword) =>
        pred.className.toLowerCase().includes(keyword)
    ));

    const totalConfidence = sportsPredictions.reduce(
      (sum, pred) => sum + pred.probability,
      0
    );

    // Calculate overall confidence score
    const confidenceScore = sportsPredictions.length > 0 
      ? totalConfidence / sportsPredictions.length 
      : 0;

    return {
      isSports: confidenceScore > 0.15, // Adjusted threshold
      predictions: predictions.map(p => ({
        className: p.className,
        probability: p.probability
      })),
      confidence: confidenceScore
    };
  } catch (error) {
    console.error('Error in image classification:', error);
    throw error;
  }
};