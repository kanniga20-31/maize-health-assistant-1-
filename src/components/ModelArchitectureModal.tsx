import { useState, useEffect } from 'react';
import { Language } from '../types';
import {
  X,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ModelArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function ModelArchitectureModal({ isOpen, onClose, lang }: ModelArchitectureModalProps) {
  const [activeTab, setActiveTab] = useState<'architecture' | 'vision_ai'>('vision_ai');
  const [visionStatus, setVisionStatus] = useState<'idle' | 'checking' | 'connected' | 'disconnected'>('idle');
  const [statusDetails, setStatusDetails] = useState<{
    hasKey?: boolean;
    model?: string;
    message?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      checkVisionApi();
    }
  }, [isOpen]);

  const checkVisionApi = async () => {
    setVisionStatus('checking');
    try {
      const res = await fetch('/api/vision/status');
      if (res.ok) {
        const data = await res.json();
        if (data.hasKey) {
          setVisionStatus('connected');
          setStatusDetails({
            hasKey: true,
            model: data.model || 'vision-ai-3.8',
            message: lang === 'ta'
              ? '✅ மல்டிமாடல் விஷன் AI வெற்றிகரமாக இணைக்கப்பட்டுள்ளது!'
              : '✅ Multimodal Vision AI is fully connected and active!',
          });
        } else {
          setVisionStatus('disconnected');
          setStatusDetails({
            hasKey: false,
            model: data.model || 'vision-ai-3.8',
            message: lang === 'ta'
              ? '⚠️ விஷன் AI சாவி சர்வரில் காணப்படவில்லை.'
              : '⚠️ Vision AI key is not detected. Please verify your environment setup.',
          });
        }
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      setVisionStatus('disconnected');
      setStatusDetails({
        hasKey: false,
        message: lang === 'ta'
          ? '⚠️ சர்வர் இணைப்பில் பிழை ஏற்பட்டது. ஆஃப்லைன் பயன்முறை தொடரும்.'
          : '⚠️ Server connection error. Running in local benchmark mode.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Multimodal Vision AI Integration</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ta'
                  ? 'நேரடி நோய் வகைப்படுத்தல் (WHAT) மற்றும் இடம் அறிதல் (WHERE)'
                  : 'Live Multimodal Disease Classification & Lesion Localization'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('vision_ai')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'vision_ai'
                ? 'bg-white dark:bg-slate-850 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{lang === 'ta' ? 'விஷன் AI API' : 'Vision AI Engine'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'architecture'
                ? 'bg-white dark:bg-slate-850 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'ta' ? 'கட்டமைப்பு விவரம்' : 'Architecture Pipeline'}</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'vision_ai' && (
            <div className="space-y-4">
              {/* Status Card */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  visionStatus === 'connected'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    : visionStatus === 'checking'
                    ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800/60 text-blue-900 dark:text-blue-200'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                }`}
              >
                {visionStatus === 'connected' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : visionStatus === 'checking' ? (
                  <Activity className="w-5 h-5 text-blue-500 animate-spin shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      {visionStatus === 'connected'
                        ? lang === 'ta'
                          ? 'விஷன் AI நேரடி இணைப்பு செயல்பாட்டில் உள்ளது'
                          : 'Multimodal Vision API Connected'
                        : visionStatus === 'checking'
                        ? lang === 'ta'
                          ? 'இணைப்பு சோதிக்கப்படுகிறது...'
                          : 'Checking Vision API status...'
                        : lang === 'ta'
                        ? 'விஷன் API ஆஃப்லைன் / மாற்று பயன்முறை'
                        : 'Vision API Offline / Local Mode'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-white/80 dark:bg-slate-800 border border-current">
                      vision-ai-3.8
                    </span>
                  </div>
                  <p className="text-xs mt-1 opacity-90">
                    {statusDetails.message ||
                      (lang === 'ta'
                        ? 'நோய் வகைப்படுத்தல் மற்றும் புள்ளி வாரியான இடங்களை விஷன் AI வழங்குகிறது.'
                        : 'Provides both disease classification (WHAT) and lesion spatial localization (WHERE).')}
                  </p>
                </div>
              </div>

              {/* What Vision AI Does */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>WHAT: Disease Identification</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {lang === 'ta'
                      ? '9 வகை மக்காச்சோள நோய்கள், தீவிரத்தன்மை மற்றும் இயற்கை/ரசாயன சிகிச்சைப் பரிந்துரைகளை துல்லியமாகத் தீர்மானிக்கிறது.'
                      : 'Accurately diagnoses 9 maize disease classes, severity level, and provides bilingual treatment recommendations.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>WHERE: Lesion Localization</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {lang === 'ta'
                      ? 'வெளிப்புற தரவுத்தொகுப்புகள் ஏதுமின்றி, இலையில் உள்ள ஒவ்வொரு புள்ளியின் துல்லியமான எல்லைகள் மற்றும் மாஸ்க்கை நேரடியாக உருவாக்குகிறது.'
                      : 'Directly computes spot bounding boxes [ymin, xmin, ymax, xmax], centroids, and masks on real photos without external datasets.'}
                  </p>
                </div>
              </div>

              {/* Security & Config Info */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                  <span>🔒 {lang === 'ta' ? 'பாதுகாப்பான சர்வர் ஒருங்கிணைப்பு' : 'Secure Full-Stack Proxy'}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    /api/vision/analyze
                  </span>
                </div>
                <p>
                  {lang === 'ta'
                    ? 'உங்கள் API சாவி சர்வர் பக்கத்தில் பாதுகாப்பாக வைக்கப்பட்டுள்ளது. உலாவி பக்கத்தில் சாவி ஒருபோதும் வெளிப்படாது.'
                    : 'The API key is securely managed on the backend server via environment variables and is never exposed to the client browser.'}
                </p>
              </div>

              {/* Ping Connection Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={checkVisionApi}
                  disabled={visionStatus === 'checking'}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Activity className={`w-3.5 h-3.5 text-emerald-400 ${visionStatus === 'checking' ? 'animate-spin' : ''}`} />
                  <span>{lang === 'ta' ? 'இணைப்பை மீண்டும் சோதிக்கவும்' : 'Test Vision Connection'}</span>
                </button>

                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Engine: Multimodal Vision
                </span>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p className="font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  🔬 {lang === 'ta' ? 'ஆராய்ச்சிக் கட்டமைப்பு சுருக்கம்:' : 'Research Architecture & Vision Grounding:'}
                </p>
                {lang === 'ta'
                  ? 'பயிரில் என்ன நோய் உள்ளது (WHAT) மற்றும் அது எங்குள்ளது (WHERE) என்பதை மல்டிமாடல் பார்வை கட்டமைப்பு ஒரே நேரத்தில் துல்லியமாக கண்டறிகிறது. இலையில் உள்ள உண்மையான திசுக்களை பகுப்பாய்வு செய்து உண்மையான பிக்சல் எல்லைகளை வழங்குகிறது.'
                  : 'The system resolves WHAT disease is present and WHERE lesions are located using Multimodal Vision spatial grounding and LightET-FusionNet principles. Lesion boundaries and binary masks are generated directly from genuine visual coordinates.'}
              </div>

              {/* 5-Stage Pipeline List */}
              <div className="space-y-2.5">
                {[
                  {
                    step: 'Stage 1',
                    title: 'RGB Tensor Normalization & Leaf Preprocessing',
                    desc: 'Background isolation, contrast normalization, and chlorophyll spectral checks.',
                  },
                  {
                    step: 'Stage 2',
                    title: 'Multimodal Vision AI Analysis',
                    desc: 'Multimodal inspection evaluating chlorosis, necrotic patches, and pustule structures.',
                  },
                  {
                    step: 'Stage 3',
                    title: 'Disease Classification (WHAT)',
                    desc: 'Accurate disease mapping across 9 maize classes with severity scoring.',
                  },
                  {
                    step: 'Stage 4',
                    title: 'Spatial Coordinate Grounding (WHERE)',
                    desc: 'Prediction of 2D bounding boxes and centroids for each lesion spot.',
                  },
                  {
                    step: 'Stage 5',
                    title: 'Pixel Mask & Overlay Generation',
                    desc: 'Generation of color-coded disease overlay and binary segmentation masks.',
                  },
                ].map((st, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-start gap-3 text-xs"
                  >
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {st.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {st.step}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            {lang === 'ta' ? 'சரி / மூடு' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
