export type Standard = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type BookStatus = 'reading' | 'returned' | 'overdue';

export interface Book {
  id: string;
  bookNo: string; // પુસ્તક ક્રમાંક / Accession No
  title: string; // પુસ્તકનું નામ
  author: string; // લેખક
  category: string; // શ્રેણી (બાળવાર્તા, વિજ્ઞાન, ચિત્રવાર્તા, વગેરે)
  standardRange: string; // યોગ્ય ધોરણ (દા.ત. ધોરણ ૧-૩, ધોરણ ૪-૮)
  isAvailable: boolean; // ઉપલબ્ધ છે કે વાંચનમાં?
  totalCopies: number;
}

export interface Student {
  id: string;
  name: string; // વિદ્યાર્થીનું નામ
  standard: Standard; // ધોરણ (૧ થી ૮)
  division: string; // વર્ગ (અ, બ)
  rollNo: number; // હાજરી નંબર
  grNo?: string; // જ.ર. નંબર
  totalBooksRead: number;
  photoUrl?: string; // બાળકની તસવીર / ફોટો
}

export interface RegisterEntry {
  id: string;
  srNo: number; // રજીસ્ટર ક્રમ
  studentId: string;
  studentName: string; // બાળકનું નામ
  studentPhoto?: string; // બાળકની તસવીર / ફોટો
  standard: Standard; // ધોરણ
  rollNo: number;
  bookId: string;
  bookNo: string; // પુસ્તક નંબર
  bookTitle: string; // પુસ્તકનું નામ
  category: string;
  issueDate: string; // કઈ તારીખે આપ્યું (YYYY-MM-DD)
  expectedReturnDate: string; // પરત આપવાની તારીખ (YYYY-MM-DD)
  actualReturnDate?: string; // પરત મળ્યા તારીખ (YYYY-MM-DD)
  status: BookStatus; // 'reading' | 'returned' | 'overdue'
  rating?: number; // ૧ થી ૫ તારા
  feedback?: string; // બાળકનો પ્રતિભાવ / શું શીખવા મળ્યું
  remarks?: string; // શિક્ષકની વિશેષ નોંધ
  issuedByTeacher?: string; // પુસ્તક આપનાર શિક્ષક
}

export interface SchoolProfile {
  name: string;
  village: string;
  taluka: string;
  district: string;
  diseCode: string;
  academicYear: string;
  librarianTeacher: string;
}
