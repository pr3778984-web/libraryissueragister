import React, { useState } from 'react';
import { RegisterEntry, Standard, BookStatus } from '../types/library';
import { toGujaratiNum } from '../utils/dateHelpers';
import { X, Save, Edit3 } from 'lucide-react';

interface EditEntryModalProps {
  isOpen: boolean;
  entry: RegisterEntry | null;
  onClose: () => void;
  onSave: (updated: RegisterEntry) => void;
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({
  isOpen,
  entry,
  onClose,
  onSave,
}) => {
  if (!isOpen || !entry) return null;

  const [studentName, setStudentName] = useState(entry.studentName);
  const [standard, setStandard] = useState<Standard>(entry.standard);
  const [rollNo, setRollNo] = useState<number>(entry.rollNo);
  const [bookTitle, setBookTitle] = useState(entry.bookTitle);
  const [bookNo, setBookNo] = useState(entry.bookNo);
  const [category, setCategory] = useState(entry.category);
  const [issueDate, setIssueDate] = useState(entry.issueDate);
  const [expectedReturnDate, setExpectedReturnDate] = useState(entry.expectedReturnDate);
  const [actualReturnDate, setActualReturnDate] = useState(entry.actualReturnDate || '');
  const [status, setStatus] = useState<BookStatus>(entry.status);
  const [rating, setRating] = useState<number>(entry.rating || 5);
  const [feedback, setFeedback] = useState<string>(entry.feedback || '');
  const [remarks, setRemarks] = useState<string>(entry.remarks || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...entry,
      studentName: studentName.trim(),
      standard,
      rollNo: Number(rollNo) || 1,
      bookTitle: bookTitle.trim(),
      bookNo: bookNo.trim(),
      category: category.trim(),
      issueDate,
      expectedReturnDate,
      actualReturnDate: actualReturnDate ? actualReturnDate : undefined,
      status,
      rating: status === 'returned' ? rating : undefined,
      feedback: status === 'returned' ? feedback.trim() : undefined,
      remarks: remarks.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-amber-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              નોંધણી સુધારો (Edit Register Entry #{toGujaratiNum(entry.srNo)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                વિદ્યાર્થીનું નામ
              </label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ધોરણ (Standard)
              </label>
              <select
                value={standard}
                onChange={e => setStandard(e.target.value as Standard)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
              >
                {(['1', '2', '3', '4', '5', '6', '7', '8'] as Standard[]).map(s => (
                  <option key={s} value={s}>
                    ધોરણ {toGujaratiNum(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                પુસ્તકનું નામ
              </label>
              <input
                type="text"
                value={bookTitle}
                onChange={e => setBookTitle(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                પુસ્તક ક્રમાંક
              </label>
              <input
                type="text"
                value={bookNo}
                onChange={e => setBookNo(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                આપ્યા તારીખ (Issue Date)
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                પરત કરવાની તારીખ (Due Date)
              </label>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={e => setExpectedReturnDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                વાંચન સ્થિતિ (Status)
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as BookStatus)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
              >
                <option value="reading">વાંચનમાં આપેલ (Reading)</option>
                <option value="returned">પરત મેળવેલ (Returned)</option>
                <option value="overdue">મુદત વીતી ગઈ (Overdue)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                પરત મળ્યા તારીખ (જો પરત હોય તો)
              </label>
              <input
                type="date"
                value={actualReturnDate}
                onChange={e => setActualReturnDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              બાળક પ્રતિભાવ / શીખ
            </label>
            <input
              type="text"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              શિક્ષકની નોંધ
            </label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>સુધારો સાચવો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
