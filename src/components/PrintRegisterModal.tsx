import React, { useState } from 'react';
import { RegisterEntry, SchoolProfile, Standard } from '../types/library';
import { formatDateGujarati, formatDateShort, toGujaratiNum } from '../utils/dateHelpers';
import { StudentAvatar } from './StudentAvatar';
import { X, Printer, Image as ImageIcon } from 'lucide-react';

interface PrintRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: RegisterEntry[];
  profile: SchoolProfile;
  selectedStandard: Standard | 'all';
}

export const PrintRegisterModal: React.FC<PrintRegisterModalProps> = ({
  isOpen,
  onClose,
  entries,
  profile,
  selectedStandard,
}) => {
  const [showPhotos, setShowPhotos] = useState(true);

  if (!isOpen) return null;

  const filteredEntries = selectedStandard === 'all'
    ? entries
    : entries.filter(e => e.standard === selectedStandard);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-t-2xl no-print">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              સત્તાવાર શાળા પુસ્તકાલય રજીસ્ટર (પ્રિન્ટ પૂર્વાવલોકન)
            </h3>
            <p className="text-xs text-slate-500">
              A4 સાઇઝમાં ફાઇલ કરવા માટે તૈયાર સત્તાવાર ફોર્મેટ (ફોટા સાથે)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={showPhotos}
                onChange={e => setShowPhotos(e.target.checked)}
                className="rounded text-amber-700 focus:ring-amber-500"
              />
              <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>બાળકોના ફોટા દર્શાવો</span>
            </label>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>પ્રિન્ટ કરો (Print A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-black font-sans">
          {/* School Letterhead */}
          <div className="text-center border-b-2 border-black pb-4 mb-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-0.5">
              ગુજરાત સરકાર · શિક્ષણ વિભાગ
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 mb-0.5">
              {profile.name}
            </h1>
            <div className="text-xs sm:text-sm text-slate-800">
              ગામ: {profile.village} · તાલુકો: {profile.taluka} · જિલ્લો: {profile.district} · ડાયસ કોડ: {profile.diseCode}
            </div>
            <div className="mt-2 text-sm font-bold bg-slate-100 py-1 px-4 inline-block rounded border border-slate-300">
              શાળા પુસ્તકાલય દૈનિક વાંચન અને પુસ્તક વિતરણ રજીસ્ટર (શૈક્ષણિક વર્ષ: {profile.academicYear})
            </div>
            <div className="mt-1 text-xs text-slate-600">
              {selectedStandard === 'all'
                ? 'ધોરણ ૧ થી ૮ (સમગ્ર શાળા)'
                : `ફક્ત ધોરણ: ${toGujaratiNum(selectedStandard)} ના વિદ્યાર્થીઓ માટે`}
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse text-xs print-table">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border border-black font-bold">
                <th className="p-2 border border-black text-center w-10">ક્રમ</th>
                <th className="p-2 border border-black text-center w-20">આપ્યા તારીખ</th>
                <th className="p-2 border border-black">બાળકનું નામ</th>
                <th className="p-2 border border-black text-center w-14">ધોરણ</th>
                <th className="p-2 border border-black text-center w-14">હાજરી નં.</th>
                <th className="p-2 border border-black">પુસ્તકનું નામ અને ક્રમાંક</th>
                <th className="p-2 border border-black text-center w-20">પરત આપ્યા તારીખ</th>
                <th className="p-2 border border-black text-center w-20">સ્થિતિ</th>
                <th className="p-2 border border-black">બાળકનો પ્રતિભાવ / નોંધ</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((ent, idx) => (
                <tr key={ent.id} className="border border-black">
                  <td className="p-2 border border-black text-center font-mono">
                    {toGujaratiNum(ent.srNo || idx + 1)}
                  </td>
                  <td className="p-2 border border-black text-center font-mono">
                    {formatDateShort(ent.issueDate)}
                  </td>
                  <td className="p-2 border border-black font-semibold">
                    <div className="flex items-center gap-2">
                      {showPhotos && (
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-slate-300">
                          <img
                            src={ent.studentPhoto || ''}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span>{ent.studentName}</span>
                    </div>
                  </td>
                  <td className="p-2 border border-black text-center">
                    ધો. {toGujaratiNum(ent.standard)}
                  </td>
                  <td className="p-2 border border-black text-center font-mono">
                    {toGujaratiNum(ent.rollNo)}
                  </td>
                  <td className="p-2 border border-black">
                    <div className="font-medium">{ent.bookTitle}</div>
                    <div className="text-[10px] text-slate-600 font-mono">({ent.bookNo})</div>
                  </td>
                  <td className="p-2 border border-black text-center font-mono">
                    {ent.actualReturnDate ? formatDateShort(ent.actualReturnDate) : 'વાંચનમાં'}
                  </td>
                  <td className="p-2 border border-black text-center font-medium">
                    {ent.status === 'returned'
                      ? 'પરત મળેલ'
                      : ent.status === 'reading'
                      ? 'વાંચનમાં'
                      : 'વિલંબિત'}
                  </td>
                  <td className="p-2 border border-black text-[11px]">
                    {ent.feedback ? `"${ent.feedback}"` : ent.remarks || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signature Block */}
          <div className="mt-12 pt-6 flex justify-between items-end text-xs font-bold text-slate-900 print-break-inside-avoid">
            <div className="text-center">
              <div className="w-40 border-b border-black mb-1.5" />
              <span>પુસ્તકાલય પ્રભારી શિક્ષકની સહી</span>
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-black mb-1.5" />
              <span>વર્ગશિક્ષકની સહી</span>
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-black mb-1.5" />
              <span>મુખ્ય શિક્ષક / આચાર્યશ્રી સહી-સિક્કો</span>
              <div className="text-[10px] text-slate-600 mt-0.5">{profile.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
