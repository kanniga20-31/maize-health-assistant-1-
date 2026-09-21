import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Camera, SwitchCamera, X, Flashlight, AlertCircle, Upload } from 'lucide-react';
import { Language, AnalysisMode } from '../types';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUri: string) => void;
  lang: Language;
  mode: AnalysisMode;
}

export function CameraCapture({ isOpen, onClose, onCapture, lang, mode }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [supportsTorch, setSupportsTorch] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setHasPermission(true);

      // Check torch support
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as { torch?: boolean } | undefined;
      setSupportsTorch(Boolean(capabilities?.torch));
    } catch (err: unknown) {
      console.warn('Direct camera stream error, offering gallery/file fallback:', err);
      setHasPermission(false);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setErrorMessage(
        lang === 'ta'
          ? 'கேமரா அனுமதி கிடைக்கவில்லை. உங்கள் தொலைபேசி கேமரா அல்லது படக்கோப்பைப் பயன்படுத்தவும்.'
          : 'Camera stream unavailable in this browser frame. Use native camera capture button below.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setTorchOn(false);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      const trackWithConstraints = track as MediaStreamTrack & {
        applyConstraints: (c: unknown) => Promise<void>;
      };
      await trackWithConstraints.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn(!torchOn);
    } catch (e) {
      console.error('Torch toggle failed', e);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL('image/jpeg', 0.88);
    stopCamera();
    onCapture(dataUri);
  };

  const handleNativeFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        stopCamera();
        onCapture(dataUri);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div id="camera-modal" className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
        <button
          type="button"
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white backdrop-blur-md transition-all"
          aria-label="Close camera"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
          {mode === 'full_plant'
            ? lang === 'ta'
              ? 'முழு செடி பார்வை'
              : 'Full Plant Canopy Mode'
            : lang === 'ta'
            ? 'இலை பார்வை'
            : 'Maize Leaf Close-up'}
        </div>

        <div className="flex items-center gap-2">
          {supportsTorch && (
            <button
              type="button"
              onClick={toggleTorch}
              className={`p-3 rounded-full text-white backdrop-blur-md transition-all ${
                torchOn ? 'bg-amber-500 text-black' : 'bg-white/10 hover:bg-white/20'
              }`}
              title="Torch"
            >
              <Flashlight className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleFacingMode}
            className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white backdrop-blur-md transition-all"
            title="Switch Camera"
          >
            <SwitchCamera className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {hasPermission !== false ? (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />

            {/* Target Reticle / Leaf Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              <div
                className={`w-64 h-80 sm:w-80 sm:h-96 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-between p-4 ${
                  mode === 'full_plant'
                    ? 'border-amber-400 bg-amber-500/5'
                    : 'border-emerald-400 bg-emerald-500/5'
                }`}
              >
                <div className="text-[11px] font-medium bg-black/70 px-2.5 py-1 rounded-full text-emerald-300">
                  {mode === 'full_plant'
                    ? lang === 'ta'
                      ? 'முழு செடியை மையப்படுத்தவும்'
                      : 'Frame complete plant & leaves'
                    : lang === 'ta'
                    ? 'இலையை இந்த சட்டகத்தில் வைக்கவும்'
                    : 'Fit single maize leaf in frame'}
                </div>

                <div className="w-12 h-12 border-t-2 border-l-2 border-emerald-400 self-start" />
                <div className="w-12 h-12 border-b-2 border-r-2 border-emerald-400 self-end" />
              </div>
            </div>
          </>
        ) : (
          /* Fallback when direct WebRTC stream is blocked by container or permission */
          <div className="p-6 max-w-md text-center text-white space-y-4">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {lang === 'ta' ? 'தொலைபேசி கேமராவைப் பயன்படுத்தவும்' : 'Take Photo with Phone Camera'}
            </h3>
            <p className="text-sm text-slate-300">
              {errorMessage ||
                (lang === 'ta'
                  ? 'கீழுள்ள பொத்தானை அழுத்தி உங்கள் கேமராவை நேரடியாக திறக்கவும்.'
                  : 'Tap below to open your device camera or choose from gallery.')}
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-3 transition-all"
            >
              <Camera className="w-6 h-6" />
              <span>{lang === 'ta' ? '📷 கேமராவைத் திறக்க' : '📷 Open Camera'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input with capture="environment" for Native Mobile Camera Fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleNativeFileInput}
      />

      {/* Bottom Shutter Controls */}
      <div className="p-6 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-around z-10">
        {/* Upload from file button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3.5 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white backdrop-blur-md transition-all flex flex-col items-center gap-1"
          title="Upload image"
        >
          <Upload className="w-5 h-5" />
          <span className="text-[10px] text-slate-300">
            {lang === 'ta' ? 'கேலரி' : 'Gallery'}
          </span>
        </button>

        {/* Large Primary Shutter Button */}
        <button
          type="button"
          onClick={hasPermission !== false ? capturePhoto : () => fileInputRef.current?.click()}
          className="w-20 h-20 rounded-full bg-white p-1.5 shadow-2xl active:scale-95 transition-all flex items-center justify-center focus:outline-none ring-4 ring-emerald-500/50"
          aria-label="Capture photo"
        >
          <div className="w-full h-full rounded-full border-4 border-emerald-600 bg-emerald-50 flex items-center justify-center">
            <Camera className="w-8 h-8 text-emerald-700" />
          </div>
        </button>

        {/* Retake/Cancel */}
        <button
          type="button"
          onClick={onClose}
          className="p-3.5 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white backdrop-blur-md transition-all flex flex-col items-center gap-1"
        >
          <X className="w-5 h-5" />
          <span className="text-[10px] text-slate-300">
            {lang === 'ta' ? 'ரத்து' : 'Cancel'}
          </span>
        </button>
      </div>
    </div>
  );
}
