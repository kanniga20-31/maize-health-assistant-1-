import { AnalysisResult, Language } from '../types';
import { getDiseaseById } from '../data/diseases';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private onStateChangeListeners: ((isSpeaking: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (isSpeaking: boolean) => void): () => void {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onStateChangeListeners.forEach((fn) => fn(speaking));
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
    }
  }

  public speakAnalysis(result: AnalysisResult, lang: Language): void {
    if (!this.synth) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    this.stop();

    const disease = getDiseaseById(result.diseaseId);
    let speechText = '';

    if (lang === 'ta') {
      const severityMap: Record<string, string> = {
        healthy: 'ஆரோக்கியமானது',
        mild: 'குறைவான பாதிப்பு',
        moderate: 'நடுத்தர பாதிப்பு',
        severe: 'அதிக தீவிர பாதிப்பு',
      };
      const sevText = severityMap[result.severity] || result.severity;

      if (result.diseaseId === 'healthy') {
        speechText = `பயிர்: மக்காச்சோளம். உங்கள் மக்காச்சோள இலை மிகவும் ஆரோக்கியமாக உள்ளது. எந்தவித நோய் புள்ளிகளும் இல்லை. வழக்கமான சமச்சீர் உரம் மற்றும் பாசனத்தை தொடருங்கள்.`;
      } else {
        const organicStep = disease?.organicTreatmentTa.steps[0] || 'வேப்ப எண்ணெய் அல்லது சூடோமோனாஸ் தெளிக்கவும்.';
        const chemicalStep = disease?.chemicalTreatmentTa.steps[2] || disease?.chemicalTreatmentTa.steps[0] || '';

        speechText = `கண்டறியப்பட்ட நோய் ${result.diseaseNameTa}. சிறப்பம்சமாகக் காட்டப்பட்ட பகுதிகள் இலையில் நோய் உள்ள இடங்களை துல்லியமாக காட்டுகின்றன. பாதிக்கப்பட்ட பகுதி சுமார் நூற்றுக்கு ${result.affectedAreaPercentage} சதவீதம். நோயின் தீவிரம் ${sevText}.
பரிந்துரைக்கப்படும் இயற்கை சிகிச்சை: ${organicStep}.
ரசாயன மேலாண்மை: ${chemicalStep}.
எச்சரிக்கை: ரசாயன மருந்துகளை தெளிக்கும் முன் உங்கள் பகுதி வேளாண்மை அலுவலரின் ஆலோசனையை பெறவும்.`;
      }
    } else {
      // English
      if (result.diseaseId === 'healthy') {
        speechText = `Crop: Maize. The analysis indicates your maize leaf is healthy with vibrant green foliage. No visible fungal lesions or rust pustules detected. Continue routine inspection and balanced irrigation.`;
      } else {
        const organicStep = disease?.organicTreatmentEn.steps[0] || 'Apply neem oil or bio-fungicides.';
        const chemicalStep = disease?.chemicalTreatmentEn.steps[2] || disease?.chemicalTreatmentEn.steps[0] || '';

        speechText = `The detected disease is ${result.diseaseNameEn}. The highlighted areas show where the disease was detected on the leaf. The affected area is approximately ${result.affectedAreaPercentage} percent. The severity is ${result.severity}.
Recommended organic treatment: ${organicStep}.
Recommended fertilizer and chemical management: ${chemicalStep}.
Important reminder: Please follow product labels and consult a local agricultural expert for correct dosage and product selection.`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = lang === 'ta' ? 0.9 : 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Pick a matching voice if present
    const voices = this.synth.getVoices();
    if (lang === 'ta') {
      const tamilVoice = voices.find((v) => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'));
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
    } else {
      const englishVoice = voices.find((v) => v.lang.startsWith('en') && !v.name.includes('Google UK'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    utterance.onstart = () => this.notify(true);
    utterance.onend = () => this.notify(false);
    utterance.onerror = () => this.notify(false);

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }
}

export const speechService = new SpeechService();
