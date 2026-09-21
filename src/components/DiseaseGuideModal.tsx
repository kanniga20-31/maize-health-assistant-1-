import { useState } from 'react';
import { MAIZE_DISEASES } from '../data/diseases';
import { DiseaseInfo, Language } from '../types';
import {
  X,
  Search,
  BookOpen,
  Sprout,
  FlaskConical,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';

interface DiseaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialSelectedId?: string;
}

export function DiseaseGuideModal({
  isOpen,
  onClose,
  lang,
  initialSelectedId,
}: DiseaseGuideModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'base_paper' | 'extended'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(initialSelectedId || 'blight');

  if (!isOpen) return null;

  const filteredDiseases = MAIZE_DISEASES.filter((d) => {
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    const nameMatch =
      d.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nameTa.includes(searchTerm) ||
      d.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && nameMatch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'ta' ? 'மக்காச்சோள பயிர் நோய் வழிகாட்டி' : 'Maize Crop Disease Guide'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ta'
                  ? 'அறிகுறிகள், இயற்கை மற்றும் ரசாயன சிகிச்சைகள்'
                  : 'Identification, visual symptoms, and organic/chemical treatments'}
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

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-100/70 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                lang === 'ta'
                  ? 'நோய் பெயர் அல்லது அறிகுறி தேடவும்...'
                  : 'Search by disease name, symptom, or pathogen...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {lang === 'ta' ? 'அனைத்தும் (9 நோய்கள்)' : 'All Diseases (9 Classes)'}
            </button>

            <button
              type="button"
              onClick={() => setCategoryFilter('base_paper')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'base_paper'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              🔬 {lang === 'ta' ? 'ஆய்வு கட்டுரை வகுப்புகள் (4)' : 'Base Research Classes (4)'}
            </button>

            <button
              type="button"
              onClick={() => setCategoryFilter('extended')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'extended'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              🌿 {lang === 'ta' ? 'கூடுதல் நோய்கள் (5)' : 'Extended Classes (5)'}
            </button>
          </div>
        </div>

        {/* Diseases List */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {filteredDiseases.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-base font-semibold">
                {lang === 'ta' ? 'பொருத்தமான நோய்கள் எதுவும் கிடைக்கவில்லை' : 'No matching diseases found.'}
              </p>
            </div>
          ) : (
            filteredDiseases.map((d) => {
              const isExpanded = expandedId === d.id;
              const isBaseClass = d.category === 'base_paper';

              return (
                <div
                  key={d.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-emerald-500/60 shadow-md bg-white dark:bg-slate-850'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Collapsible Card Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : d.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            isBaseClass
                              ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                              : 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                          }`}
                        >
                          {isBaseClass
                            ? lang === 'ta'
                              ? 'ஆய்வு கட்டுரை வகை'
                              : 'Base LightET-FusionNet Class'
                            : lang === 'ta'
                            ? 'கூடுதல் வகை'
                            : 'Extended Model Class'}
                        </span>
                        {d.id === 'healthy' && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                            {lang === 'ta' ? 'ஆரோக்கியமானது' : 'Healthy'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1.5">
                        {lang === 'ta' ? d.nameTa : d.nameEn}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        {d.scientificName}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {lang === 'ta' ? d.shortDescTa : d.shortDescEn}
                      </p>
                    </div>

                    <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Disease Detail Body */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                      {/* Symptoms */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                          🔍 {lang === 'ta' ? 'முக்கிய அறிகுறிகள்:' : 'Key Field Symptoms:'}
                        </h4>
                        <ul className="space-y-1.5">
                          {(lang === 'ta' ? d.symptomsTa : d.symptomsEn).map((sym, i) => (
                            <li
                              key={i}
                              className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                            >
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Visual Characteristics */}
                      <div className="p-3 bg-white dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-750 text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {lang === 'ta' ? '🔬 காட்சி தோற்றம்:' : '🔬 Visual Characteristics:'}
                        </span>{' '}
                        <span className="text-slate-600 dark:text-slate-300">
                          {lang === 'ta' ? d.visualCharacteristicsTa : d.visualCharacteristicsEn}
                        </span>
                      </div>

                      {/* Organic Treatment */}
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                        <h4 className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 mb-2">
                          <Sprout className="w-4 h-4 text-emerald-600" />
                          <span>
                            {lang === 'ta'
                              ? `1. இயற்கை மேலாண்மை: ${d.organicTreatmentTa.title}`
                              : `1. Organic Method: ${d.organicTreatmentEn.title}`}
                          </span>
                        </h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          {(lang === 'ta' ? d.organicTreatmentTa.steps : d.organicTreatmentEn.steps).map(
                            (st, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">{i + 1}.</span>
                                <span>{st}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Chemical Treatment */}
                      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40">
                        <h4 className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-2">
                          <FlaskConical className="w-4 h-4 text-indigo-600" />
                          <span>
                            {lang === 'ta'
                              ? `2. உர மற்றும் ரசாயன முறை: ${d.chemicalTreatmentTa.title}`
                              : `2. Chemical/Fertilizer: ${d.chemicalTreatmentEn.title}`}
                          </span>
                        </h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          {(lang === 'ta' ? d.chemicalTreatmentTa.steps : d.chemicalTreatmentEn.steps).map(
                            (st, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">{i + 1}.</span>
                                <span>{st}</span>
                              </li>
                            )
                          )}
                        </ul>

                        <div className="mt-2.5 p-2 bg-amber-100/70 dark:bg-amber-950/50 rounded-lg text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2 border border-amber-300 dark:border-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            {lang === 'ta' ? d.chemicalTreatmentTa.warning : d.chemicalTreatmentEn.warning}
                          </span>
                        </div>
                      </div>

                      {/* Prevention */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{lang === 'ta' ? 'தடுப்பு நடவடிக்கைகள்:' : 'Prevention Tips:'}</span>
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                          {(lang === 'ta' ? d.preventionTa : d.preventionEn).map((prev, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span>✓</span>
                              <span>{prev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
