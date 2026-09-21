import { Language } from '../types';
import { Sprout, Clock, BookOpen, Cpu, Languages } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onOpenModelArchitecture: () => void;
  isRealModelConnected: boolean;
  historyCount: number;
}

export function Navbar({
  lang,
  onLanguageChange,
  onOpenHistory,
  onOpenGuide,
  onOpenModelArchitecture,
  isRealModelConnected,
  historyCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            🌱
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
              {lang === 'ta' ? 'மக்காச்சோள பயிர் உதவியாளர்' : 'Maize Health Assistant'}
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">LightET-FusionNet</span>
              <span>•</span>
              <span className="truncate">{lang === 'ta' ? 'நோய் கண்டறிதல் & சிகிச்சை' : 'Crop Disease AI'}</span>
            </div>
          </div>
        </div>

        {/* Right Navigation & Control Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* AI Model Status Badge (Clickable to inspect pipeline/API) */}
          <button
            type="button"
            onClick={onOpenModelArchitecture}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            title="Inspect Multimodal Vision AI integration status"
          >
            <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {isRealModelConnected
                ? 'Vision AI: Live'
                : lang === 'ta'
                ? 'விஷன் AI: ஆஃப்லைன்'
                : 'Vision AI: Local Fallback'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isRealModelConnected ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Disease Guide Button */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">
              {lang === 'ta' ? 'நோய் வழிகாட்டி' : 'Disease Guide'}
            </span>
          </button>

          {/* Scan History Button with Count Pill */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">
              {lang === 'ta' ? 'வரலாறு' : 'History'}
            </span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Bilingual Language Selector Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lang === 'en'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('ta')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lang === 'ta'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
