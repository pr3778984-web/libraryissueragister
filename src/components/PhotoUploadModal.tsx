import React, { useState, useRef } from 'react';
import { Student } from '../types/library';
import { compressImageFile, getStudentDefaultAvatar } from '../utils/photoHelpers';
import { toGujaratiNum } from '../utils/dateHelpers';
import { X, Camera, Upload, Check, RefreshCw } from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onSavePhoto: (studentId: string, photoDataUrl: string) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  student,
  onClose,
  onSavePhoto,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !student) return null;

  const currentPhoto =
    preview ||
    student.photoUrl ||
    getStudentDefaultAvatar(student.name, student.rollNo, student.standard);

  const handleFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const compressed = await compressImageFile(file, 280, 0.85);
      setPreview(compressed);
    } catch (err) {
      alert('ફોટો વાંચવામાં ક્ષતિ આવી. કૃપા કરીને બીજી છબી પસંદ કરો.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleSave = () => {
    if (preview) {
      onSavePhoto(student.id, preview);
    }
    onClose();
  };

  const handleResetToDefault = () => {
    const def = getStudentDefaultAvatar(student.name, student.rollNo, student.standard);
    setPreview(def);
    onSavePhoto(student.id, def);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-left">
            <h3 className="text-base font-bold text-slate-900">
              બાળકનો ફોટો અપલોડ કરો
            </h3>
            <p className="text-xs text-slate-500">
              {student.name} · ધોરણ {toGujaratiNum(student.standard)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current / Preview Image */}
        <div className="my-5 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-200 shadow-md relative bg-slate-100 mb-2">
            <img
              src={currentPhoto}
              alt={student.name}
              className="w-full h-full object-cover"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                પ્રોસેસિંગ...
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            હાજરી નં: {toGujaratiNum(student.rollNo)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-4">
          {/* File Picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-semibold rounded-xl border border-amber-200 transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4 text-amber-700" />
            <span>મોબાઇલ / ગેલેરીમાંથી ફોટો પસંદ કરો</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Camera Capture */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4 text-slate-600" />
            <span>કેમેરાથી તાજો ફોટો પાડો</span>
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Footer Submit */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            title="મૂળ શાળા કાર્ટૂન અવતાર પાછો લાવો"
          >
            <RefreshCw className="w-3 h-3" />
            <span>કાર્ટૂન અવતાર</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              રદ કરો
            </button>
            <button
              onClick={handleSave}
              disabled={!preview}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 ${
                preview
                  ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>સાચવો</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
