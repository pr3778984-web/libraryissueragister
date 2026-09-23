import React, { useState, useEffect } from 'react';
import { Book, RegisterEntry, Standard, Student } from '../types/library';
import { addDaysToDate, getTodayDateString, toGujaratiNum } from '../utils/dateHelpers';
import { getStudentDefaultAvatar } from '../utils/photoHelpers';
import { StudentAvatar } from './StudentAvatar';
import { X, BookOpen, User, Calendar, BookmarkCheck, Plus } from 'lucide-react';

interface IssueBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveIssue: (entry: Omit<RegisterEntry, 'id' | 'srNo'>) => void;
  students: Student[];
  books: Book[];
  defaultStandard?: Standard | 'all';
}

export const IssueBookModal: React.FC<IssueBookModalProps> = ({
  isOpen,
  onClose,
  onSaveIssue,
  students,
  books,
  defaultStandard = '1',
}) => {
  const initialStd = defaultStandard === 'all' ? '1' : defaultStandard;

  const [standard, setStandard] = useState<Standard>(initialStd as Standard);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [customStudentName, setCustomStudentName] = useState<string>('');
  const [customRollNo, setCustomRollNo] = useState<number>(1);
  const [isCustomStudent, setIsCustomStudent] = useState<boolean>(false);

  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [customBookTitle, setCustomBookTitle] = useState<string>('');
  const [customBookNo, setCustomBookNo] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('વાર્તા');
  const [isCustomBook, setIsCustomBook] = useState<boolean>(false);

  const [issueDate, setIssueDate] = useState<string>(getTodayDateString());
  const [expectedReturnDate, setExpectedReturnDate] = useState<string>(
    addDaysToDate(getTodayDateString(), 7)
  );
  const [remarks, setRemarks] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('વર્ગશિક્ષક');

  // Filter students for the selected standard
  const filteredStudents = students.filter(s => s.standard === standard);

  // Update selection when standard changes
  useEffect(() => {
    if (!isCustomStudent) {
      const match = students.find(s => s.standard === standard);
      setSelectedStudentId(match ? match.id : '');
    }
  }, [standard, students, isCustomStudent]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let studentName = '';
    let rollNo = 1;
    let studentId = '';
    let studentPhoto: string | undefined = undefined;

    if (isCustomStudent || !selectedStudentId) {
      if (!customStudentName.trim()) {
        alert('કૃપા કરીને બાળકનું નામ દાખલ કરો.');
        return;
      }
      studentName = customStudentName.trim();
      rollNo = Number(customRollNo) || 1;
      studentId = `custom-student-${Date.now()}`;
      studentPhoto = getStudentDefaultAvatar(studentName, rollNo, standard);
    } else {
      const st = students.find(s => s.id === selectedStudentId);
      if (st) {
        studentName = st.name;
        rollNo = st.rollNo;
        studentId = st.id;
        studentPhoto = st.photoUrl || getStudentDefaultAvatar(st.name, st.rollNo, st.standard);
      }
    }

    let bookTitle = '';
    let bookNo = '';
    let category = '';
    let bookId = '';

    if (isCustomBook || !selectedBookId) {
      if (!customBookTitle.trim()) {
        alert('કૃપા કરીને પુસ્તકનું નામ દાખલ કરો.');
        return;
      }
      bookTitle = customBookTitle.trim();
      bookNo = customBookNo.trim() || `PUSTAK-${Math.floor(100 + Math.random() * 900)}`;
      category = customCategory || 'સામાન્ય વાંચન';
      bookId = `custom-book-${Date.now()}`;
    } else {
      const bk = books.find(b => b.id === selectedBookId);
      if (bk) {
        bookTitle = bk.title;
        bookNo = bk.bookNo;
        category = bk.category;
        bookId = bk.id;
      }
    }

    if (!issueDate) {
      alert('કૃપા કરીને આપ્યા તારીખ પસંદ કરો.');
      return;
    }

    if (!expectedReturnDate) {
      alert('કૃપા કરીને પરત આપવાની તારીખ પસંદ કરો.');
      return;
    }

    onSaveIssue({
      studentId,
      studentName,
      studentPhoto,
      standard,
      rollNo,
      bookId,
      bookNo,
      bookTitle,
      category,
      issueDate,
      expectedReturnDate,
      status: 'reading',
      remarks: remarks.trim(),
      issuedByTeacher: teacherName.trim(),
    });

    onClose();
  };

  const setDuration = (days: number) => {
    setExpectedReturnDate(addDaysToDate(issueDate, days));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-amber-50/60 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                નવું પુસ્તક વિતરણ નોંધણી (Book Issue)
              </h2>
              <p className="text-xs text-slate-500">
                ધારિયા પ્રાથમિક શાળા · વિદ્યાર્થી વાચન રજીસ્ટર
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
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* ધોરણ પસંદગી (Standards 1 to 8) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ૧. ધોરણ પસંદ કરો <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {(['1', '2', '3', '4', '5', '6', '7', '8'] as Standard[]).map(std => (
                <button
                  type="button"
                  key={std}
                  onClick={() => setStandard(std)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all text-center ${
                    standard === std
                      ? 'bg-amber-700 border-amber-700 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ધોરણ {toGujaratiNum(std)}
                </button>
              ))}
            </div>
          </div>

          {/* બાળક / વિદ્યાર્થીનું નામ (Student Selection) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-700" />
                <span>૨. બાળકનું નામ (વિદ્યાર્થી) <span className="text-rose-500">*</span></span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomStudent(!isCustomStudent)}
                className="text-xs text-amber-800 hover:underline font-medium"
              >
                {isCustomStudent ? 'યાદીમાંથી પસંદ કરો' : '+ નવો વિદ્યાર્થી ટાઈપ કરો'}
              </button>
            </div>

            {!isCustomStudent ? (
              <div>
                <div className="flex items-center gap-3">
                  {selectedStudentId && (() => {
                    const st = students.find(s => s.id === selectedStudentId);
                    return st ? (
                      <StudentAvatar
                        photoUrl={st.photoUrl}
                        name={st.name}
                        rollNo={st.rollNo}
                        standard={st.standard}
                        size="md"
                      />
                    ) : null;
                  })()}
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="flex-1 text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  >
                    {filteredStudents.length === 0 && (
                      <option value="">આ ધોરણમાં વિદ્યાર્થી ઉપલબ્ધ નથી</option>
                    )}
                    {filteredStudents.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} (હાજરી નં. {student.rollNo})
                      </option>
                    ))}
                  </select>
                </div>
                {filteredStudents.length === 0 && (
                  <p className="text-[11px] text-amber-700 mt-1">
                    * આ ધોરણ માટે વિદ્યાર્થી યાદીમાં નથી, કૃપા કરીને ઉપર "નવો વિદ્યાર્થી ટાઈપ કરો" પર ક્લિક કરો.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="બાળકનું પૂરું નામ લખો..."
                    value={customStudentName}
                    onChange={e => setCustomStudentName(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    placeholder="હાજરી નં."
                    value={customRollNo}
                    onChange={e => setCustomRollNo(Number(e.target.value))}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* પુસ્તક વિગત (Book Selection) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-amber-700" />
                <span>૩. પુસ્તક પસંદ કરો <span className="text-rose-500">*</span></span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomBook(!isCustomBook)}
                className="text-xs text-amber-800 hover:underline font-medium"
              >
                {isCustomBook ? 'ભંડારમાંથી પસંદ કરો' : '+ અન્ય પુસ્તક લખો'}
              </button>
            </div>

            {!isCustomBook ? (
              <select
                value={selectedBookId}
                onChange={e => setSelectedBookId(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
              >
                <option value="">-- પુસ્તક પસંદ કરો --</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.bookNo} · {book.category})
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="પુસ્તકનું નામ..."
                  value={customBookTitle}
                  onChange={e => setCustomBookTitle(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="પુસ્તક ક્રમાંક (દા.ત. PUSTAK-115)"
                    value={customBookNo}
                    onChange={e => setCustomBookNo(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="શ્રેણી (વાર્તા, વિજ્ઞાન, જીવનચરિત્ર)"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* કઈ તારીખે આપ્યું અને કઈ તારીખે પરત લેશે (Dates) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* આપ્યા તારીખ */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>કઈ તારીખે આપ્યું (આપ્યા તારીખ) <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={e => {
                  setIssueDate(e.target.value);
                  setExpectedReturnDate(addDaysToDate(e.target.value, 7));
                }}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none font-mono"
                required
              />
            </div>

            {/* પરત કરવાની તારીખ */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>કઈ તારીખે પરત લેવું (અપેક્ષિત તારીખ) <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={e => setExpectedReturnDate(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none font-mono"
                required
              />
              {/* Quick preset buttons */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[10px] text-slate-400">ઝડપી પસંદગી:</span>
                <button
                  type="button"
                  onClick={() => setDuration(3)}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                >
                  +૩ દિવસ
                </button>
                <button
                  type="button"
                  onClick={() => setDuration(7)}
                  className="text-[11px] px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-medium"
                >
                  +૭ દિવસ (નિયમિત)
                </button>
                <button
                  type="button"
                  onClick={() => setDuration(15)}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                >
                  +૧૫ દિવસ
                </button>
              </div>
            </div>
          </div>

          {/* વિશેષ નોંધ / શિક્ષક */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                વિશેષ નોંધ (વૈકલ્પિક)
              </label>
              <input
                type="text"
                placeholder="દા.ત. પ્રાર્થનાસભામાં વાંચન કરશે"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                પુસ્તક આપનાર શિક્ષક
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
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
              className="px-5 py-2 text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>નોંધણી સાચવો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
