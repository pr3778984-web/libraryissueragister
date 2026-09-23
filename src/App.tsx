import React, { useState, useEffect } from 'react';
import { Book, RegisterEntry, SchoolProfile, Standard, Student } from './types/library';
import {
  loadProfile,
  saveProfile,
  loadEntries,
  saveEntries,
  loadBooks,
  saveBooks,
  loadStudents,
  saveStudents,
  exportRegisterToCSV,
} from './utils/storage';
import { initialBooks, initialEntries, initialSchoolProfile, initialStudents } from './data/initialData';
import { isDateOverdue } from './utils/dateHelpers';

import { Navbar } from './components/Navbar';
import { SchoolHeader } from './components/SchoolHeader';
import { StatsCards } from './components/StatsCards';
import { StandardFilter } from './components/StandardFilter';
import { RegisterTable } from './components/RegisterTable';
import { IssueBookModal } from './components/IssueBookModal';
import { ReturnBookModal } from './components/ReturnBookModal';
import { EditEntryModal } from './components/EditEntryModal';
import { BookCatalogView } from './components/BookCatalogView';
import { StudentDirectoryView } from './components/StudentDirectoryView';
import { ReadingStarsView } from './components/ReadingStarsView';
import { PrintRegisterModal } from './components/PrintRegisterModal';
import { ReadingCertificateModal } from './components/ReadingCertificateModal';
import { Footer } from './components/Footer';

export default function App() {
  const [profile, setProfile] = useState<SchoolProfile>(loadProfile);
  const [entries, setEntries] = useState<RegisterEntry[]>(loadEntries);
  const [books, setBooks] = useState<Book[]>(loadBooks);
  const [students, setStudents] = useState<Student[]>(loadStudents);

  const [currentView, setCurrentView] = useState<'register' | 'books' | 'students' | 'stars'>('register');
  const [selectedStandard, setSelectedStandard] = useState<Standard | 'all'>('all');

  // Modals state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [returnModalEntry, setReturnModalEntry] = useState<RegisterEntry | null>(null);
  const [editModalEntry, setEditModalEntry] = useState<RegisterEntry | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [certificateData, setCertificateData] = useState<{ student: Student; count: number } | null>(null);

  // Sync to local storage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  useEffect(() => {
    saveBooks(books);
  }, [books]);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  // Derived counts
  const activeReadingEntries = entries.filter(e => e.status === 'reading');
  const activeReadingCount = activeReadingEntries.length;
  const returnedCount = entries.filter(e => e.status === 'returned').length;
  const overdueCount = activeReadingEntries.filter(e => isDateOverdue(e.expectedReturnDate)).length;
  const availableBooksCount = books.filter(b => b.isAvailable).length;

  // Counts by Standard
  const countsByStandard: Record<Standard | 'all', number> = {
    all: entries.length,
    '1': entries.filter(e => e.standard === '1').length,
    '2': entries.filter(e => e.standard === '2').length,
    '3': entries.filter(e => e.standard === '3').length,
    '4': entries.filter(e => e.standard === '4').length,
    '5': entries.filter(e => e.standard === '5').length,
    '6': entries.filter(e => e.standard === '6').length,
    '7': entries.filter(e => e.standard === '7').length,
    '8': entries.filter(e => e.standard === '8').length,
  };

  // Handlers
  const handleSaveIssue = (newEntryData: Omit<RegisterEntry, 'id' | 'srNo'>) => {
    const maxSr = entries.reduce((max, e) => Math.max(max, e.srNo || 0), 0);
    const newEntry: RegisterEntry = {
      ...newEntryData,
      id: `entry-${Date.now()}`,
      srNo: maxSr + 1,
    };

    setEntries(prev => [newEntry, ...prev]);

    // Mark book as unavailable in catalog
    setBooks(prev =>
      prev.map(b => (b.id === newEntry.bookId ? { ...b, isAvailable: false } : b))
    );
  };

  const handleConfirmReturn = (
    entryId: string,
    actualReturnDate: string,
    rating: number,
    feedback: string,
    remarks: string
  ) => {
    let returnedBookId = '';
    let returnedStudentId = '';

    setEntries(prev =>
      prev.map(e => {
        if (e.id === entryId) {
          returnedBookId = e.bookId;
          returnedStudentId = e.studentId;
          return {
            ...e,
            status: 'returned',
            actualReturnDate,
            rating,
            feedback,
            remarks: remarks || e.remarks,
          };
        }
        return e;
      })
    );

    // Mark book available again
    if (returnedBookId) {
      setBooks(prev =>
        prev.map(b => (b.id === returnedBookId ? { ...b, isAvailable: true } : b))
      );
    }

    // Increment student total books read
    if (returnedStudentId) {
      setStudents(prev =>
        prev.map(s =>
          s.id === returnedStudentId
            ? { ...s, totalBooksRead: (s.totalBooksRead || 0) + 1 }
            : s
        )
      );
    }
  };

  const handleSaveEdit = (updated: RegisterEntry) => {
    setEntries(prev => prev.map(e => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('શું તમે ખરેખર આ નોંધણી રજીસ્ટરમાંથી કાઢી નાખવા માંગો છો?')) {
      const entryToDelete = entries.find(e => e.id === id);
      setEntries(prev => prev.filter(e => e.id !== id));
      if (entryToDelete && entryToDelete.status === 'reading') {
        setBooks(prev =>
          prev.map(b => (b.id === entryToDelete.bookId ? { ...b, isAvailable: true } : b))
        );
      }
    }
  };

  const handleAddNewBook = (bookData: Omit<Book, 'id' | 'isAvailable'>) => {
    const newBook: Book = {
      ...bookData,
      id: `b-${Date.now()}`,
      isAvailable: true,
    };
    setBooks(prev => [newBook, ...prev]);
  };

  const handleAddNewStudent = (studentData: Omit<Student, 'id' | 'totalBooksRead'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `s-${Date.now()}`,
      totalBooksRead: 0,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setEntries(prev =>
      prev.map(e =>
        e.studentId === updatedStudent.id
          ? {
              ...e,
              studentName: updatedStudent.name,
              rollNo: updatedStudent.rollNo,
              standard: updatedStudent.standard,
              studentPhoto: updatedStudent.photoUrl || e.studentPhoto,
            }
          : e
      )
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const handleUpdateStudentPhoto = (studentId: string, photoUrl: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, photoUrl } : s))
    );
    setEntries(prev =>
      prev.map(e => (e.studentId === studentId ? { ...e, studentPhoto: photoUrl } : e))
    );
  };

  const handleQuickIssueToStudent = (student: Student) => {
    setSelectedStandard(student.standard);
    setIsIssueModalOpen(true);
  };

  const handleQuickIssueBook = (_book: Book) => {
    setIsIssueModalOpen(true);
  };

  const handleExportCSV = () => {
    exportRegisterToCSV(entries, profile.name);
  };

  const handleRestoreData = (backup: {
    profile?: SchoolProfile;
    entries?: RegisterEntry[];
    books?: Book[];
    students?: Student[];
  }) => {
    if (backup.profile) setProfile(backup.profile);
    if (backup.entries) setEntries(backup.entries);
    if (backup.books) setBooks(backup.books);
    if (backup.students) setStudents(backup.students);
  };

  const handleResetData = () => {
    if (window.confirm('શું તમે ડેમો / નમૂના ડેટા પુનઃસ્થાપિત કરવા માંગો છો? તમારો નવો ડેટા રીસેટ થશે.')) {
      setProfile(initialSchoolProfile);
      setEntries(initialEntries);
      setBooks(initialBooks);
      setStudents(initialStudents);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenIssueModal={() => setIsIssueModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onExportCSV={handleExportCSV}
        activeReadingCount={activeReadingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* School Identity & Header */}
        <SchoolHeader
          profile={profile}
          totalEntriesCount={entries.length}
          activeReadingCount={activeReadingCount}
          onOpenIssueModal={() => setIsIssueModalOpen(true)}
        />

        {/* Dynamic Views */}
        {currentView === 'register' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <StatsCards
              totalIssues={entries.length}
              activeReading={activeReadingCount}
              returnedCount={returnedCount}
              overdueCount={overdueCount}
              availableBooksCount={availableBooksCount}
            />

            {/* Standard 1 to 8 Filter */}
            <StandardFilter
              selectedStandard={selectedStandard}
              onSelectStandard={setSelectedStandard}
              countsByStandard={countsByStandard}
              onManageStudents={std => {
                if (std !== 'all') setSelectedStandard(std);
                setCurrentView('students');
              }}
            />

            {/* Main Register Table */}
            <RegisterTable
              entries={entries}
              selectedStandard={selectedStandard}
              onMarkReturn={entry => setReturnModalEntry(entry)}
              onEditEntry={entry => setEditModalEntry(entry)}
              onDeleteEntry={handleDeleteEntry}
              onOpenIssueModal={() => setIsIssueModalOpen(true)}
            />
          </div>
        )}

        {currentView === 'books' && (
          <BookCatalogView
            books={books}
            onAddNewBook={handleAddNewBook}
            onQuickIssueBook={handleQuickIssueBook}
          />
        )}

        {currentView === 'students' && (
          <StudentDirectoryView
            students={students}
            entries={entries}
            initialStandard={selectedStandard}
            onAddNewStudent={handleAddNewStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onQuickIssueToStudent={handleQuickIssueToStudent}
            onOpenCertificate={(student, count) => setCertificateData({ student, count })}
            onUpdateStudentPhoto={handleUpdateStudentPhoto}
          />
        )}

        {currentView === 'stars' && (
          <ReadingStarsView
            students={students}
            entries={entries}
            onOpenCertificate={(student, count) => setCertificateData({ student, count })}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        entries={entries}
        books={books}
        students={students}
        onRestoreData={handleRestoreData}
        onResetData={handleResetData}
      />

      {/* Modals */}
      <IssueBookModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSaveIssue={handleSaveIssue}
        students={students}
        books={books}
        defaultStandard={selectedStandard}
      />

      <ReturnBookModal
        isOpen={!!returnModalEntry}
        entry={returnModalEntry}
        onClose={() => setReturnModalEntry(null)}
        onConfirmReturn={handleConfirmReturn}
      />

      <EditEntryModal
        isOpen={!!editModalEntry}
        entry={editModalEntry}
        onClose={() => setEditModalEntry(null)}
        onSave={handleSaveEdit}
      />

      <PrintRegisterModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        entries={entries}
        profile={profile}
        selectedStandard={selectedStandard}
      />

      <ReadingCertificateModal
        isOpen={!!certificateData}
        onClose={() => setCertificateData(null)}
        student={certificateData?.student || null}
        bookCount={certificateData?.count || 0}
        profile={profile}
      />
    </div>
  );
}
