// Gujarati numbers mapping
const gujaratiDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

export function toGujaratiNum(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '';
  return num
    .toString()
    .split('')
    .map(char => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) ? gujaratiDigits[parsed] : char;
    })
    .join('');
}

export function getTodayDateString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return getTodayDateString();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateGujarati(dateStr?: string, showGujDigits = true): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const [yyyy, mm, dd] = parts;
  const monthNames = [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ];
  
  const monthIdx = parseInt(mm, 10) - 1;
  const monthName = monthNames[monthIdx] || mm;
  
  const formatted = `${dd} ${monthName} ${yyyy}`;
  return showGujDigits ? toGujaratiNum(formatted) : formatted;
}

export function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function isDateOverdue(expectedDateStr: string): boolean {
  if (!expectedDateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expectedDateStr);
  exp.setHours(0, 0, 0, 0);
  return exp.getTime() < today.getTime();
}

export function getDaysRemainingOrOverdue(expectedDateStr: string): { days: number; isOverdue: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expectedDateStr);
  exp.setHours(0, 0, 0, 0);
  
  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    days: Math.abs(diffDays),
    isOverdue: diffDays < 0
  };
}
