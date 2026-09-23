import React, { useState, useRef, useEffect } from 'react';
import { RegisterEntry, Standard, Student } from '../types/library';
import { toGujaratiNum, formatDateShort } from '../utils/dateHelpers';
import {
  User,
  Plus,
  Search,
  BookOpen,
  Star,
  Award,
  Camera,
  Upload,
  X,
  Trash2,
  Edit,
  AlertTriangle,
  UserCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { StudentAvatar } from './StudentAvatar';
import { PhotoUploadModal } from './PhotoUploadModal';
import { compressImageFile, getStudentDefaultAvatar } from '../utils/photoHelpers';

interface StudentDirectoryViewProps {
  students: Student[];
  entries: RegisterEntry[];
  initialStandard?: Standard | 'all';
  onAddNewStudent: (student: Omit<Student, 'id' | 'totalBooksRead'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onQuickIssueToStudent: (student: Student) => void;
  onOpenCertificate: (student: Student, bookCount: number) => void;
  onUpdateStudentPhoto: (studentId: string, photoUrl: string) => void;
}

export const StudentDirectoryView: React.FC<StudentDirectoryViewProps> = ({
  students,
  entries,
  initialStandard = 'all',
  onAddNewStudent,
  onUpdateStudent,
  onDeleteStudent,
  onQuickIssueToStudent,
  onOpenCertificate,
  onUpdateStudentPhoto,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<Standard | 'all'>(initialStandard);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [activeStudentDetail, setActiveStudentDetail] = useState<Student | null>(null);
  const [photoModalStudent, setPhotoModalStudent] = useState<Student | null>(null);

  // New Student Form state
  const [newName, setNewName] = useState('');
  const [newStd, setNewStd] = useState<Standard>('1');
  const [newRoll, setNewRoll] = useState(1);
  const [newGr, setNewGr] = useState('');
  const [newDiv, setNewDiv] = useState('અ');
  const [newPhoto, setNewPhoto] = useState<string>('');
  const [keepAddOpen, setKeepAddOpen] = useState(false);

  // Edit Student Form state
  const [editName, setEditName] = useState('');
  const [editStd, setEditStd] = useState<Standard>('1');
  const [editRoll, setEditRoll] = useState(1);
  const [editGr, setEditGr] = useState('');
  const [editDiv, setEditDiv] = useState('અ');
  const [editPhoto, setEditPhoto] = useState<string>('');

  const addPhotoInputRef = useRef<HTMLInputElement>(null);
  const editPhotoInputRef = useRef<HTMLInputElement>(null);

  // Update initial standard if prop changes
  useEffect(() => {
    if (initialStandard) {
      setSelectedStandard(initialStandard);
    }
  }, [initialStandard]);

  // Compute student stats dynamically from entries
  const studentReadCountMap: Record<string, number> = {};
  entries.forEach(e => {
    if (e.status === 'returned') {
      studentReadCountMap[e.studentId] = (studentReadCountMap[e.studentId] || 0) + 1;
    }
  });

  // Calculate next roll number for a given standard
  const getNextRollNo = (std: Standard): number => {
    const stdStudents = students.filter(s => s.standard === std);
    if (stdStudents.length === 0) return 1;
    const maxRoll = Math.max(...stdStudents.map(s => s.rollNo || 0));
    return maxRoll + 1;
  };

  // Open Add Modal with pre-configured standard and roll number
  const handleOpenAddModal = (targetStd?: Standard) => {
    const stdToUse = targetStd || (selectedStandard !== 'all' ? selectedStandard : '1');
    setNewStd(stdToUse);
    setNewRoll(getNextRollNo(stdToUse));
    setNewName('');
    setNewGr('');
    setNewDiv('અ');
    setNewPhoto('');
    setIsAddModalOpen(true);
  };

  // Handle Standard change inside Add Form to auto-update roll number
  const handleAddStdChange = (std: Standard) => {
    setNewStd(std);
    setNewRoll(getNextRollNo(std));
  };

  // Open Edit Modal
  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditStd(student.standard);
    setEditRoll(student.rollNo);
    setEditGr(student.grNo || '');
    setEditDiv(student.division);
    setEditPhoto(student.photoUrl || '');
  };

  const handleNewPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 280, 0.85);
        setNewPhoto(compressed);
      } catch (err) {
        alert('ફોટો વાંચવામાં ક્ષતિ આવી.');
      }
    }
  };

  const handleEditPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 280, 0.85);
        setEditPhoto(compressed);
      } catch (err) {
        alert('ફોટો વાંચવામાં ક્ષતિ આવી.');
      }
    }
  };

  // Submit Add Student
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const defaultAvatar = getStudentDefaultAvatar(newName.trim(), Number(newRoll) || 1, newStd);

    onAddNewStudent({
      name: newName.trim(),
      standard: newStd,
      division: newDiv,
      rollNo: Number(newRoll) || 1,
      grNo: newGr.trim() || undefined,
      photoUrl: newPhoto || defaultAvatar,
    });

    if (keepAddOpen) {
      // Prepare for next student in same standard
      setNewName('');
      setNewGr('');
      setNewPhoto('');
      setNewRoll(prev => prev + 1);
    } else {
      setNewName('');
      setNewPhoto('');
      setIsAddModalOpen(false);
    }
  };

  // Submit Edit Student
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editName.trim()) return;

    onUpdateStudent({
      ...editingStudent,
      name: editName.trim(),
      standard: editStd,
      division: editDiv,
      rollNo: Number(editRoll) || 1,
      grNo: editGr.trim() || undefined,
      photoUrl: editPhoto || editingStudent.photoUrl || getStudentDefaultAvatar(editName.trim(), Number(editRoll) || 1, editStd),
    });

    setEditingStudent(null);
  };

  // Submit Delete Student
  const handleConfirmDelete = () => {
    if (deletingStudent) {
      onDeleteStudent(deletingStudent.id);
      setDeletingStudent(null);
    }
  };

  // Filter students based on standard & search query
  const filteredStudents = students.filter(s => {
    const matchStd = selectedStandard === 'all' || s.standard === selectedStandard;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toString().includes(searchQuery) ||
      (s.grNo && s.grNo.includes(searchQuery));
    return matchStd && matchSearch;
  });

  // Count students by standard
  const countsByStd: Record<Standard | 'all', number> = {
    all: students.length,
    '1': students.filter(s => s.standard === '1').length,
    '2': students.filter(s => s.standard === '2').length,
    '3': students.filter(s => s.standard === '3').length,
    '4': students.filter(s => s.standard === '4').length,
    '5': students.filter(s => s.standard === '5').length,
    '6': students.filter(s => s.standard === '6').length,
    '7': students.filter(s => s.standard === '7').length,
    '8': students.filter(s => s.standard === '8').length,
  };

  // Student specific entries for passport
  const activeStudentEntries = activeStudentDetail
    ? entries.filter(e => e.studentId === activeStudentDetail.id || e.studentName === activeStudentDetail.name)
    : [];

  // Check if deleting student currently has an unreturned book
  const deletingStudentActiveEntry = deletingStudent
    ? entries.find(
        e => (e.studentId === deletingStudent.id || e.studentName === deletingStudent.name) && e.status === 'reading'
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                વિદ્યાર્થી સંચાલન (ધોરણ ૧ થી ૮ મુજબ ઉમેરો / દૂર કરો)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ધારિયા પ્રાથમિક શાળા: ધોરણવાર બાળકોના નામ નોંધવા, સુધારવા કે યાદીમાંથી દૂર કરવા
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all self-start md:self-auto hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>
            {selectedStandard === 'all'
              ? 'નવો વિદ્યાર્થી ઉમેરો'
              : `ધોરણ ${toGujaratiNum(selectedStandard)} માં બાળક ઉમેરો`}
          </span>
        </button>
      </div>

      {/* Standard-Wise Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span>ધોરણ પસંદ કરો:</span>
          </span>
          <span className="text-xs text-slate-500 font-mono">
            કુલ વિદ્યાર્થીઓ: <strong className="text-amber-800">{toGujaratiNum(students.length)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
          <button
            onClick={() => setSelectedStandard('all')}
            className={`py-2 px-2 rounded-xl text-center transition-all ${
              selectedStandard === 'all'
                ? 'bg-amber-700 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <div className="text-xs sm:text-sm font-semibold">બધા ધોરણ</div>
            <div className={`text-[11px] font-mono mt-0.5 ${selectedStandard === 'all' ? 'text-amber-100' : 'text-slate-500'}`}>
              {toGujaratiNum(countsByStd.all)} બાળકો
            </div>
          </button>

          {(['1', '2', '3', '4', '5', '6', '7', '8'] as Standard[]).map(std => {
            const isSelected = selectedStandard === std;
            const count = countsByStd[std];
            return (
              <button
                key={std}
                onClick={() => setSelectedStandard(std)}
                className={`py-2 px-1.5 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-amber-700 text-white font-bold shadow-xs ring-2 ring-amber-700/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="text-xs sm:text-sm font-semibold">ધોરણ {toGujaratiNum(std)}</div>
                <div className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                  {toGujaratiNum(count)} બાળકો
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Standard Action Bar + Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-800">
            {selectedStandard === 'all' ? (
              'સમગ્ર શાળાના વિદ્યાર્થીઓ (ધોરણ ૧ થી ૮)'
            ) : (
              <span>
                ધોરણ <strong className="text-amber-800 text-base">{toGujaratiNum(selectedStandard)}</strong> ના વિદ્યાર્થીઓની યાદી
                <span className="ml-2 text-xs font-normal text-slate-500 font-mono">
                  ({toGujaratiNum(countsByStd[selectedStandard])} બાળકો)
                </span>
              </span>
            )}
          </span>
          {selectedStandard !== 'all' && (
            <button
              onClick={() => handleOpenAddModal(selectedStandard)}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ઉમેરો</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="નામ કે હાજરી નંબર શોધો..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-xl outline-none focus:border-amber-600 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {selectedStandard === 'all'
              ? 'કોઈ વિદ્યાર્થી મળ્યા નથી'
              : `ધોરણ ${toGujaratiNum(selectedStandard)} માં હજુ કોઈ બાળક નોંધાયેલ નથી`}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            {searchQuery
              ? `"${searchQuery}" માટે કોઈ વિદ્યાર્થી મળ્યા નથી.`
              : `આ ધોરણના બાળકોના નામ, હાજરી નંબર અને ફોટા સાથે નવો વિદ્યાર્થી ઉમેરો.`}
          </p>
          <button
            onClick={() => handleOpenAddModal(selectedStandard !== 'all' ? selectedStandard : '1')}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>
              {selectedStandard === 'all'
                ? 'પ્રથમ વિદ્યાર્થી ઉમેરો'
                : `ધોરણ ${toGujaratiNum(selectedStandard)} માં પ્રથમ બાળક ઉમેરો`}
            </span>
          </button>
        </div>
      )}

      {/* Students Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => {
          const totalRead = studentReadCountMap[student.id] ?? student.totalBooksRead;
          const currentReadingEntry = entries.find(
            e => (e.studentId === student.id || e.studentName === student.name) && e.status === 'reading'
          );

          return (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all relative group"
            >
              <div>
                {/* Standard Badge & Top Action Buttons */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                      ધોરણ {toGujaratiNum(student.standard)} ({student.division})
                    </span>
                    <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                      હાજરી: <strong>{toGujaratiNum(student.rollNo)}</strong>
                    </span>
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(student)}
                      className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                      title="વિદ્યાર્થીની માહિતી સુધારો (Edit)"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingStudent(student)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="વિદ્યાર્થીને યાદીમાંથી દૂર કરો (Delete)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Student Photo and Info */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="relative group/avatar shrink-0">
                    <StudentAvatar
                      photoUrl={student.photoUrl}
                      name={student.name}
                      rollNo={student.rollNo}
                      standard={student.standard}
                      size="lg"
                    />
                    <button
                      onClick={() => setPhotoModalStudent(student)}
                      className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                      title="ફોટો બદલો / નવો પાડો"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-base leading-snug truncate" title={student.name}>
                      {student.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      {student.grNo && (
                        <span className="font-mono text-[11px] text-slate-400">
                          GR: {student.grNo}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setPhotoModalStudent(student)}
                      className="text-[11px] text-amber-700 hover:text-amber-900 flex items-center gap-1 mt-1 font-semibold"
                    >
                      <Camera className="w-3 h-3" />
                      <span>{student.photoUrl?.startsWith('data:') ? 'ફોટો બદલો' : 'ફોટો અપલોડ'}</span>
                    </button>
                  </div>
                </div>

                {/* Current reading status */}
                <div className="pt-2.5 border-t border-slate-100 text-xs">
                  {currentReadingEntry ? (
                    <div className="bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-200/70">
                      <span className="font-bold block text-[11px] text-amber-800">હાલ વાંચી રહ્યા છે:</span>
                      <span className="font-medium truncate block mt-0.5" title={currentReadingEntry.bookTitle}>
                        📖 {currentReadingEntry.bookTitle}
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs italic py-1">
                      હાલ કોઈ પુસ્તક વાંચનમાં નથી.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{toGujaratiNum(totalRead)} પુસ્તક વાંચ્યા</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveStudentDetail(student)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="વાચન કાર્ડ / ઇતિહાસ જુઓ"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onQuickIssueToStudent(student)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-all shadow-xs"
                  >
                    પુસ્તક આપો
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===================== ADD NEW STUDENT MODAL ===================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  નવો વિદ્યાર્થી ઉમેરો (ધોરણ {toGujaratiNum(newStd)})
                </h3>
                <p className="text-xs text-slate-500">
                  શ્રી ધારિયા પ્રાથમિક શાળા - વિદ્યાર્થી નોંધણી
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-300 bg-white shrink-0 shadow-2xs">
                  {newPhoto ? (
                    <img src={newPhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-amber-50">
                      <Camera className="w-6 h-6 text-amber-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    બાળકનો ફોટો (તસવીર)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addPhotoInputRef.current?.click()}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-amber-900 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-700" />
                      <span>{newPhoto ? 'ફોટો બદલો' : 'ફોટો પસંદ કરો'}</span>
                    </button>
                    {newPhoto && (
                      <button
                        type="button"
                        onClick={() => setNewPhoto('')}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        દૂર કરો
                      </button>
                    )}
                  </div>
                  <input
                    ref={addPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleNewPhotoUpload}
                    className="hidden"
                  />
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    (ફોટો ન હોય તો આપમેળે સ્કૂલ યુનિફોર્મ અવતાર બનશે)
                  </span>
                </div>
              </div>

              {/* Standard Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ધોરણ પસંદ કરો (Standard) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {(['1', '2', '3', '4', '5', '6', '7', '8'] as Standard[]).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddStdChange(s)}
                      className={`py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                        newStd === s
                          ? 'bg-amber-700 border-amber-700 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ધો. {toGujaratiNum(s)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  વિદ્યાર્થીનું પૂરું નામ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="દા.ત. પટેલ આરવ રમેશભાઈ"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  required
                  autoFocus
                />
              </div>

              {/* Roll No, Division, GR No */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    હાજરી નં. (Roll) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRoll}
                    onChange={e => setNewRoll(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:border-amber-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    વર્ગ (Division)
                  </label>
                  <select
                    value={newDiv}
                    onChange={e => setNewDiv(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:border-amber-600 bg-white"
                  >
                    <option value="અ">વર્ગ અ</option>
                    <option value="બ">વર્ગ બ</option>
                    <option value="ક">વર્ગ ક</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    જ.ર. નંબર (GR)
                  </label>
                  <input
                    type="text"
                    placeholder="દા.ત. 1422"
                    value={newGr}
                    onChange={e => setNewGr(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:border-amber-600 font-mono"
                  />
                </div>
              </div>

              {/* Continuous Entry Checkbox */}
              <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                <label className="flex items-center gap-2 text-xs text-amber-900 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepAddOpen}
                    onChange={e => setKeepAddOpen(e.target.checked)}
                    className="rounded text-amber-700 focus:ring-amber-500"
                  />
                  <span>આ બાળક સેવ કર્યા પછી તરત બીજું બાળક ઉમેરવું છે (સળંગ નોંધણી)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs"
                >
                  {keepAddOpen ? 'સાચવો અને આગળ વધો' : 'સાચવો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== EDIT STUDENT MODAL ===================== */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  વિદ્યાર્થીની વિગત સુધારો (Edit Student)
                </h3>
                <p className="text-xs text-slate-500">
                  નામ, ધોરણ ફેરબદલ અથવા હાજરી નંબર સુધારો
                </p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-300 bg-white shrink-0 shadow-2xs">
                  <img
                    src={editPhoto || editingStudent.photoUrl || getStudentDefaultAvatar(editName, editRoll, editStd)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    બાળકનો ફોટો
                  </label>
                  <button
                    type="button"
                    onClick={() => editPhotoInputRef.current?.click()}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-amber-900 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-700" />
                    <span>ફોટો બદલો</span>
                  </button>
                  <input
                    ref={editPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditPhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Standard Change (Class Promotion) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ધોરણ (Standard) - ધોરણ બદલવા માટે ક્લિક કરો
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {(['1', '2', '3', '4', '5', '6', '7', '8'] as Standard[]).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditStd(s)}
                      className={`py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                        editStd === s
                          ? 'bg-amber-700 border-amber-700 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ધો. {toGujaratiNum(s)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  વિદ્યાર્થીનું નામ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>

              {/* Roll, Div, GR */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    હાજરી નં. (Roll) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editRoll}
                    onChange={e => setEditRoll(Number(e.target.value))}
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:border-amber-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    વર્ગ (Division)
                  </label>
                  <select
                    value={editDiv}
                    onChange={e => setEditDiv(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:border-amber-600 bg-white"
                  >
                    <option value="અ">વર્ગ અ</option>
                    <option value="બ">વર્ગ બ</option>
                    <option value="ક">વર્ગ ક</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    જ.ર. નંબર (GR)
                  </label>
                  <input
                    type="text"
                    value={editGr}
                    onChange={e => setEditGr(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl p-2.5 outline-none focus:border-amber-600 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs"
                >
                  ફેરફારો સાચવો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== DELETE STUDENT MODAL ===================== */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  વિદ્યાર્થીને યાદીમાંથી દૂર કરો?
                </h3>
                <p className="text-xs text-slate-500">
                  ધોરણ {toGujaratiNum(deletingStudent.standard)} માંથી બાળકનું નામ રદ થશે
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 my-4 flex items-center gap-3">
              <StudentAvatar
                photoUrl={deletingStudent.photoUrl}
                name={deletingStudent.name}
                rollNo={deletingStudent.rollNo}
                standard={deletingStudent.standard}
                size="md"
              />
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {deletingStudent.name}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  ધોરણ {toGujaratiNum(deletingStudent.standard)} · હાજરી નં: {toGujaratiNum(deletingStudent.rollNo)}
                </div>
              </div>
            </div>

            {deletingStudentActiveEntry && (
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl mb-4 text-xs text-amber-900">
                <strong className="block font-bold mb-0.5">⚠️ ધ્યાન આપો:</strong>
                આ વિદ્યાર્થી પાસે હાલ <strong>"{deletingStudentActiveEntry.bookTitle}"</strong> પુસ્તક જમા કરાવવાનું બાકી છે.
              </div>
            )}

            <p className="text-xs text-slate-600 mb-5">
              શું તમે ખરેખર આ વિદ્યાર્થીનું નામ રજીસ્ટરમાંથી કાયમી ધોરણે દૂર કરવા માંગો છો?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-100 rounded-xl font-semibold"
              >
                રદ કરો (ના)
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                હા, દૂર કરો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Reading Passport / History Modal */}
      {activeStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-amber-50/70 rounded-t-2xl">
              <div className="flex items-center gap-3.5">
                <StudentAvatar
                  photoUrl={activeStudentDetail.photoUrl}
                  name={activeStudentDetail.name}
                  rollNo={activeStudentDetail.rollNo}
                  standard={activeStudentDetail.standard}
                  size="lg"
                />
                <div>
                  <span className="text-xs text-amber-800 font-semibold block">
                    ધારિયા પ્રાથમિક શાળા · વિદ્યાર્થી વાચન કાર્ડ (Reading Passport)
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {activeStudentDetail.name}
                  </h3>
                  <div className="text-xs text-slate-600 mt-0.5">
                    ધોરણ {toGujaratiNum(activeStudentDetail.standard)} · હાજરી નં: {toGujaratiNum(activeStudentDetail.rollNo)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500">કુલ વાંચેલા પુસ્તકો:</span>
                  <div className="text-xl font-bold text-slate-900 font-mono">
                    {toGujaratiNum(activeStudentEntries.filter(e => e.status === 'returned').length)} પુસ્તકો
                  </div>
                </div>

                <button
                  onClick={() => {
                    const cnt = activeStudentEntries.filter(e => e.status === 'returned').length;
                    onOpenCertificate(activeStudentDetail, cnt);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs"
                >
                  <Award className="w-4 h-4" />
                  <span>પ્રશંસા પ્રમાણપત્ર પ્રિન્ટ</span>
                </button>
              </div>

              <h4 className="text-xs font-bold text-slate-700">
                વાંચેલા પુસ્તકોની વિગતવાર યાદી:
              </h4>

              {activeStudentEntries.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  હજુ સુધી કોઈ પુસ્તક વિતરણ નોંધાયેલ નથી.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeStudentEntries.map(ent => (
                    <div
                      key={ent.id}
                      className="p-3 bg-white border border-slate-200 rounded-lg text-xs hover:border-slate-300"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {ent.bookTitle}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            ક્રમાંક: {ent.bookNo} · આપ્યા તારીખ: {formatDateShort(ent.issueDate)} · પરત તારીખ: {ent.actualReturnDate ? formatDateShort(ent.actualReturnDate) : 'વાંચનમાં'}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            ent.status === 'returned'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {ent.status === 'returned' ? 'વાંચન પૂર્ણ' : 'વાંચનમાં'}
                        </span>
                      </div>

                      {ent.feedback && (
                        <div className="mt-2 bg-slate-50 p-2 rounded text-[11px] text-slate-700 italic border border-slate-100">
                          "બાળકનો પ્રતિભાવ: {ent.feedback}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={!!photoModalStudent}
        student={photoModalStudent}
        onClose={() => setPhotoModalStudent(null)}
        onSavePhoto={onUpdateStudentPhoto}
      />
    </div>
  );
};
