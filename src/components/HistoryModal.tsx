import { AnalysisResult, Language } from '../types';
import { clearScanHistory } from '../services/historyService';
import { X, Clock, Trash2, ChevronRight, AlertOctagon, ShieldCheck, AlertTriangle } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  onHistoryCleared: () => void;
  lang: Language;
}

export function HistoryModal({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onHistoryCleared,
  lang,
}: HistoryModalProps) {
  if (!isOpen) return null;

  const handleClear = () => {
    if (
      confirm(
        lang === 'ta'
          ? 'முந்தைய அனைத்து ஸ்கேன் பதிவுகளையும் அழிக்க விரும்புகிறீர்களா?'
          : 'Are you sure you want to clear all previous scan records?'
      )
    ) {
      clearScanHistory();
      onHistoryCleared();
    }
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'ta' ? 'முந்தைய ஸ்கேன் வரலாறு' : 'Previous Scan History'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} {lang === 'ta' ? 'பதிவுகள் உள்ளன' : 'saved plant records'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-xs font-semibold flex items-center gap-1"
                title="Clear history"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'ta' ? 'அழி' : 'Clear'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Clock className="w-10 h-10 mx-auto opacity-40" />
              <p className="font-semibold text-sm">
                {lang === 'ta' ? 'ஸ்கேன் வரலாறு எதுவும் இல்லை' : 'No previous scan records yet.'}
              </p>
              <p className="text-xs">
                {lang === 'ta'
                  ? 'கேமரா அல்லது கேலரி மூலம் இலையை ஸ்கேன் செய்யவும்.'
                  : 'Scan a leaf with the camera or upload an image to save records.'}
              </p>
            </div>
          ) : (
            history.map((item) => {
              const isHealthy = item.diseaseId === 'healthy';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className="group cursor-pointer p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-slate-850 hover:shadow-md transition-all flex items-center gap-3 sm:gap-4"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-750">
                    <img
                      src={item.imageUrl}
                      alt={item.diseaseNameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">
                        📅 {formatTimestamp(item.timestamp)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                          isHealthy
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
                      {lang === 'ta' ? item.diseaseNameTa : item.diseaseNameEn}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.confidence}% {lang === 'ta' ? 'நம்பகத்தன்மை' : 'conf'}
                      </span>
                      <span>•</span>
                      <span>
                        ~{item.affectedAreaPercentage}% {lang === 'ta' ? 'பாதிப்பு' : 'area'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                      💊 {lang === 'ta' ? item.recommendedActionTa : item.recommendedActionEn}
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
