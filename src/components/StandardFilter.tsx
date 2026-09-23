import React from 'react';
import { Standard } from '../types/library';
import { toGujaratiNum } from '../utils/dateHelpers';
import { Users, Plus } from 'lucide-react';

interface StandardFilterProps {
  selectedStandard: Standard | 'all';
  onSelectStandard: (std: Standard | 'all') => void;
  countsByStandard: Record<Standard | 'all', number>;
  onManageStudents?: (std: Standard | 'all') => void;
}

export const StandardFilter: React.FC<StandardFilterProps> = ({
  selectedStandard,
  onSelectStandard,
  countsByStandard,
  onManageStudents,
}) => {
  const standards: Array<{ key: Standard | 'all'; label: string; sub: string }> = [
    { key: 'all', label: 'બધા ધોરણ', sub: '૧-૮' },
    { key: '1', label: 'ધોરણ ૧', sub: 'બાલવાટિકા/૧' },
    { key: '2', label: 'ધોરણ ૨', sub: 'પ્રાથમિક' },
    { key: '3', label: 'ધોરણ ૩', sub: 'પ્રાથમિક' },
    { key: '4', label: 'ધોરણ ૪', sub: 'પ્રાથમિક' },
    { key: '5', label: 'ધોરણ ૫', sub: 'ઉચ્ચ પ્રાથમિક' },
    { key: '6', label: 'ધોરણ ૬', sub: 'ઉચ્ચ પ્રાથમિક' },
    { key: '7', label: 'ધોરણ ૭', sub: 'ઉચ્ચ પ્રાથમિક' },
    { key: '8', label: 'ધોરણ ૮', sub: 'ઉચ્ચ પ્રાથમિક' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 mb-6 shadow-xs space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">
            ધોરણ પસંદ કરો (ધોરણ ૧ થી ૮ ફિલ્ટર):
          </span>
          <span className="text-xs text-slate-400">
            કુલ પસંદગી મુજબ નોંધ: <strong className="text-slate-700 font-mono">{toGujaratiNum(countsByStandard[selectedStandard])}</strong>
          </span>
        </div>

        {onManageStudents && (
          <button
            onClick={() => onManageStudents(selectedStandard)}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg border border-amber-200 transition-colors flex items-center gap-1.5"
            title="ધોરણ મુજબ બાળકોના નામ ઉમેરો અથવા દૂર કરો"
          >
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {selectedStandard === 'all'
                ? 'બાળકોના નામ મેનેજ કરો (ઉમેરો / દૂર કરો)'
                : `ધોરણ ${toGujaratiNum(selectedStandard)} ના બાળકો મેનેજ કરો`}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
        {standards.map(item => {
          const isSelected = selectedStandard === item.key;
          const count = countsByStandard[item.key] || 0;
          return (
            <button
              key={item.key}
              onClick={() => onSelectStandard(item.key)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-amber-700 text-white shadow-xs font-bold ring-2 ring-amber-700/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200/80'
              }`}
            >
              <span className="text-xs sm:text-sm whitespace-nowrap">{item.label}</span>
              <span
                className={`text-[11px] font-mono mt-0.5 ${
                  isSelected ? 'text-amber-100' : 'text-slate-500'
                }`}
              >
                {toGujaratiNum(count)} નોંધ
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
