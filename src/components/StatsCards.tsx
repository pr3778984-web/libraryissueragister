import React from 'react';
import { BookOpenCheck, Bookmark, CheckCircle2, AlertCircle } from 'lucide-react';
import { toGujaratiNum } from '../utils/dateHelpers';

interface StatsCardsProps {
  totalIssues: number;
  activeReading: number;
  returnedCount: number;
  overdueCount: number;
  availableBooksCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalIssues,
  activeReading,
  returnedCount,
  overdueCount,
  availableBooksCount,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. કુલ ઇસ્યુ રજીસ્ટર */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            કુલ વિતરણ નોંધણી
          </span>
          <Bookmark className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {toGujaratiNum(totalIssues)}
          </span>
          <span className="text-xs text-slate-400 font-mono">({totalIssues})</span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
          ધોરણ ૧ થી ૮ ની કુલ નોંધ
        </p>
      </div>

      {/* 2. હાલ વાંચનમાં આપેલ */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-amber-800">
            હાલ બાળકો પાસે (વાંચનમાં)
          </span>
          <BookOpenCheck className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-amber-700 font-mono tabular-nums">
            {toGujaratiNum(activeReading)}
          </span>
          <span className="text-xs text-amber-600/70 font-mono">({activeReading})</span>
        </div>
        <p className="text-[11px] sm:text-xs text-amber-700/80 mt-1">
          પરત લેવાના બાકી પુસ્તકો
        </p>
      </div>

      {/* 3. પરત મેળવેલ */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-emerald-800">
            વાંચીને પરત મેળવેલ
          </span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono tabular-nums">
            {toGujaratiNum(returnedCount)}
          </span>
          <span className="text-xs text-emerald-600/70 font-mono">({returnedCount})</span>
        </div>
        <p className="text-[11px] sm:text-xs text-emerald-700/80 mt-1">
          સફળતાપૂર્વક વાંચન પૂર્ણ
        </p>
      </div>

      {/* 4. મુદત વીતી ગઈ અથવા ઉપલબ્ધ */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-slate-600">
            {overdueCount > 0 ? 'મુદત વીતી ગઈ (Overdue)' : 'પુસ્તકાલય ઉપલબ્ધ'}
          </span>
          {overdueCount > 0 ? (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          ) : (
            <span className="text-xs font-mono text-slate-400">સ્ટોક</span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${
              overdueCount > 0 ? 'text-rose-600' : 'text-slate-800'
            }`}
          >
            {overdueCount > 0 ? toGujaratiNum(overdueCount) : toGujaratiNum(availableBooksCount)}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ({overdueCount > 0 ? overdueCount : availableBooksCount})
          </span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
          {overdueCount > 0 ? 'તાત્કાલિક પરત મેળવવા જરૂરી' : 'વાંચન માટે ઉપલબ્ધ પુસ્તકો'}
        </p>
      </div>
    </div>
  );
};
