import { PipelineStage, Language } from '../types';
import { Cpu, CheckCircle, Loader2, Sparkles, Network } from 'lucide-react';

interface AnalysisPipelineModalProps {
  isOpen: boolean;
  stages: PipelineStage[];
  lang: Language;
  imageUrl?: string;
}

export function AnalysisPipelineModal({ isOpen, stages, lang, imageUrl }: AnalysisPipelineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2">
              <span>{lang === 'ta' ? 'LightET-FusionNet ஆய்வு நடக்கிறது' : 'LightET-FusionNet Analysis'}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                AI Pipeline
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ta'
                ? 'இலை படத்தை ஆழமாக ஆய்வு செய்கிறது...'
                : 'Extracting leaf patterns through 5 deep learning stages...'}
            </p>
          </div>
        </div>

        {/* Thumbnail Preview & Wave */}
        {imageUrl && (
          <div className="relative h-28 bg-black/60 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
            <img src={imageUrl} alt="Analyzing Leaf" className="h-full w-full object-contain opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900 pointer-events-none" />
            {/* Animated Laser Scanning Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce" />
            <div className="absolute bottom-2 px-3 py-1 bg-black/75 rounded-full border border-emerald-500/30 text-[11px] text-emerald-300 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{lang === 'ta' ? 'இலை ஸ்கேன் செய்யப்படுகிறது...' : 'Scanning leaf texture & chlorophyll...'}</span>
            </div>
          </div>
        )}

        {/* Pipeline Stage List */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {stages.map((stage) => {
            const isProcessing = stage.status === 'processing';
            const isCompleted = stage.status === 'completed';

            return (
              <div
                key={stage.step}
                className={`p-3 rounded-2xl border transition-all ${
                  isProcessing
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                    : isCompleted
                    ? 'bg-slate-800/50 border-emerald-800/40 text-slate-200'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : isProcessing
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        stage.step
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs sm:text-sm text-slate-100 truncate">
                        {lang === 'ta' ? stage.nameTa : stage.name}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {lang === 'ta' ? stage.descriptionTa : stage.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isProcessing
                        ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted
                      ? lang === 'ta'
                        ? 'முடிந்தது'
                        : 'Done'
                      : isProcessing
                      ? lang === 'ta'
                        ? 'செயலில்...'
                        : 'Active'
                      : lang === 'ta'
                      ? 'காத்திருக்கிறது'
                      : 'Queued'}
                  </span>
                </div>

                {/* Technical details badge when active */}
                {isProcessing && (
                  <div className="mt-2 pt-2 border-t border-emerald-800/40 text-[10px] font-mono text-emerald-300/90 flex items-center gap-1.5">
                    <Network className="w-3 h-3" />
                    <span>{stage.details}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400">
          🌱{' '}
          {lang === 'ta'
            ? 'LightET-FusionNet: EfficientNetV2B0 + SE கவனம் + ExtraTrees வகைப்படுத்தி'
            : 'LightET-FusionNet Architecture: EfficientNetV2B0 + SE Attention + ExtraTrees'}
        </div>
      </div>
    </div>
  );
}
