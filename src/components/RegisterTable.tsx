import React, { useState } from 'react';
import { RegisterEntry, Standard, BookStatus } from '../types/library';
import { formatDateGujarati, formatDateShort, toGujaratiNum, isDateOverdue, getDaysRemainingOrOverdue } from '../utils/dateHelpers';
import { Search, RotateCcw, Star, Calendar, Trash2, Edit3, CheckCircle, BookOpen, AlertTriangle, ArrowUpDown, Filter } from 'lucide-react';
import { StudentAvatar } from './StudentAvatar';

interface RegisterTableProps {
  entries: RegisterEntry[];
  selectedStandard: Standard | 'all';
  onMarkReturn: (entry: RegisterEntry) => void;
  onEditEntry: (entry: RegisterEntry) => void;
  onDeleteEntry: (id: string) => void;
  onOpenIssueModal: () => void;
}

export const RegisterTable: React.FC<RegisterTableProps> = ({
  entries,
  selectedStandard,
  onMarkReturn,
  onEditEntry,
  onDeleteEntry,
  onOpenIssueModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookStatus>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'std'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter logic
  const filteredEntries = entries.filter(entry => {
    // 1. Standard filter
    if (selectedStandard !== 'all' && entry.standard !== selectedStandard) {
      return false;
    }

    // 2. Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'overdue') {
        const isOver = entry.status === 'reading' && isDateOverdue(entry.expectedReturnDate);
        if (!isOver) return false;
      } else if (entry.status !== statusFilter) {
        return false;
      }
    }

    // 3. Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = entry.studentName.toLowerCase().includes(q);
      const matchBook = entry.bookTitle.toLowerCase().includes(q);
      const matchBookNo = entry.bookNo.toLowerCase().includes(q);
      const matchCat = entry.category.toLowerCase().includes(q);
      const matchRoll = entry.rollNo.toString().includes(q);
      return matchName || matchBook || matchBookNo || matchCat || matchRoll;
    }

    return true;
  });

  // Sort logic
  filteredEntries.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.issueDate).getTime();
      const dateB = new Date(b.issueDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc'
        ? b.studentName.localeCompare(a.studentName)
        : a.studentName.localeCompare(b.studentName);
    }
    if (sortBy === 'std') {
      const stdA = parseInt(a.standard, 10);
      const stdB = parseInt(b.standard, 10);
      return sortOrder === 'desc' ? stdB - stdA : stdA - stdB;
    }
    return 0;
  });

  const toggleSort = (type: 'date' | 'name' | 'std') => {
    if (sortBy === type) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="વિદ્યાર્થીનું નામ, પુસ્તક અથવા નંબર શોધો..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              સાફ કરો
            </button>
          )}
        </div>

        {/* Status Segmented Buttons */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            બધા ({entries.length})
          </button>
          <button
            onClick={() => setStatusFilter('reading')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              statusFilter === 'reading'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            વાંચનમાં ({entries.filter(e => e.status === 'reading').length})
          </button>
          <button
            onClick={() => setStatusFilter('returned')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              statusFilter === 'returned'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            પરત મળેલ ({entries.filter(e => e.status === 'returned').length})
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              statusFilter === 'overdue'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            મુદત વીતી ({entries.filter(e => e.status === 'reading' && isDateOverdue(e.expectedReturnDate)).length})
          </button>
        </div>
      </div>

      {/* Register Table View */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16 px-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            કોઈ નોંધ મળી નથી
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
            {searchTerm
              ? `"${searchTerm}" માટે કોઈ વિદ્યાર્થી કે પુસ્તક મળ્યું નથી.`
              : 'આ ફિલ્ટર મુજબ હાલ કોઈ પુસ્તક વિતરણ નોંધાયેલ નથી.'}
          </p>
          <button
            onClick={onOpenIssueModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-lg shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>નવું પુસ્તક વિતરણ નોંધો</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/75 text-slate-600 text-xs font-semibold select-none">
                <th className="py-3 px-3 w-14 text-center">ક્રમ</th>
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>આપ્યા તારીખ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>વિદ્યાર્થીનું નામ (બાળક)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('std')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 whitespace-nowrap text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ધોરણ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">પુસ્તકનું નામ અને ક્રમાંક</th>
                <th className="py-3 px-3 whitespace-nowrap">પરત આપવાની તારીખ</th>
                <th className="py-3 px-3 whitespace-nowrap">પરત મળ્યા તારીખ</th>
                <th className="py-3 px-3 whitespace-nowrap text-center">વાંચન સ્થિતિ</th>
                <th className="py-3 px-3 whitespace-nowrap text-center">બાળક પ્રતિભાવ</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">ક્રિયાઓ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredEntries.map((entry, index) => {
                const isOverdue = entry.status === 'reading' && isDateOverdue(entry.expectedReturnDate);
                const { days, isOverdue: over } = getDaysRemainingOrOverdue(entry.expectedReturnDate);

                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-amber-50/40 transition-colors group"
                  >
                    {/* રજીસ્ટર ક્રમ */}
                    <td className="py-3 px-3 text-center font-mono text-xs text-slate-500 tabular-nums">
                      {toGujaratiNum(entry.srNo || index + 1)}
                    </td>

                    {/* આપ્યા તારીખ (Issue Date) */}
                    <td className="py-3 px-3 whitespace-nowrap text-xs font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatDateShort(entry.issueDate)}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5 font-normal">
                        {formatDateGujarati(entry.issueDate, false)}
                      </span>
                    </td>

                    {/* વિદ્યાર્થીનું નામ & ફોટો */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <StudentAvatar
                          photoUrl={entry.studentPhoto}
                          name={entry.studentName}
                          rollNo={entry.rollNo}
                          standard={entry.standard}
                          size="sm"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 leading-snug">
                            {entry.studentName}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>હાજરી નં: <strong className="font-mono text-slate-700">{toGujaratiNum(entry.rollNo)}</strong></span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ધોરણ */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded">
                        ધોરણ {toGujaratiNum(entry.standard)}
                      </span>
                    </td>

                    {/* પુસ્તકનું નામ અને ક્રમાંક */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 line-clamp-1" title={entry.bookTitle}>
                        {entry.bookTitle}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[11px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                          {entry.bookNo}
                        </span>
                        <span>·</span>
                        <span className="text-slate-500">{entry.category}</span>
                      </div>
                    </td>

                    {/* પરત કરવાની તારીખ (Expected Date) */}
                    <td className="py-3 px-3 whitespace-nowrap text-xs">
                      <div className="font-mono font-medium text-slate-800">
                        {formatDateShort(entry.expectedReturnDate)}
                      </div>
                      {entry.status === 'reading' && (
                        <div className="mt-0.5">
                          {isOverdue ? (
                            <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {toGujaratiNum(days)} દિવસ મોડું
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500">
                              {toGujaratiNum(days)} દિવસ બાકી
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* પરત મળ્યા તારીખ (Actual Return Date) */}
                    <td className="py-3 px-3 whitespace-nowrap text-xs">
                      {entry.actualReturnDate ? (
                        <div className="text-emerald-800 font-medium font-mono">
                          {formatDateShort(entry.actualReturnDate)}
                        </div>
                      ) : (
                        <span className="text-amber-700/80 font-medium text-xs">
                          હાલ વાંચનમાં છે
                        </span>
                      )}
                    </td>

                    {/* વાંચન સ્થિતિ (Status) */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {entry.status === 'returned' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>પરત મેળવેલ</span>
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>મુદત વીતી ગઈ</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          <span>વાંચનમાં આપેલ</span>
                        </span>
                      )}
                    </td>

                    {/* બાળકનો પ્રતિભાવ / રેટિંગ */}
                    <td className="py-3 px-3 text-center max-w-[160px]">
                      {entry.rating ? (
                        <div>
                          <div className="flex items-center justify-center gap-0.5 text-amber-500 mb-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= (entry.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          {entry.feedback && (
                            <p className="text-[11px] text-slate-600 truncate italic" title={entry.feedback}>
                              "{entry.feedback}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>

                    {/* ક્રિયાઓ (Actions) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {entry.status === 'reading' && (
                          <button
                            onClick={() => onMarkReturn(entry)}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors shadow-2xs flex items-center gap-1"
                            title="પુસ્તક પરત મેળવ્યું તરીકે નોંધો"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>પરત મેળવ્યું</span>
                          </button>
                        )}

                        <button
                          onClick={() => onEditEntry(entry)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                          title="સુધારો કરો"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="નોંધ કાઢી નાખો"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          કુલ પ્રદર્શિત નોંધો: <strong className="font-mono text-slate-700">{toGujaratiNum(filteredEntries.length)}</strong>
          {selectedStandard !== 'all' && <span> (ધોરણ {toGujaratiNum(selectedStandard)})</span>}
        </div>
        <div className="text-[11px] text-slate-400">
          * નિયમ મુજબ પુસ્તક આપ્યા તારીખથી સામાન્ય રીતે ૭ દિવસમાં પરત મેળવવાનું રહે છે.
        </div>
      </div>
    </div>
  );
};
