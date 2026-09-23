import React, { useState } from 'react';
import { Book } from '../types/library';
import { toGujaratiNum } from '../utils/dateHelpers';
import { Plus, Search, BookOpen, Check, Clock, Bookmark } from 'lucide-react';

interface BookCatalogViewProps {
  books: Book[];
  onAddNewBook: (book: Omit<Book, 'id' | 'isAvailable'>) => void;
  onQuickIssueBook: (book: Book) => void;
}

export const BookCatalogView: React.FC<BookCatalogViewProps> = ({
  books,
  onAddNewBook,
  onQuickIssueBook,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Book form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [bookNo, setBookNo] = useState('');
  const [category, setCategory] = useState('બાળવાર્તા');
  const [standardRange, setStandardRange] = useState('ધોરણ ૩-૫');
  const [totalCopies, setTotalCopies] = useState(1);

  const categories = ['all', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = books.filter(b => {
    const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddNewBook({
      title: title.trim(),
      author: author.trim() || 'અજ્ઞાત લેખક',
      bookNo: bookNo.trim() || `PUSTAK-${books.length + 101}`,
      category,
      standardRange,
      totalCopies: Number(totalCopies) || 1,
    });

    setTitle('');
    setAuthor('');
    setBookNo('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <span>પુસ્તકાલય પુસ્તક ભંડાર (Book Collection)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            શ્રી ધારિયા પ્રાથમિક શાળાના ઉપલબ્ધ પુસ્તકો · કુલ સંગ્રહ: <strong className="font-mono text-slate-800">{toGujaratiNum(books.length)}</strong> પુસ્તકો
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>નવું પુસ્તક ઉમેરો</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="પુસ્તક, લેખક કે ક્રમાંક શોધો..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-amber-600"
          />
        </div>

        {/* Category Pills/Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-lg">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'બધી શ્રેણી' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map(book => (
          <div
            key={book.id}
            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-amber-300 hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {book.bookNo}
                </span>
                <span
                  className={`text-[11px] font-semibold flex items-center gap-1 ${
                    book.isAvailable
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {book.isAvailable ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>ઉપલબ્ધ (Stock)</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>હાલ વાંચનમાં આપેલ</span>
                    </>
                  )}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2">
                {book.title}
              </h3>

              <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                <span>લેખક: <strong className="text-slate-700">{book.author}</strong></span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>શ્રેણી: <strong className="text-slate-700">{book.category}</strong></span>
                <span>·</span>
                <span>{book.standardRange}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                કુલ નકલ: {toGujaratiNum(book.totalCopies)}
              </span>
              <button
                onClick={() => onQuickIssueBook(book)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>વિદ્યાર્થીને આપો</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Book Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              નવું પુસ્તક ભંડારમાં ઉમેરો
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ધારિયા પ્રાથમિક શાળા પુસ્તકાલય સંગ્રહ
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  પુસ્તકનું નામ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="દા.ત. પંચતંત્રની વાતો"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    લેખકનું નામ
                  </label>
                  <input
                    type="text"
                    placeholder="લેખક"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    પુસ્તક ક્રમાંક
                  </label>
                  <input
                    type="text"
                    placeholder="દા.ત. PUSTAK-113"
                    value={bookNo}
                    onChange={e => setBookNo(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    શ્રેણી (Category)
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
                  >
                    <option value="ચિત્રવાર્તા">ચિત્રવાર્તા</option>
                    <option value="બોધવાર્તા">બોધવાર્તા</option>
                    <option value="બાળગીત / જોડકણાં">બાળગીત / જોડકણાં</option>
                    <option value="હાસ્ય / ચતુરાઈ કથા">હાસ્ય / ચતુરાઈ કથા</option>
                    <option value="જીવનચરિત્ર">જીવનચરિત્ર</option>
                    <option value="વિજ્ઞાન">વિજ્ઞાન</option>
                    <option value="પર્યાવરણ">પર્યાવરણ</option>
                    <option value="સામાન્ય જ્ઞાન">સામાન્ય જ્ઞાન</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    યોગ્ય ધોરણ
                  </label>
                  <select
                    value={standardRange}
                    onChange={e => setStandardRange(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
                  >
                    <option value="ધોરણ ૧-૨">ધોરણ ૧-૨</option>
                    <option value="ધોરણ ૩-૫">ધોરણ ૩-૫</option>
                    <option value="ધોરણ ૬-૮">ધોરણ ૬-૮</option>
                    <option value="ધોરણ ૧-૮">ધોરણ ૧-૮ (બધા)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  કુલ નકલો (Copies)
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalCopies}
                  onChange={e => setTotalCopies(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-amber-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg"
                >
                  સાચવો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
