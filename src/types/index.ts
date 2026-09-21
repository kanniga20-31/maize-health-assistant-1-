export type Language = 'en' | 'ta';

export type DiseaseClassCategory = 'base_paper' | 'extended';

export type SeverityLevel = 'healthy' | 'mild' | 'moderate' | 'severe';

export type AnalysisMode = 'leaf' | 'full_plant';

export type InferenceSource =
  | 'multimodal_vision_api'
  | 'gemini_multimodal_api'
  | 'lightet_fusionnet_api'
  | 'demo_heuristic';

export type LesionShapeType =
  | 'irregular'
  | 'circular'
  | 'oval'
  | 'elongated'
  | 'rust_patch'
  | 'cluster'
  | 'stem_decay'
  | 'pith_discoloration'
  | 'gall'
  | 'cob_rot';

export interface LocalizedRegion {
  id: string;
  spotNumber: number; // e.g. 1, 2, 3...
  diseaseId?: string;
  diseaseNameEn: string;
  diseaseNameTa: string;
  confidence: number;
  shapeType: LesionShapeType;
  // Centroid [x, y] normalized 0..1 for placing pinpoint label tags directly near affected tissue
  centroid: [number, number];
  // Secondary bounding box metadata for label positioning and dataset export (NOT drawn as primary visualization)
  x: number;
  y: number;
  width: number;
  height: number;
  areaPixels: number;
  areaPercentage: number;
  locationDescEn: string;
  locationDescTa: string;
  // Normalized 0..1 boundary polygon points tracing the exact lesion contour
  contourPoints?: Array<[number, number]>;
}

export interface DiseaseInfo {
  id: string;
  category: DiseaseClassCategory;
  nameEn: string;
  nameTa: string;
  scientificName: string;
  tamilPhonetic?: string;
  badge: string;
  shortDescEn: string;
  shortDescTa: string;
  symptomsEn: string[];
  symptomsTa: string[];
  visualCharacteristicsEn: string;
  visualCharacteristicsTa: string;
  organicTreatmentEn: {
    title: string;
    steps: string[];
  };
  organicTreatmentTa: {
    title: string;
    steps: string[];
  };
  chemicalTreatmentEn: {
    title: string;
    steps: string[];
    warning: string;
  };
  chemicalTreatmentTa: {
    title: string;
    steps: string[];
    warning: string;
  };
  preventionEn: string[];
  preventionTa: string[];
  sampleImageUrl?: string;
}

export interface PipelineStage {
  step: number;
  name: string;
  nameTa: string;
  description: string;
  descriptionTa: string;
  details: string;
  durationMs: number;
  status: 'pending' | 'processing' | 'completed';
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  crop: string;
  cropTa: string;
  diseaseId: string;
  diseaseNameEn: string;
  diseaseNameTa: string;
  affectedOrgan?: 'stalk' | 'leaf' | 'ear_cob' | 'whole_plant';
  category: DiseaseClassCategory;
  confidence: number;
  severity: SeverityLevel;
  affectedAreaPercentage: number;
  regions: LocalizedRegion[];
  analysisMode: AnalysisMode;
  inferenceSource: InferenceSource;
  isRealModelConnected: boolean; // Classification API
  isSegmentationModelConnected: boolean; // Segmentation API (U-Net, DeepLabV3+, YOLO-Seg)
  segmentationMethod:
    | 'vision_ai_grounding'
    | 'gemini_vision_grounding'
    | 'deep_segmentation_api'
    | 'ground_truth_dataset'
    | 'user_mask_upload'
    | 'pixel_level_cv'
    | 'none';
  segmentationStatusText: string;
  maskDataUrl?: string; // High-resolution pixel mask (only affected regions with alpha)
  binaryMaskDataUrl?: string; // Standard binary mask PNG (0=healthy/bg, 1=disease) for dataset export
  totalLeafPixels?: number;
  affectedLesionPixels?: number;
  pipelineStages: PipelineStage[];
  explanationEn: string;
  explanationTa: string;
  recommendedActionEn: string;
  recommendedActionTa: string;
  imageUrl: string;
}

export interface ModelConfig {
  classificationEndpoint: string;
  segmentationEndpoint: string;
  enabled: boolean;
  segmentationEnabled: boolean;
  timeoutMs: number;
  apiKey?: string;
  // Legacy backward compatibility
  apiEndpoint?: string;
}

export interface DatasetAnnotationExport {
  imageId: string;
  timestamp: string;
  crop: string;
  diseaseClass: string;
  imageDimensions: { width: number; height: number };
  segmentationModelConnected: boolean;
  totalVisibleLeafPixels?: number;
  totalAffectedLesionPixels?: number;
  totalLeafPixels?: number;
  affectedLesionPixels?: number;
  affectedAreaPercentage: number;
  annotations: {
    spotId: string;
    spotNumber?: number;
    shapeType: LesionShapeType;
    confidence: number;
    centroid?: [number, number];
    areaPixels?: number;
    areaPercentage: number;
    bbox: [number, number, number, number];
  }[];
}
