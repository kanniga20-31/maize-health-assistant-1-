import { useState, useEffect } from 'react';
import { AnalysisResult, Language } from '../types';
import { getDiseaseById, MAIZE_DISEASES } from '../data/diseases';
import { LocalizationCanvas } from './LocalizationCanvas';
import { speechService } from '../services/speechService';
import {
  Volume2,
  VolumeX,
  AlertOctagon,
  ShieldCheck,
  Sprout,
  FlaskConical,
  RotateCcw,
  BookOpen,
  Info,
  Check,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface ResultViewProps {
  result: AnalysisResult;
  lang: Language;
  onNewScan: () => void;
  onOpenGuide: (diseaseId?: string) => void;
  onOpenModelInspector: () => void;
}

export function ResultView({
  result,
  lang,
  onNewScan,
  onOpenGuide,
  onOpenModelInspector,
}: ResultViewProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>(result.diseaseId);

  // Synchronize when a new scan result arrives
  useEffect(() => {
    setSelectedDiseaseId(result.diseaseId);
  }, [result.diseaseId]);

  const disease = getDiseaseById(selectedDiseaseId) || getDiseaseById(result.diseaseId);

  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechService.stop();
    } else {
      const speechTarget = disease
        ? {
            ...result,
            diseaseId: disease.id,
            diseaseNameEn: disease.nameEn,
            diseaseNameTa: disease.nameTa,
            explanationEn: disease.shortDescEn,
            explanationTa: disease.shortDescTa,
          }
        : result;
      speechService.speakAnalysis(speechTarget, lang);
    }
  };

  // Severity display badges
  const getSeverityBadge = () => {
    switch (result.severity) {
      case 'healthy':
        return {
          labelEn: 'Healthy Leaf (Normal)',
          labelTa: 'ஆரோக்கியமான இலை (பாதிப்பில்லை)',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          icon: ShieldCheck,
        };
      case 'mild':
        return {
          labelEn: 'Mild (Early Stage - <10% area)',
          labelTa: 'குறைவான பாதிப்பு (<10% இலைப்பரப்பு)',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
          dot: 'bg-yellow-500',
          icon: Info,
        };
      case 'moderate':
        return {
          labelEn: 'Moderate (Active Spreading - 10-30% area)',
          labelTa: 'நடுத்தர பாதிப்பு (10-30% இலைப்பரப்பு)',
          color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
        };
      case 'severe':
      default:
        return {
          labelEn: 'Severe (Immediate Action Required - >30% area)',
          labelTa: 'அதிக தீவிர பாதிப்பு (உடனடி நடவடிக்கை தேவை)',
          color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
          dot: 'bg-red-500',
          icon: AlertOctagon,
        };
    }
  };

  const severityBadge = getSeverityBadge();
  const SeverityIcon = severityBadge.icon;

  return (
    <div id="result-view-container" className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Action Bar: Retake & Voice Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          type="button"
          onClick={onNewScan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-all shadow-sm active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'ta' ? 'புதிய ஸ்கேன் எடுக்க' : 'New Scan'}</span>
        </button>

        {/* Large Prominent Voice Assistant Button */}
        <button
          type="button"
          onClick={toggleSpeech}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm sm:text-base shadow-md transition-all active:scale-95 ${
            isSpeaking
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-400/40 animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/30'
          }`}
          aria-label="Voice explanation"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5" />
              <span>{lang === 'ta' ? '🔊 பேச்சை நிறுத்த' : '🔊 Stop Voice'}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              <span>{lang === 'ta' ? '🔊 ஒலி விளக்கம் கேட்கவும்' : '🔊 Voice Explanation'}</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Result Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-6 space-y-6">
        {/* Header with Crop Name & Model Badge */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                🌽 {lang === 'ta' ? 'பயிர்: மக்காச்சோளம்' : 'Crop: Maize (Zea mays)'}
              </span>

              {result.affectedOrgan === 'stalk' || result.diseaseId === 'stalk_rot' || selectedDiseaseId === 'stalk_rot' ? (
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                  🌾 {lang === 'ta' ? 'பாதிக்கப்பட்ட பகுதி: தண்டு / கணு' : 'Part: Stalk / Stem Pith'}
                </span>
              ) : result.affectedOrgan === 'ear_cob' || result.diseaseId === 'ear_rot' || result.diseaseId === 'smut' ? (
                <span className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-300 dark:border-orange-800">
                  🌽 {lang === 'ta' ? 'பாதிக்கப்பட்ட பகுதி: கதிர் / மணிகள்' : 'Part: Ear / Cob'}
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-300 dark:border-teal-800">
                  🍃 {lang === 'ta' ? 'பாதிக்கப்பட்ட பகுதி: இலைப்பரப்பு' : 'Part: Leaf Blade'}
                </span>
              )}

              {result.category === 'base_paper' ? (
                <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  {lang === 'ta' ? 'ஆய்வு கட்டுரை வகை (Base Class)' : 'Base Research Class'}
                </span>
              ) : (
                <span className="text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                  {lang === 'ta' ? 'கூடுதல் வகை (Extended Class)' : 'Extended Class'}
                </span>
              )}
            </div>

            {/* Disease Name in Large, Readable Typography */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {lang === 'ta' ? disease?.nameTa || result.diseaseNameTa : disease?.nameEn || result.diseaseNameEn}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
              {disease?.scientificName}
            </p>

            {/* Quick Diagnostic Correction / Switcher */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {lang === 'ta' ? 'மாற்று நோய் தேர்வு:' : 'Change/Confirm Disease:'}
              </span>
              <select
                id="disease-quick-switcher"
                value={selectedDiseaseId}
                onChange={(e) => setSelectedDiseaseId(e.target.value)}
                className="text-xs font-semibold py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-colors"
                aria-label="Confirm or select maize disease"
              >
                {MAIZE_DISEASES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {lang === 'ta' ? `${d.nameTa} (${d.nameEn})` : `${d.nameEn} (${d.nameTa})`}
                  </option>
                ))}
              </select>
              {selectedDiseaseId !== result.diseaseId && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 animate-fade-in">
                  ✓ {lang === 'ta' ? 'மாற்றப்பட்டது' : 'Updated'}
                </span>
              )}
            </div>
          </div>

          {/* Model Status Indicator */}
          <button
            type="button"
            onClick={onOpenModelInspector}
            className="text-right group cursor-pointer"
            title="Inspect LightET-FusionNet model details"
          >
            <div className="text-[11px] text-slate-400 font-medium">
              {lang === 'ta' ? 'மாதிரி முறை:' : 'Model Status:'}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-colors">
              <span
                className={`w-2 h-2 rounded-full ${
                  result.isRealModelConnected ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              />
              <span>
                {result.isRealModelConnected
                  ? result.inferenceSource === 'multimodal_vision_api' || (result.inferenceSource as string) === 'gemini_multimodal_api'
                    ? 'Vision AI (Live)'
                    : 'LightET-FusionNet Live API'
                  : lang === 'ta'
                  ? 'விஷன் AI — மாதிரி முறை'
                  : 'Vision AI — local benchmark mode'}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </div>
          </button>
        </div>

        {/* Vital Metrics Grid (Confidence, Severity, Affected Area) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Confidence Score */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-750">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {lang === 'ta' ? 'நம்பகத்தன்மை அளவு' : 'Confidence'}
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {result.confidence}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>

          {/* 2. Severity Rating */}
          <div className={`p-4 rounded-2xl border ${severityBadge.color}`}>
            <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <SeverityIcon className="w-4 h-4" />
              <span>{lang === 'ta' ? 'பாதிப்பின் தீவிரம் (AI கணிப்பு)' : 'Severity (AI Estimate)'}</span>
            </div>
            <div className="text-lg sm:text-xl font-black mt-1 capitalize">
              {lang === 'ta' ? severityBadge.labelTa : severityBadge.labelEn}
            </div>
            <p className="text-xs mt-1 opacity-90 font-medium">
              ⚠️ {lang === 'ta' ? 'இது AI மாதிரியின் உத்தேச மதிப்பீடு' : 'Clearly noted: This is an AI estimate'}
            </p>
          </div>

          {/* 3. Affected Surface Area */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-750">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {lang === 'ta' ? 'பாதிக்கப்பட்ட இலைப்பரப்பு' : 'Affected Area'}
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {result.affectedAreaPercentage}%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {result.regions.length > 0 ? (
                <span>
                  {result.regions.length}{' '}
                  {lang === 'ta' ? 'கண்டறியப்பட்ட புள்ளிகள்' : 'number of detected lesions'}
                </span>
              ) : (
                <span>{lang === 'ta' ? 'பாதிப்பில்லை' : '0 lesions detected'}</span>
              )}
            </p>
          </div>
        </div>

        {/* Detected Lesion Locations List (Display Requirements) */}
        {result.regions.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {lang === 'ta'
                  ? `கண்டறியப்பட்ட புண்கள் பட்டியல் (${result.regions.length} இடங்கள்):`
                  : `Detected Lesion Locations (${result.regions.length} detected):`}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {lang === 'ta' ? 'பிக்சல் நிலை மாஸ்க்' : 'Pixel-Level Mask'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {result.regions.map((region, idx) => (
                <div
                  key={region.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-2xs"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {region.spotNumber || idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      Lesion {region.spotNumber || idx + 1}: {lang === 'ta' ? region.locationDescTa : region.locationDescEn}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {region.areaPercentage}% {lang === 'ta' ? 'பரப்பு' : 'area'} • {region.confidence}% conf
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disease Explanation Card */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
          <h3 className="font-bold text-sm sm:text-base text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{lang === 'ta' ? 'நோய் பற்றிய சுருக்கம்:' : 'About this Disease:'}</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
            {selectedDiseaseId !== result.diseaseId && disease
              ? lang === 'ta'
                ? disease.shortDescTa
                : disease.shortDescEn
              : lang === 'ta'
              ? result.explanationTa
              : result.explanationEn}
          </p>

          <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              {lang === 'ta' ? 'அவசர பரிந்துரை:' : 'Immediate Recommended Action:'}
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
              👉{' '}
              {selectedDiseaseId !== result.diseaseId && disease
                ? lang === 'ta'
                  ? disease.organicTreatmentTa.steps[0]
                  : disease.organicTreatmentEn.steps[0]
                : lang === 'ta'
                ? result.recommendedActionTa
                : result.recommendedActionEn}
            </p>
          </div>
        </div>

        {/* DISEASE LOCALIZATION VISUALIZER COMPONENT */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>
              {lang === 'ta'
                ? 'இலையில் நோய் எங்குள்ளது? (Disease Localization)'
                : 'Where is the disease located? (Localization Map)'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            {lang === 'ta'
              ? 'கீழுள்ள படத்தில் பாதிக்கப்பட்ட பகுதிகள் துல்லியமான ஒழுங்கற்ற விளிம்புகளுடன் (Irregular Masks) சுட்டிக்காட்டப்பட்டுள்ளன.'
              : 'The image below highlights the actual visible disease-affected regions with precise irregular masks and individual spot confidence tags.'}
          </p>
          <LocalizationCanvas
            imageUrl={result.imageUrl}
            maskDataUrl={result.maskDataUrl}
            binaryMaskDataUrl={result.binaryMaskDataUrl}
            regions={result.regions}
            diseaseName={lang === 'ta' ? result.diseaseNameTa : result.diseaseNameEn}
            diseaseId={result.diseaseId}
            lang={lang}
            isSegmentationModelConnected={result.isSegmentationModelConnected}
            segmentationStatusText={result.segmentationStatusText}
            affectedAreaPercentage={result.affectedAreaPercentage}
            totalLeafPixels={result.totalLeafPixels}
            affectedLesionPixels={result.affectedLesionPixels}
          />
        </div>

        {/* TWO SEPARATE TREATMENT RECOMMENDATIONS (Organic vs Chemical) */}
        <div id="treatments-section" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🩺</span>
              <span>{lang === 'ta' ? 'சிகிச்சை மற்றும் மேலாண்மை' : 'Treatment Recommendations'}</span>
            </h2>

            {/* Treatment Selector Tabs */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('organic')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'organic'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sprout className="w-4 h-4" />
                <span>{lang === 'ta' ? '1. இயற்கை முறை' : '1. Organic / Natural'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('chemical')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'chemical'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>{lang === 'ta' ? '2. உர / ரசாயன முறை' : '2. Chemical / Fertilizer'}</span>
              </button>
            </div>
          </div>

          {/* Section 1: Organic / Natural Method */}
          {activeTab === 'organic' && (
            <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
                    {lang === 'ta'
                      ? disease?.organicTreatmentTa.title || 'இயற்கை வழி சிகிச்சை'
                      : disease?.organicTreatmentEn.title || 'Organic & Natural Management'}
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400">
                    {lang === 'ta'
                      ? 'மண் மற்றும் பயிர் நச்சுத்தன்மையற்ற இயற்கை நடைமுறைகள்'
                      : 'Non-toxic, safe biological and cultural practices'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {(lang === 'ta'
                  ? disease?.organicTreatmentTa.steps
                  : disease?.organicTreatmentEn.steps
                )?.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Fertilizer / Chemical Management */}
          {activeTab === 'chemical' && (
            <div className="p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-950 dark:text-indigo-200">
                    {lang === 'ta'
                      ? disease?.chemicalTreatmentTa.title || 'உர மற்றும் ரசாயன முறை'
                      : disease?.chemicalTreatmentEn.title || 'Fertilizer & Chemical Management'}
                  </h3>
                  <p className="text-xs text-indigo-800 dark:text-indigo-400">
                    {lang === 'ta'
                      ? 'சமச்சீர் ஊட்டச்சத்து மற்றும் பரிந்துரைக்கப்பட்ட பூஞ்சைக் கொல்லி வழிகாட்டுதல்'
                      : 'Nutrient rebalancing and targeted fungicide options'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {(lang === 'ta'
                  ? disease?.chemicalTreatmentTa.steps
                  : disease?.chemicalTreatmentEn.steps
                )?.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* MANDATORY CHEMICAL SAFETY WARNING CARD */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border-2 border-amber-400/80 dark:border-amber-600 text-amber-950 dark:text-amber-200 flex items-start gap-3 shadow-sm">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <p className="font-extrabold uppercase tracking-wide">
                    {lang === 'ta' ? '⚠️ முக்கிய பாதுகாப்பு எச்சரிக்கை:' : '⚠️ Important Safety Warning:'}
                  </p>
                  <p className="leading-relaxed">
                    {lang === 'ta'
                      ? disease?.chemicalTreatmentTa.warning ||
                        'எந்த ஒரு பூஞ்சைக் கொல்லி அல்லது உரத்தை வாங்குவதற்கு முன்பும், உங்கள் பகுதி வட்டார வேளாண்மை அலுவலர் அல்லது வேளாண் அறிவியல் நிலைய (KVK) விஞ்ஞானிகளை அணுகி சரியான மருந்தளவு மற்றும் முறையை உறுதி செய்யவும். தெளிக்கும் போது பாதுகாப்பு கையுறை மற்றும் முகக்கவசம் கட்டாயம் அணியவும்.'
                      : disease?.chemicalTreatmentEn.warning ||
                        'Do not apply chemical pesticides without reading the product label. Always consult your local agricultural extension officer or Krishi Vigyan Kendra (KVK) for certified formulations and accurate dosages suited for your local soil conditions.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Links (Guide & Scan Another) */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpenGuide(result.diseaseId)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'ta' ? 'நோய் கையேட்டில் மேலும் பார்க்க' : 'Open Disease Guide for Details'}
            </span>
          </button>

          <button
            type="button"
            onClick={onNewScan}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'ta' ? 'அடுத்த இலை ஸ்கேன்' : 'Scan Another Leaf'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
