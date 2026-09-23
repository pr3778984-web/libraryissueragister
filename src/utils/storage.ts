import { Book, RegisterEntry, SchoolProfile, Student } from '../types/library';
import { initialBooks, initialEntries, initialSchoolProfile, initialStudents } from '../data/initialData';
import { formatDateShort } from './dateHelpers';
import { getStudentDefaultAvatar } from './photoHelpers';

const KEYS = {
  PROFILE: 'dhariya_school_profile_v1',
  ENTRIES: 'dhariya_library_entries_v1',
  BOOKS: 'dhariya_library_books_v1',
  STUDENTS: 'dhariya_library_students_v1'
};

export function loadProfile(): SchoolProfile {
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : initialSchoolProfile;
  } catch (e) {
    console.error('Failed to load profile', e);
    return initialSchoolProfile;
  }
}

export function saveProfile(profile: SchoolProfile) {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadEntries(): RegisterEntry[] {
  try {
    const data = localStorage.getItem(KEYS.ENTRIES);
    if (!data) return initialEntries;
    const parsed: RegisterEntry[] = JSON.parse(data);
    return parsed.map(e => ({
      ...e,
      studentPhoto: e.studentPhoto || getStudentDefaultAvatar(e.studentName, e.rollNo, e.standard)
    }));
  } catch (e) {
    console.error('Failed to load entries', e);
    return initialEntries;
  }
}

export function saveEntries(entries: RegisterEntry[]) {
  try {
    localStorage.setItem(KEYS.ENTRIES, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save entries', e);
  }
}

export function loadBooks(): Book[] {
  try {
    const data = localStorage.getItem(KEYS.BOOKS);
    return data ? JSON.parse(data) : initialBooks;
  } catch (e) {
    console.error('Failed to load books', e);
    return initialBooks;
  }
}

export function saveBooks(books: Book[]) {
  try {
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to save books', e);
  }
}

export function loadStudents(): Student[] {
  try {
    const data = localStorage.getItem(KEYS.STUDENTS);
    if (!data) return initialStudents;
    const parsed: Student[] = JSON.parse(data);
    return parsed.map(s => ({
      ...s,
      photoUrl: s.photoUrl || getStudentDefaultAvatar(s.name, s.rollNo, s.standard)
    }));
  } catch (e) {
    console.error('Failed to load students', e);
    return initialStudents;
  }
}

export function saveStudents(students: Student[]) {
  try {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}

export function exportRegisterToCSV(entries: RegisterEntry[], schoolName: string) {
  // CSV with UTF-8 BOM so Gujarati characters display correctly in Microsoft Excel!
  const BOM = '\uFEFF';
  const headers = [
    'રજીસ્ટર ક્રમ (Sr No)',
    'આપ્યા તારીખ (Issue Date)',
    'વિદ્યાર્થીનું નામ (Student Name)',
    'ધોરણ (Standard)',
    'હાજરી નં. (Roll No)',
    'પુસ્તક નંબર (Book No)',
    'પુસ્તકનું નામ (Book Name)',
    'શ્રેણી (Category)',
    'પરત કરવાની તારીખ (Due Date)',
    'પરત મળ્યા તારીખ (Return Date)',
    'સ્થિતિ (Status)',
    'રેટિંગ (Rating 1-5)',
    'બાળકનો પ્રતિભાવ (Feedback)',
    'શિક્ષક નોંધ (Teacher Remarks)'
  ];

  const statusLabelMap: Record<string, string> = {
    reading: 'વાંચનમાં આપેલ (Reading)',
    returned: 'પરત મેળવેલ (Returned)',
    overdue: 'મુદત વીતી ગઈ (Overdue)'
  };

  const rows = entries.map(entry => [
    entry.srNo,
    formatDateShort(entry.issueDate),
    `"${entry.studentName.replace(/"/g, '""')}"`,
    `ધોરણ ${entry.standard}`,
    entry.rollNo,
    entry.bookNo,
    `"${entry.bookTitle.replace(/"/g, '""')}"`,
    `"${entry.category.replace(/"/g, '""')}"`,
    formatDateShort(entry.expectedReturnDate),
    entry.actualReturnDate ? formatDateShort(entry.actualReturnDate) : 'બાકી',
    statusLabelMap[entry.status] || entry.status,
    entry.rating ? `${entry.rating} Star` : '-',
    `"${(entry.feedback || '').replace(/"/g, '""')}"`,
    `"${(entry.remarks || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${schoolName}_પુસ્તકાલય_વાંચન_રજીસ્ટર_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBackupJSON(profile: SchoolProfile, entries: RegisterEntry[], books: Book[], students: Student[]) {
  const backup = {
    app: 'Dhariya Primary School Library Register',
    timestamp: new Date().toISOString(),
    profile,
    entries,
    books,
    students
  };
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dhariya_library_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
