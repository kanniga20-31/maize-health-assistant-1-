import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import {
  Language,
  AnalysisResult,
  AnalysisMode,
  PipelineStage,
} from './types';
import { Navbar } from './components/Navbar';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisPipelineModal } from './components/AnalysisPipelineModal';
import { ResultView } from './components/ResultView';
import { DiseaseGuideModal } from './components/DiseaseGuideModal';
import { HistoryModal } from './components/HistoryModal';
import { ModelArchitectureModal } from './components/ModelArchitectureModal';
import { SAMPLE_MAIZE_IMAGES, SampleLeaf } from './data/sampleImages';
import { runLightETFUsionNetInference, checkGeminiStatus } from './services/mlInference';
import { getScanHistory, saveScanResult } from './services/historyService';
import {
  Camera,
  Upload,
  BookOpen,
  Clock,
  Sparkles,
  Leaf,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('leaf');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  // Modals & UI States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingImagePreview, setAnalyzingImagePreview] = useState<string | undefined>(undefined);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideInitialId, setGuideInitialId] = useState<string | undefined>(undefined);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  // History and Model status
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isRealModelConnected, setIsRealModelConnected] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setHistory(getScanHistory());
    checkGeminiStatus().then((res) => {
      setIsRealModelConnected(res.connected);
    });
  }, [isModelModalOpen]);

  // Handle image analysis submission
  const handleAnalyzeImage = async (imageDataUri: string, knownHint?: string) => {
    setAnalyzingImagePreview(imageDataUri);
    setIsAnalyzing(true);

    try {
      const result = await runLightETFUsionNetInference(
        imageDataUri,
        analysisMode,
        knownHint,
        (stages) => setPipelineStages(stages)
      );

      // Save to history
      saveScanResult(result);
      setHistory(getScanHistory());
      setCurrentResult(result);
    } catch (err) {
      console.error('Inference error:', err);
      alert('Analysis encountered an issue. Please try another image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Gallery file upload
  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        handleAnalyzeImage(dataUri);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be re-selected
    e.target.value = '';
  };

  const handleSelectSample = (sample: SampleLeaf) => {
    // If sample has a specific mode (like full_plant), switch to it
    if (sample.mode) {
      setAnalysisMode(sample.mode);
    }
    handleAnalyzeImage(sample.imageUrl || sample.svgDataUri, sample.diseaseId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => {
          setGuideInitialId(undefined);
          setIsGuideOpen(true);
        }}
        onOpenModelArchitecture={() => setIsModelModalOpen(true)}
        isRealModelConnected={isRealModelConnected}
        historyCount={history.length}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {currentResult ? (
          /* RESULT SCREEN VIEW */
          <ResultView
            result={currentResult}
            lang={lang}
            onNewScan={() => setCurrentResult(null)}
            onOpenGuide={(diseaseId) => {
              setGuideInitialId(diseaseId);
              setIsGuideOpen(true);
            }}
            onOpenModelInspector={() => setIsModelModalOpen(true)}
          />
        ) : (
          /* HOME SCREEN VIEW */
          <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full space-y-8 py-2 sm:py-6">
            {/* Header Hero Title with Research Badge */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>LightET-FusionNet Research Model (Base 4 + Extended 5 Classes)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                🌱 {lang === 'ta' ? 'மக்காச்சோள பயிர் நல உதவியாளர்' : 'Maize Health Assistant'}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                {lang === 'ta'
                  ? 'மக்காச்சோள இலை அல்லது முழு செடியை படம் பிடித்து உடனடியாக நோய் பாதிப்பு, இருக்கும் இடம் மற்றும் இயற்கை/ரசாயன சிகிச்சை ஆலோசனைகளைப் பெறுங்கள்.'
                  : 'Scan a maize leaf or whole plant to detect diseases, pinpoint affected leaf locations, and receive practical organic & fertilizer management recommendations.'}
              </p>
            </div>

            {/* Analysis Mode Toggle (Leaf Close-Up vs Full Plant Canopy) */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAnalysisMode('leaf')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  analysisMode === 'leaf'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Leaf className="w-4 h-4" />
                <span>{lang === 'ta' ? 'இலை நெருக்கப் பார்வை (Leaf Close-Up)' : 'Single Leaf Close-Up'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisMode('full_plant')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  analysisMode === 'full_plant'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{lang === 'ta' ? 'முழு செடி பார்வை (Full Canopy)' : 'Full Plant Canopy'}</span>
              </button>
            </div>

            {/* PRIMARY SCAN BUTTONS (Large Farmer-Friendly Touch Targets) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Button 1: Camera */}
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-[0.98] text-white shadow-xl shadow-emerald-700/20 flex flex-col items-center justify-center text-center gap-4 transition-all"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold flex items-center justify-center gap-2">
                    <span>📷</span>
                    <span>{lang === 'ta' ? 'கேமரா மூலம் ஸ்கேன்' : 'Scan with Camera'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                    {lang === 'ta'
                      ? 'மொபைல் கேமராவைத் திறந்து இலையை படம் பிடிக்கவும்'
                      : 'Open phone camera to snap a live leaf'}
                  </p>
                </div>
              </button>

              {/* Button 2: Gallery Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-600/30 hover:border-emerald-600 active:scale-[0.98] text-slate-900 dark:text-white shadow-lg flex flex-col items-center justify-center text-center gap-4 transition-all"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold flex items-center justify-center gap-2">
                    <span>🖼️</span>
                    <span>{lang === 'ta' ? 'கேலரியிலிருந்து பதிவேற்று' : 'Upload from Gallery'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {lang === 'ta'
                      ? 'உங்கள் போனில் உள்ள படத்தைத் தேர்ந்தெடுக்கவும்'
                      : 'Choose an existing photo from your device'}
                  </p>
                </div>
              </button>
            </div>

            {/* Hidden File Input for Gallery */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGalleryUpload}
            />

            {/* Secondary Action Grid: Scan History & Disease Guide */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs flex items-center gap-3 transition-all active:scale-98"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    📋 {lang === 'ta' ? 'ஸ்கேன் வரலாறு' : 'Scan History'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {history.length} {lang === 'ta' ? 'சேமித்த பதிவுகள்' : 'saved scans'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGuideInitialId(undefined);
                  setIsGuideOpen(true);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs flex items-center gap-3 transition-all active:scale-98"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    ℹ️ {lang === 'ta' ? 'நோய் வழிகாட்டி' : 'Disease Guide'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {lang === 'ta' ? '9 நோய்களின் விவரம்' : '9 maize diseases'}
                  </p>
                </div>
              </button>
            </div>

            {/* CURATED TEST FIELD SAMPLES SECTION */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="text-emerald-500">📸</span>
                  <span>
                    {lang === 'ta'
                      ? 'அல்லது உண்மை மாதிரி இலைகளைக் கொண்டு சோதிக்கவும்:'
                      : 'Or test instantly with real leaf photographs:'}
                  </span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                  Real Field Photos
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SAMPLE_MAIZE_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-slate-850 hover:shadow-md hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all text-left flex items-center gap-2.5 group active:scale-95"
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 relative shadow-inner">
                      <img
                        src={sample.imageUrl || sample.svgDataUri}
                        alt={sample.nameEn}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[2px] text-[8px] font-bold text-white text-center py-0.5 leading-none">
                        REAL
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {lang === 'ta' ? sample.nameTa : sample.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${sample.diseaseId === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{sample.mode === 'full_plant' ? 'Canopy Scan' : sample.category === 'base_paper' ? 'Base Paper' : 'Extended'}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Architecture Card Footer Link */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'ta'
                    ? 'LightET-FusionNet: EfficientNetV2B0 + SE கவனம் + ExtraTrees'
                    : 'LightET-FusionNet: EfficientNetV2B0 + SE Attention + ExtraTrees'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModelModalOpen(true)}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0 ml-2"
              >
                {lang === 'ta' ? 'விவரம் / API' : 'Details / API'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUri) => {
          setIsCameraOpen(false);
          handleAnalyzeImage(dataUri);
        }}
        lang={lang}
        mode={analysisMode}
      />

      {/* Analysis Pipeline Step-by-Step Loader Modal */}
      <AnalysisPipelineModal
        isOpen={isAnalyzing}
        stages={pipelineStages}
        lang={lang}
        imageUrl={analyzingImagePreview}
      />

      {/* Disease Guide Modal */}
      <DiseaseGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
        initialSelectedId={guideInitialId}
      />

      {/* Scan History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => {
          setCurrentResult(item);
          setIsHistoryOpen(false);
        }}
        onHistoryCleared={() => setHistory([])}
        lang={lang}
      />

      {/* Model Architecture & API Settings Modal */}
      <ModelArchitectureModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
