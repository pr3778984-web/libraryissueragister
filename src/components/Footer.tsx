import React, { useRef } from 'react';
import { SchoolProfile, RegisterEntry, Book, Student } from '../types/library';
import { exportBackupJSON } from '../utils/storage';
import { Download, Upload, ShieldCheck, BookOpen } from 'lucide-react';

interface FooterProps {
  profile: SchoolProfile;
  entries: RegisterEntry[];
  books: Book[];
  students: Student[];
  onRestoreData: (backup: {
    profile?: SchoolProfile;
    entries?: RegisterEntry[];
    books?: Book[];
    students?: Student[];
  }) => void;
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  entries,
  books,
  students,
  onRestoreData,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    exportBackupJSON(profile, entries, books, students);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.entries && json.books) {
          onRestoreData(json);
          alert('ડેટા સફળતાપૂર્વક રિસ્ટોર કરવામાં આવ્યો છે!');
        } else {
          alert('અમાન્ય બેકઅપ ફાઇલ!');
        }
      } catch (err) {
        alert('ફાઇલ વાંચવામાં ક્ષતિ આવી.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>
            {profile.name} · તાલુકો {profile.taluka}, જિલ્લો {profile.district} (ગુજરાત)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 text-slate-600 hover:text-amber-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>બેકઅપ ડાઉનલોડ (JSON)</span>
          </button>

          <label className="flex items-center gap-1.5 text-slate-600 hover:text-amber-800 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>બેકઅપ પુનઃસ્થાપિત કરો (Restore)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={onResetData}
            className="text-slate-400 hover:text-rose-600 transition-colors"
          >
            મૂળ ડેટા રીસેટ કરો
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>શિક્ષણ વિભાગ · પ્રાથમિક શાળા પુસ્તકાલય વ્યવસ્થાપન</span>
        </div>
      </div>
    </footer>
  );
};
