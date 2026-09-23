import React from 'react';
import { RegisterEntry, Standard, Student } from '../types/library';
import { toGujaratiNum } from '../utils/dateHelpers';
import { Sparkles, Award, Star, BookOpenCheck, Trophy, HeartHandshake } from 'lucide-react';
import { StudentAvatar } from './StudentAvatar';

interface ReadingStarsViewProps {
  students: Student[];
  entries: RegisterEntry[];
  onOpenCertificate: (student: Student, bookCount: number) => void;
}

export const ReadingStarsView: React.FC<ReadingStarsViewProps> = ({
  students,
  entries,
  onOpenCertificate,
}) => {
  // Count books read per student
  const studentReadMap = new Map<string, { count: number; student: Student }>();

  students.forEach(st => {
    studentReadMap.set(st.id, { count: st.totalBooksRead || 0, student: st });
  });

  entries.forEach(e => {
    if (e.status === 'returned') {
      const existing = studentReadMap.get(e.studentId);
      if (existing) {
        existing.count += 1;
      }
    }
  });

  const sortedReaders = Array.from(studentReadMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Standard-wise breakdown
  const stdStats: Record<Standard, { totalIssues: number; returned: number; active: number }> = {
    '1': { totalIssues: 0, returned: 0, active: 0 },
    '2': { totalIssues: 0, returned: 0, active: 0 },
    '3': { totalIssues: 0, returned: 0, active: 0 },
    '4': { totalIssues: 0, returned: 0, active: 0 },
    '5': { totalIssues: 0, returned: 0, active: 0 },
    '6': { totalIssues: 0, returned: 0, active: 0 },
    '7': { totalIssues: 0, returned: 0, active: 0 },
    '8': { totalIssues: 0, returned: 0, active: 0 },
  };

  entries.forEach(e => {
    if (stdStats[e.standard]) {
      stdStats[e.standard].totalIssues += 1;
      if (e.status === 'returned') {
        stdStats[e.standard].returned += 1;
      } else {
        stdStats[e.standard].active += 1;
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm border border-amber-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-2">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>શ્રેષ્ઠ વાચક સન્માન (Reading Excellence)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            ધારિયા પ્રાથમિક શાળાના 'વાચનવીર' બાળકો
          </h2>
          <p className="text-amber-100 text-sm max-w-2xl leading-relaxed">
            "વાંચશે ગુજરાત તો આગળ વધશે ગુજરાત" - પુસ્તકો બાળકના જીવન ઘડતરના સાચા સાથી છે. 
            સૌથી વધુ પુસ્તકો વાંચનાર ઉત્સાહી બાળકોને પ્રોત્સાહિત કરો અને વાચન પ્રમાણપત્ર એનાયત કરો.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center">
            <span className="text-xs text-amber-200 block">સૌથી વધુ વાંચેલ પુસ્તકો</span>
            <span className="text-3xl font-bold text-amber-300 font-mono">
              {toGujaratiNum(sortedReaders[0]?.count || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Top Readers Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>શ્રેષ્ઠ વાચક વિદ્યાર્થીઓ (ટોપ ૧૦ લીડરબોર્ડ)</span>
          </h3>
          <span className="text-xs text-slate-500">
            ધોરણ ૧ થી ૮ સમગ્ર શાળા
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedReaders.map((item, idx) => (
            <div
              key={item.student.id}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                idx === 0
                  ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/60'
                  : idx < 3
                  ? 'bg-amber-50/30 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <StudentAvatar
                    photoUrl={item.student.photoUrl}
                    name={item.student.name}
                    rollNo={item.student.rollNo}
                    standard={item.student.standard}
                    size="md"
                  />
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono text-[10px] absolute -bottom-1 -right-1 shadow-xs border border-white ${
                      idx === 0
                        ? 'bg-amber-600 text-white'
                        : idx === 1
                        ? 'bg-slate-400 text-white'
                        : idx === 2
                        ? 'bg-amber-800 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {toGujaratiNum(idx + 1)}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {item.student.name}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    ધોરણ {toGujaratiNum(item.student.standard)} · હાજરી નં: {toGujaratiNum(item.student.rollNo)}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                <span className="text-sm font-bold text-amber-800 font-mono block">
                  {toGujaratiNum(item.count)} પુસ્તકો
                </span>
                <button
                  onClick={() => onOpenCertificate(item.student, item.count)}
                  className="mt-1 text-[11px] text-amber-700 hover:text-amber-900 font-medium inline-flex items-center gap-1 hover:underline"
                >
                  <Award className="w-3 h-3" />
                  <span>પ્રમાણપત્ર</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard-wise Analysis (ધોરણ ૧ થી ૮ વાચન પ્રગતિ સારાંશ) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <BookOpenCheck className="w-4 h-4 text-emerald-700" />
          <span>ધોરણવાર વાચન પ્રગતિ સારાંશ (ધોરણ ૧ થી ૮)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          દરેક ધોરણમાં કેટલા પુસ્તકો અપાયા અને કેટલા પરત મળ્યા તેની સ્થિતિ
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {(['1', '2', '3', '4', '5', '6', '7', '8'] as Standard[]).map(std => {
            const data = stdStats[std];
            return (
              <div
                key={std}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center"
              >
                <div className="font-bold text-sm text-slate-800 mb-1">
                  ધોરણ {toGujaratiNum(std)}
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  કુલ: <strong>{toGujaratiNum(data.totalIssues)}</strong>
                </div>
                <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
                  પરત: {toGujaratiNum(data.returned)}
                </div>
                <div className="text-[11px] text-amber-700 font-mono">
                  વાંચનમાં: {toGujaratiNum(data.active)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher Guidance / Reading Tips */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
        <HeartHandshake className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <h4 className="font-bold text-sm text-amber-900">
            શિક્ષકો માટે વાચન ઉત્સવ સૂચનો:
          </h4>
          <p>
            ૧. દર શનિવારે પ્રાર્થનાસભામાં કોઈ એક બાળકે વાંચેલા પુસ્તક વિશે બે મિનિટ વર્ગ સમક્ષ બોલવાનો મોકો આપો.
          </p>
          <p>
            ૨. ધોરણ ૧ અને ૨ ના બાળકોને ચિત્રવાર્તાઓ આપી ચિત્ર પરથી વાર્તા કહેવા પ્રોત્સાહિત કરો.
          </p>
          <p>
            ૩. મહિનાના અંતે જે વિદ્યાર્થીએ સૌથી વધુ પુસ્તકો પૂર્ણ કર્યા હોય તેને શાળા તરફથી "વાચન રત્ન" પ્રમાણપત્ર આપો.
          </p>
        </div>
      </div>
    </div>
  );
};
