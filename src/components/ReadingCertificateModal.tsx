import React from 'react';
import { SchoolProfile, Student } from '../types/library';
import { toGujaratiNum, formatDateGujarati, getTodayDateString } from '../utils/dateHelpers';
import { StudentAvatar } from './StudentAvatar';
import { X, Printer, Award } from 'lucide-react';

interface ReadingCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  bookCount: number;
  profile: SchoolProfile;
}

export const ReadingCertificateModal: React.FC<ReadingCertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  bookCount,
  profile,
}) => {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Top Controls */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl no-print">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              વાચન પ્રશંસા પ્રમાણપત્ર (Reading Certificate)
            </h3>
            <p className="text-xs text-slate-500">
              બાળકને પ્રોત્સાહિત કરવા રંગીન પ્રિન્ટ કાઢો
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>પ્રિન્ટ પ્રમાણપત્ર</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-amber-50/40 text-black font-sans">
          <div className="border-8 border-double border-amber-800 p-8 rounded-xl bg-white text-center relative shadow-sm">
            {/* Child Photo & Corner Emblems */}
            <div className="flex flex-col items-center justify-center mb-3">
              <div className="relative mb-2">
                <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-amber-600 shadow-md bg-amber-50">
                  <StudentAvatar
                    photoUrl={student.photoUrl}
                    name={student.name}
                    rollNo={student.rollNo}
                    standard={student.standard}
                    size="xl"
                  />
                </div>
                <div className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center absolute -bottom-1 -right-1 shadow-xs border-2 border-white">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="text-xs uppercase tracking-widest text-amber-900 font-bold mb-1">
              શાળા પુસ્તકાલય વાચન ઉત્સવ
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-amber-950 mb-1">
              {profile.name}
            </h1>
            <p className="text-xs text-slate-600 mb-6">
              તાલુકો: {profile.taluka}, જિલ્લો: {profile.district} (ગુજરાત)
            </p>

            <div className="inline-block bg-amber-800 text-white font-bold text-sm px-6 py-1.5 rounded-full mb-6">
              વાચન પ્રશંસા પ્રમાણપત્ર
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-slate-800 max-w-xl mx-auto mb-6">
              પ્રમાણિત કરવામાં આવે છે કે કુમાર / કન્યા શ્રી{' '}
              <strong className="text-amber-950 text-lg sm:text-xl border-b-2 border-amber-800 px-2 font-bold inline-block">
                {student.name}
              </strong>
              , ધોરણ{' '}
              <strong className="font-bold text-amber-950">
                {toGujaratiNum(student.standard)}
              </strong>{' '}
              (હાજરી નં: <strong className="font-mono">{toGujaratiNum(student.rollNo)}</strong>) એ
              શાળા પુસ્તકાલયમાંથી ઉત્સાહપૂર્વક{' '}
              <strong className="font-bold text-amber-950 text-base">
                {toGujaratiNum(bookCount || student.totalBooksRead)} પુસ્તકો
              </strong>{' '}
              વાંચીને વાચન પ્રવૃત્તિમાં ઉત્કૃષ્ટ રસ દાખવેલ છે. બાળકના ઉજ્જવળ ભવિષ્ય માટે શુભેચ્છાઓ!
            </p>

            <div className="text-xs text-slate-600 mb-10">
              તારીખ: {formatDateGujarati(getTodayDateString())} · શૈક્ષણિક વર્ષ: {profile.academicYear}
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-6 border-t border-slate-200 text-xs font-bold text-slate-900">
              <div className="text-center">
                <div className="w-32 border-b border-black mb-1 mx-auto" />
                <span>પુસ્તકાલય પ્રભારી</span>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-black mb-1 mx-auto" />
                <span>વર્ગશિક્ષક</span>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-black mb-1 mx-auto" />
                <span>મુખ્ય શિક્ષક / આચાર્ય</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
