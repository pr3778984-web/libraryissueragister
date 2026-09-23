import React from 'react';
import { BookOpen, Plus, Printer, Download, Sparkles, Users, Library, BookMarked } from 'lucide-react';

interface NavbarProps {
  currentView: 'register' | 'books' | 'students' | 'stars';
  onViewChange: (view: 'register' | 'books' | 'students' | 'stars') => void;
  onOpenIssueModal: () => void;
  onOpenPrintModal: () => void;
  onExportCSV: () => void;
  activeReadingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenIssueModal,
  onOpenPrintModal,
  onExportCSV,
  activeReadingCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                ધારિયા પ્રાથમિક શાળા
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                તા. હાલોલ, જિ. પંચમહાલ · પુસ્તકાલય રજીસ્ટર
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onViewChange('register')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'register'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>વાંચન રજીસ્ટર</span>
              {activeReadingCount > 0 && (
                <span className="ml-1 text-[11px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono font-medium">
                  {activeReadingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('books')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'books'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>પુસ્તક ભંડાર</span>
            </button>

            <button
              onClick={() => onViewChange('students')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'students'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>વિદ્યાર્થીઓ (ધો. ૧-૮)</span>
            </button>

            <button
              onClick={() => onViewChange('stars')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentView === 'stars'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>વાચન પ્રેરણા</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPrintModal}
              title="રજીસ્ટર પ્રિન્ટ કરો"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onExportCSV}
              title="Excel / CSV ડાઉનલોડ"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenIssueModal}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>પુસ્તક આપો</span>
            </button>
          </div>
        </div>

        {/* Mobile View Navigation Strip */}
        <div className="flex md:hidden border-t border-slate-100 py-2 gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onViewChange('register')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              currentView === 'register' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
            }`}
          >
            વાંચન રજીસ્ટર ({activeReadingCount})
          </button>
          <button
            onClick={() => onViewChange('books')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              currentView === 'books' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
            }`}
          >
            પુસ્તકો
          </button>
          <button
            onClick={() => onViewChange('students')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              currentView === 'students' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
            }`}
          >
            વિદ્યાર્થીઓ (ધો. ૧-૮)
          </button>
          <button
            onClick={() => onViewChange('stars')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              currentView === 'stars' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
            }`}
          >
            વાચન પ્રેરણા
          </button>
        </div>
      </div>
    </header>
  );
};
