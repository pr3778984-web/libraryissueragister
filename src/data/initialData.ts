import { Book, RegisterEntry, SchoolProfile, Student } from '../types/library';
import { getStudentDefaultAvatar } from '../utils/photoHelpers';

export const initialSchoolProfile: SchoolProfile = {
  name: 'શ્રી ધારિયા પ્રાથમિક શાળા',
  village: 'ધારિયા (Dhariya)',
  taluka: 'હાલોલ (Halol)',
  district: 'પંચમહાલ (Panchmahal)',
  diseCode: '24180402101',
  academicYear: '૨૦૨૬-૨૭',
  librarianTeacher: 'શ્રી પુસ્તકાલય પ્રભારી શિક્ષક'
};

export const initialStudents: Student[] = [
  // ધોરણ ૧
  { id: 's-1-1', name: 'બારિયા રાહુલ મહેશભાઈ', standard: '1', division: 'અ', rollNo: 1, grNo: '1421', totalBooksRead: 3, photoUrl: getStudentDefaultAvatar('બારિયા રાહુલ મહેશભાઈ', 1, '1') },
  { id: 's-1-2', name: 'પરમાર પ્રિયા રાજેશભાઈ', standard: '1', division: 'અ', rollNo: 2, grNo: '1425', totalBooksRead: 2, photoUrl: getStudentDefaultAvatar('પરમાર પ્રિયા રાજેશભાઈ', 2, '1') },
  { id: 's-1-3', name: 'પટેલ મીત કનુભાઈ', standard: '1', division: 'અ', rollNo: 3, grNo: '1430', totalBooksRead: 4, photoUrl: getStudentDefaultAvatar('પટેલ મીત કનુભાઈ', 3, '1') },
  
  // ધોરણ ૨
  { id: 's-2-1', name: 'સોલંકી હર્ષ વિજયભાઈ', standard: '2', division: 'અ', rollNo: 1, grNo: '1388', totalBooksRead: 5, photoUrl: getStudentDefaultAvatar('સોલંકી હર્ષ વિજયભાઈ', 1, '2') },
  { id: 's-2-2', name: 'નાયક અંકિતા દિનેશભાઈ', standard: '2', division: 'અ', rollNo: 2, grNo: '1392', totalBooksRead: 6, photoUrl: getStudentDefaultAvatar('નાયક અંકિતા દિનેશભાઈ', 2, '2') },
  
  // ધોરણ ૩
  { id: 's-3-1', name: 'રાઠોડ યશ પ્રવીણભાઈ', standard: '3', division: 'અ', rollNo: 1, grNo: '1312', totalBooksRead: 7, photoUrl: getStudentDefaultAvatar('રાઠોડ યશ પ્રવીણભાઈ', 1, '3') },
  { id: 's-3-2', name: 'ચૌહાણ દિવ્યા કિરીટભાઈ', standard: '3', division: 'અ', rollNo: 2, grNo: '1318', totalBooksRead: 8, photoUrl: getStudentDefaultAvatar('ચૌહાણ દિવ્યા કિરીટભાઈ', 2, '3') },
  { id: 's-3-3', name: 'બારિયા આકાશ સંજયભાઈ', standard: '3', division: 'અ', rollNo: 3, grNo: '1322', totalBooksRead: 5, photoUrl: getStudentDefaultAvatar('બારિયા આકાશ સંજયભાઈ', 3, '3') },

  // ધોરણ ૪
  { id: 's-4-1', name: 'પરમાર આયુષ નરેન્દ્રભાઈ', standard: '4', division: 'અ', rollNo: 1, grNo: '1240', totalBooksRead: 9, photoUrl: getStudentDefaultAvatar('પરમાર આયુષ નરેન્દ્રભાઈ', 1, '4') },
  { id: 's-4-2', name: 'પંચાલ કાવ્યા હરેશભાઈ', standard: '4', division: 'અ', rollNo: 2, grNo: '1244', totalBooksRead: 11, photoUrl: getStudentDefaultAvatar('પંચાલ કાવ્યા હરેશભાઈ', 2, '4') },
  
  // ધોરણ ૫
  { id: 's-5-1', name: 'ઠાકોર સાહિલ ભીખાભાઈ', standard: '5', division: 'અ', rollNo: 1, grNo: '1180', totalBooksRead: 12, photoUrl: getStudentDefaultAvatar('ઠાકોર સાહિલ ભીખાભાઈ', 1, '5') },
  { id: 's-5-2', name: 'બારિયા મનિષા કાંતિભાઈ', standard: '5', division: 'અ', rollNo: 2, grNo: '1186', totalBooksRead: 10, photoUrl: getStudentDefaultAvatar('બારિયા મનિષા કાંતિભાઈ', 2, '5') },
  
  // ધોરણ ૬
  { id: 's-6-1', name: 'પટેલ રોનક ભવાનભાઈ', standard: '6', division: 'અ', rollNo: 1, grNo: '1095', totalBooksRead: 14, photoUrl: getStudentDefaultAvatar('પટેલ રોનક ભવાનભાઈ', 1, '6') },
  { id: 's-6-2', name: 'સોલંકી ભાવના અર્જુનભાઈ', standard: '6', division: 'અ', rollNo: 2, grNo: '1102', totalBooksRead: 13, photoUrl: getStudentDefaultAvatar('સોલંકી ભાવના અર્જુનભાઈ', 2, '6') },
  
  // ધોરણ ૭
  { id: 's-7-1', name: 'વાઘેલા જયરાજ વિક્રમભાઈ', standard: '7', division: 'અ', rollNo: 1, grNo: '1020', totalBooksRead: 16, photoUrl: getStudentDefaultAvatar('વાઘેલા જયરાજ વિક્રમભાઈ', 1, '7') },
  { id: 's-7-2', name: 'મકવાણા સ્નેહા શંકરભાઈ', standard: '7', division: 'અ', rollNo: 2, grNo: '1026', totalBooksRead: 15, photoUrl: getStudentDefaultAvatar('મકવાણા સ્નેહા શંકરભાઈ', 2, '7') },
  
  // ધોરણ ૮
  { id: 's-8-1', name: 'પરમાર કાર્તિક ઉમેશભાઈ', standard: '8', division: 'અ', rollNo: 1, grNo: '950', totalBooksRead: 18, photoUrl: getStudentDefaultAvatar('પરમાર કાર્તિક ઉમેશભાઈ', 1, '8') },
  { id: 's-8-2', name: 'રાઠોડ પૂજા રમેશભાઈ', standard: '8', division: 'અ', rollNo: 2, grNo: '955', totalBooksRead: 20, photoUrl: getStudentDefaultAvatar('રાઠોડ પૂજા રમેશભાઈ', 2, '8') },
];

export const initialBooks: Book[] = [
  { id: 'b-101', bookNo: 'PUSTAK-101', title: 'ચાલાક શિયાળ અને લુચ્ચો કાગડો', author: 'ગિજુભાઈ બધેકા', category: 'ચિત્રવાર્તા', standardRange: 'ધોરણ ૧-૩', isAvailable: false, totalCopies: 2 },
  { id: 'b-102', bookNo: 'PUSTAK-102', title: 'સસલું અને કાચબો - સચિત્ર બાળગીતો', author: 'રમણલાલ સોની', category: 'બાળગીત / જોડકણાં', standardRange: 'ધોરણ ૧-૨', isAvailable: true, totalCopies: 3 },
  { id: 'b-103', bookNo: 'PUSTAK-103', title: 'પંચતંત્રની શ્રેષ્ઠ નીતિકથાઓ', author: 'વિષ્ણુ શર્મા (અનુવાદ)', category: 'બોધવાર્તા', standardRange: 'ધોરણ ૩-૫', isAvailable: false, totalCopies: 4 },
  { id: 'b-104', bookNo: 'PUSTAK-104', title: 'અકબર અને બીરબલની ચતુરાઈ', author: 'કિશોર વ્યાસ', category: 'હાસ્ય / ચતુરાઈ કથા', standardRange: 'ધોરણ ૩-૬', isAvailable: false, totalCopies: 3 },
  { id: 'b-105', bookNo: 'PUSTAK-105', title: 'તેનાલીરામનની બુદ્ધિમત્તા', author: 'નરેશ કાપડિયા', category: 'હાસ્ય કથા', standardRange: 'ધોરણ ૪-૭', isAvailable: true, totalCopies: 2 },
  { id: 'b-106', bookNo: 'PUSTAK-106', title: 'ગાંધીબાપુની પ્રેરણાદાયી બાળવાર્તાઓ', author: 'નારાયણ દેસાઈ', category: 'જીવનચરિત્ર', standardRange: 'ધોરણ ૫-૮', isAvailable: false, totalCopies: 2 },
  { id: 'b-107', bookNo: 'PUSTAK-107', title: 'વિજ્ઞાનના અવનવા પ્રયોગો અને ચમત્કાર', author: 'ડો. જે.જે. રાવલ', category: 'વિજ્ઞાન', standardRange: 'ધોરણ ૬-૮', isAvailable: true, totalCopies: 3 },
  { id: 'b-108', bookNo: 'PUSTAK-108', title: 'અગનપંખ - ડો. એ.પી.જે. અબ્દુલ કલામ', author: 'અરુણ તિવારી (અનુવાદ)', category: 'પ્રેરણાત્મક', standardRange: 'ધોરણ ૭-૮', isAvailable: false, totalCopies: 2 },
  { id: 'b-109', bookNo: 'PUSTAK-109', title: 'સ્વામી વિવેકાનંદ: યુવાનોના પ્રેરણામૂર્તિ', author: 'રામકૃષ્ણ મિશન', category: 'જીવનચરિત્ર', standardRange: 'ધોરણ ૬-૮', isAvailable: true, totalCopies: 2 },
  { id: 'b-110', bookNo: 'PUSTAK-110', title: 'ઇસપની પ્રખ્યાત અમર કથાઓ', author: 'રમણલાલ પાઠક', category: 'બોધવાર્તા', standardRange: 'ધોરણ ૩-૬', isAvailable: true, totalCopies: 4 },
  { id: 'b-111', bookNo: 'PUSTAK-111', title: 'મિયાં ફુસકી અને તભા ભટ્ટના પરાક્રમો', author: 'જીવરામ જોષી', category: 'હાસ્ય વાર્તા', standardRange: 'ધોરણ ૨-૫', isAvailable: true, totalCopies: 3 },
  { id: 'b-112', bookNo: 'PUSTAK-112', title: 'આપણા પક્ષીઓ અને વૃક્ષોની ઓળખ', author: 'પ્રદ્યુમ્ન કંચનરાય ત્રિવેદી', category: 'પર્યાવરણ', standardRange: 'ધોરણ ૪-૮', isAvailable: true, totalCopies: 2 },
];

export const initialEntries: RegisterEntry[] = [
  {
    id: 'entry-1',
    srNo: 1,
    studentId: 's-8-2',
    studentName: 'રાઠોડ પૂજા રમેશભાઈ',
    studentPhoto: getStudentDefaultAvatar('રાઠોડ પૂજા રમેશભાઈ', 2, '8'),
    standard: '8',
    rollNo: 2,
    bookId: 'b-108',
    bookNo: 'PUSTAK-108',
    bookTitle: 'અગનપંખ - ડો. એ.પી.જે. અબ્દુલ કલામ',
    category: 'પ્રેરણાત્મક',
    issueDate: '2026-09-15',
    expectedReturnDate: '2026-09-22',
    status: 'reading',
    remarks: 'વિજ્ઞાન વિષયમાં રસ ધરાવતી વિદ્યાર્થીની',
    issuedByTeacher: 'વર્ગશિક્ષક'
  },
  {
    id: 'entry-2',
    srNo: 2,
    studentId: 's-6-1',
    studentName: 'પટેલ રોનક ભવાનભાઈ',
    studentPhoto: getStudentDefaultAvatar('પટેલ રોનક ભવાનભાઈ', 1, '6'),
    standard: '6',
    rollNo: 1,
    bookId: 'b-106',
    bookNo: 'PUSTAK-106',
    bookTitle: 'ગાંધીબાપુની પ્રેરણાદાયી બાળવાર્તાઓ',
    category: 'જીવનચરિત્ર',
    issueDate: '2026-09-18',
    expectedReturnDate: '2026-09-25',
    status: 'reading',
    remarks: 'પ્રાર્થનાસભામાં વાર્તા રજૂ કરશે',
    issuedByTeacher: 'શાળા ગ્રંથપાલ'
  },
  {
    id: 'entry-3',
    srNo: 3,
    studentId: 's-4-2',
    studentName: 'પંચાલ કાવ્યા હરેશભાઈ',
    studentPhoto: getStudentDefaultAvatar('પંચાલ કાવ્યા હરેશભાઈ', 2, '4'),
    standard: '4',
    rollNo: 2,
    bookId: 'b-104',
    bookNo: 'PUSTAK-104',
    bookTitle: 'અકબર અને બીરબલની ચતુરાઈ',
    category: 'હાસ્ય / ચતુરાઈ કથા',
    issueDate: '2026-09-19',
    expectedReturnDate: '2026-09-26',
    status: 'reading',
    remarks: '',
    issuedByTeacher: 'શાળા ગ્રંથપાલ'
  },
  {
    id: 'entry-4',
    srNo: 4,
    studentId: 's-3-2',
    studentName: 'ચૌહાણ દિવ્યા કિરીટભાઈ',
    studentPhoto: getStudentDefaultAvatar('ચૌહાણ દિવ્યા કિરીટભાઈ', 2, '3'),
    standard: '3',
    rollNo: 2,
    bookId: 'b-103',
    bookNo: 'PUSTAK-103',
    bookTitle: 'પંચતંત્રની શ્રેષ્ઠ નીતિકથાઓ',
    category: 'બોધવાર્તા',
    issueDate: '2026-09-16',
    expectedReturnDate: '2026-09-23',
    status: 'reading',
    remarks: '',
    issuedByTeacher: 'વર્ગશિક્ષક'
  },
  {
    id: 'entry-5',
    srNo: 5,
    studentId: 's-1-1',
    studentName: 'બારિયા રાહુલ મહેશભાઈ',
    studentPhoto: getStudentDefaultAvatar('બારિયા રાહુલ મહેશભાઈ', 1, '1'),
    standard: '1',
    rollNo: 1,
    bookId: 'b-101',
    bookNo: 'PUSTAK-101',
    bookTitle: 'ચાલાક શિયાળ અને લુચ્ચો કાગડો',
    category: 'ચિત્રવાર્તા',
    issueDate: '2026-09-20',
    expectedReturnDate: '2026-09-27',
    status: 'reading',
    remarks: 'ચિત્રો જોઈને વાર્તા કહે છે',
    issuedByTeacher: 'વર્ગશિક્ષક'
  },
  {
    id: 'entry-6',
    srNo: 6,
    studentId: 's-7-1',
    studentName: 'વાઘેલા જયરાજ વિક્રમભાઈ',
    studentPhoto: getStudentDefaultAvatar('વાઘેલા જયરાજ વિક્રમભાઈ', 1, '7'),
    standard: '7',
    rollNo: 1,
    bookId: 'b-107',
    bookNo: 'PUSTAK-107',
    bookTitle: 'વિજ્ઞાનના અવનવા પ્રયોગો અને ચમત્કાર',
    category: 'વિજ્ઞાન',
    issueDate: '2026-09-10',
    expectedReturnDate: '2026-09-17',
    actualReturnDate: '2026-09-16',
    status: 'returned',
    rating: 5,
    feedback: 'હવા અને પાણીના પ્રયોગો ખૂબ જ સરળ અને રસપ્રદ લાગ્યા. વર્ગમાં પ્રયોગ કરીને બતાવ્યો.',
    remarks: 'ખૂબ સુંદર વાંચન નોંધ લખી છે.',
    issuedByTeacher: 'શાળા ગ્રંથપાલ'
  },
  {
    id: 'entry-7',
    srNo: 7,
    studentId: 's-5-1',
    studentName: 'ઠાકોર સાહિલ ભીખાભાઈ',
    studentPhoto: getStudentDefaultAvatar('ઠાકોર સાહિલ ભીખાભાઈ', 1, '5'),
    standard: '5',
    rollNo: 1,
    bookId: 'b-110',
    bookNo: 'PUSTAK-110',
    bookTitle: 'ઇસપની પ્રખ્યાત અમર કથાઓ',
    category: 'બોધવાર્તા',
    issueDate: '2026-09-08',
    expectedReturnDate: '2026-09-15',
    actualReturnDate: '2026-09-14',
    status: 'returned',
    rating: 5,
    feedback: 'સંપીને રહેવામાં જ બળ છે તે બોધ મળ્યો.',
    remarks: 'વાર્તા સંભળાવી હતી',
    issuedByTeacher: 'વર્ગશિક્ષક'
  },
  {
    id: 'entry-8',
    srNo: 8,
    studentId: 's-2-2',
    studentName: 'નાયક અંકિતા દિનેશભાઈ',
    studentPhoto: getStudentDefaultAvatar('નાયક અંકિતા દિનેશભાઈ', 2, '2'),
    standard: '2',
    rollNo: 2,
    bookId: 'b-102',
    bookNo: 'PUSTAK-102',
    bookTitle: 'સસલું અને કાચબો - સચિત્ર બાળગીતો',
    category: 'બાળગીત / જોડકણાં',
    issueDate: '2026-09-05',
    expectedReturnDate: '2026-09-12',
    actualReturnDate: '2026-09-11',
    status: 'returned',
    rating: 4,
    feedback: 'ગીતો ગાવાની ખૂબ મજા આવી. કાચબાની ધીરજ ગમી.',
    remarks: 'ગીત સરસ ગાયું',
    issuedByTeacher: 'વર્ગશિક્ષક'
  }
];
