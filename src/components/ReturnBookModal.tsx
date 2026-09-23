import React, { useState } from 'react';
import { RegisterEntry } from '../types/library';
import { getTodayDateString, formatDateGujarati, toGujaratiNum } from '../utils/dateHelpers';
import { StudentAvatar } from './StudentAvatar';
import { X, CheckCircle2, Star, Calendar, MessageSquare, BookOpen } from 'lucide-react';

interface ReturnBookModalProps {
  isOpen: boolean;
  entry: RegisterEntry | null;
  onClose: () => void;
  onConfirmReturn: (
    entryId: string,
    actualReturnDate: string,
    rating: number,
    feedback: string,
    remarks: string
  ) => void;
}

export const ReturnBookModal: React.FC<ReturnBookModalProps> = ({
  isOpen,
  entry,
  onClose,
  onConfirmReturn,
}) => {
  if (!isOpen || !entry) return null;

  const [returnDate, setReturnDate] = useState<string>(getTodayDateString());
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [remarks, setRemarks] = useState<string>(entry.remarks || '');

  const quickFeedbackOptions = [
    'વાર્તા ખૂબ જ ગમી, ઘણું શીખવા મળ્યું.',
    'સચ્ચાઈ અને પ્રામાણિકતાનો બોધ મળ્યો.',
    'ચિત્રો સુંદર હતા, વાચન મનોરંજક રહ્યું.',
    'વર્ગખંડમાં મિત્રોને વાર્તા કહી સંભળાવી.',
    'વિજ્ઞાનના અવનવા પ્રયોગો રસપ્રદ લાગ્યા.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReturn(entry.id, returnDate, rating, feedback.trim(), remarks.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-50/70 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                પુસ્તક પરત મેળવ્યાની નોંધ (Book Return)
              </h2>
              <p className="text-xs text-slate-500">
                વાંચન પૂર્ણતા અને પ્રતિભાવ નોંધણી
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Card Info of the Current Issue */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <StudentAvatar
                  photoUrl={entry.studentPhoto}
                  name={entry.studentName}
                  rollNo={entry.rollNo}
                  standard={entry.standard}
                  size="md"
                />
                <div>
                  <span className="text-xs text-slate-500">વિદ્યાર્થી:</span>
                  <div className="font-bold text-slate-900 text-base">
                    {entry.studentName}
                  </div>
                  <div className="text-xs text-slate-600">
                    ધોરણ {toGujaratiNum(entry.standard)} · હાજરી નં: {toGujaratiNum(entry.rollNo)}
                  </div>
                </div>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                રજીસ્ટર નં: {toGujaratiNum(entry.srNo)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs text-slate-700">
              <div className="font-medium text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>{entry.bookTitle}</span>
              </div>
              <div className="text-slate-500 mt-0.5">
                પુસ્તક ક્રમ: {entry.bookNo} · આપ્યા તારીખ: {formatDateGujarati(entry.issueDate)}
              </div>
            </div>
          </div>

          {/* કઈ તારીખે પરત આપ્યું (Actual Return Date) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>કઈ તારીખે પરત મેળવ્યું (પરત તારીખ) <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-mono"
              required
            />
          </div>

          {/* બાળકનું રેટિંગ (Star Rating 1-5) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              વાંચન અનુભવ / બાળકનું રેટિંગ (તારા):
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-500 font-medium ml-2">
                {rating === 5 ? 'ખૂબ જ ઉત્તમ ⭐⭐⭐⭐⭐' : `${rating} તારા`}
              </span>
            </div>
          </div>

          {/* બાળકે શું વાંચ્યું / પ્રતિભાવ (Feedback) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>બાળકનો પ્રતિભાવ / શું શીખવા મળ્યું? (Feedback)</span>
            </label>
            <textarea
              rows={2}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="બાળકે પુસ્તકમાંથી શું શીખ્યા તે ટૂંકમાં લખો..."
              className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {quickFeedbackOptions.map((opt, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFeedback(opt)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* શિક્ષકની વિશેષ નોંધ */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              શિક્ષકની નોંધ / મૂલ્યાંકન
            </label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="દા.ત. સરસ સમજૂતી આપી, વાચન ગતિ સારી છે"
              className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>પરત નોંધ સાચવો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
