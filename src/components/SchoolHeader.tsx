import React from 'react';
import { SchoolProfile } from '../types/library';
import { toGujaratiNum } from '../utils/dateHelpers';
import { BookMarked, Award, MapPin } from 'lucide-react';

interface SchoolHeaderProps {
  profile: SchoolProfile;
  totalEntriesCount: number;
  activeReadingCount: number;
  onOpenIssueModal: () => void;
}

export const SchoolHeader: React.FC<SchoolHeaderProps> = ({
  profile,
  totalEntriesCount,
  activeReadingCount,
  onOpenIssueModal,
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm border border-amber-800/40 relative overflow-hidden">
      {/* Decorative background motifs */}
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-200 text-xs sm:text-sm font-medium mb-1.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              {profile.village} · તા. {profile.taluka} · જિ. {profile.district}
            </span>
            <span className="text-amber-400">·</span>
            <span>ડાયસ કોડ: {profile.diseCode}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
            {profile.name}
          </h1>

          <p className="text-amber-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            શાળા પુસ્તકાલય વાંચન પ્રવૃત્તિ અને દૈનિક પુસ્તક વિતરણ-પરત રજીસ્ટર (ધોરણ ૧ થી ૮). 
            બાળકોમાં વાચન રુચિ કેળવાય તે હેતુથી પુસ્તક નોંધણી અને પ્રગતિ ચકાસણી.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-amber-200/90">
            <span className="bg-amber-950/60 px-3 py-1 rounded-md border border-amber-700/50">
              શૈક્ષણિક વર્ષ: <strong className="text-white">{profile.academicYear}</strong>
            </span>
            <span className="bg-amber-950/60 px-3 py-1 rounded-md border border-amber-700/50">
              પ્રભારી: <strong className="text-white">{profile.librarianTeacher}</strong>
            </span>
            <span className="bg-amber-950/60 px-3 py-1 rounded-md border border-amber-700/50">
              કુલ નોંધણી: <strong className="text-white font-mono">{toGujaratiNum(totalEntriesCount)} ({totalEntriesCount})</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 text-center sm:text-right">
            <span className="text-xs text-amber-200 block">હાલ વાંચનમાં આપેલ</span>
            <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
              {toGujaratiNum(activeReadingCount)}
              <span className="text-xs font-normal text-amber-200 ml-1">પુસ્તકો</span>
            </span>
          </div>

          <button
            onClick={onOpenIssueModal}
            className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-sm"
          >
            <BookMarked className="w-4 h-4" />
            <span>નવું પુસ્તક આપો</span>
          </button>
        </div>
      </div>
    </div>
  );
};
