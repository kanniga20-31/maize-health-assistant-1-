import { AnalysisResult } from '../types';
import { SAMPLE_MAIZE_IMAGES } from '../data/sampleImages';

const HISTORY_STORAGE_KEY = 'maize_health_scan_history_v1';

export function getScanHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read scan history', e);
  }

  // Initial seed record so the farmer can view past scans right away
  const seed: AnalysisResult = {
    id: 'seed-scan-01',
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
    crop: 'Maize',
    cropTa: 'மக்காச்சோளம்',
    diseaseId: 'common_rust',
    diseaseNameEn: 'Common Rust',
    diseaseNameTa: 'மக்காச்சோள துரு நோய்',
    category: 'base_paper',
    confidence: 94,
    severity: 'moderate',
    affectedAreaPercentage: 18,
    regions: [
      {
        id: 'spot-1',
        spotNumber: 1,
        diseaseNameEn: 'Common Rust',
        diseaseNameTa: 'மக்காச்சோள துரு நோய்',
        shapeType: 'rust_patch',
        confidence: 94,
        centroid: [0.53, 0.45],
        x: 0.35,
        y: 0.32,
        width: 0.38,
        height: 0.28,
        areaPixels: 480,
        areaPercentage: 18,
        locationDescEn: 'Mid leaf lamina (left & central vein)',
        locationDescTa: 'இலையின் நடுப்பகுதி மற்றும் மைய நரம்பு',
      },
    ],
    analysisMode: 'leaf',
    inferenceSource: 'demo_heuristic',
    isRealModelConnected: false,
    isSegmentationModelConnected: false,
    segmentationMethod: 'pixel_level_cv',
    segmentationStatusText: 'Precise localization model not connected',
    pipelineStages: [],
    explanationEn: 'Small powdery reddish-brown pustules clustered on leaf surface.',
    explanationTa: 'இலையின் மேல் மற்றும் கீழ் பரப்பில் செம்பழுப்பு நிற துரு கொப்புளங்கள்.',
    recommendedActionEn: 'Spray Wettable Sulphur @ 2.5 g/liter during early morning or late evening.',
    recommendedActionTa: 'நனையும் கந்தகம் (Wettable Sulphur) 2.5 கிராம் லிட்டர் தண்ணீரில் கலந்து காலையில் தெளிக்கவும்.',
    imageUrl: SAMPLE_MAIZE_IMAGES[2].svgDataUri,
  };

  saveScanHistory([seed]);
  return [seed];
}

export function saveScanResult(result: AnalysisResult): void {
  try {
    const existing = getScanHistory();
    // Keep max 25 scans to prevent localStorage limits
    const updated = [result, ...existing.filter((item) => item.id !== result.id)].slice(0, 25);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save scan result to history', e);
  }
}

export function saveScanHistory(items: AnalysisResult[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to write history', e);
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}
