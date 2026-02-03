
import React from 'react';
import { Learner } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, X, Clock, GraduationCap } from 'lucide-react';

interface AttendanceTrackerProps {
  learners: Learner[];
  onUpdate: (learnerId: string, status: 'present' | 'absent' | 'late') => void;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ learners, onUpdate }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const statusCounts = learners.reduce((acc, l) => {
    const todayStr = currentDate.toISOString().split('T')[0];
    const status = l.attendance[todayStr];
    if (status) acc[status]++;
    return acc;
  }, { present: 0, absent: 0, late: 0 });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-top-4 duration-500 pb-10">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              Attendance Register <CalendarIcon className="text-indigo-600" />
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 font-medium">Tracking learner presence.</p>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1">
                <GraduationCap size={12} /> Teacher: Miss MM Ramokolo
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-3xl border border-slate-100">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}
              className="p-2 hover:bg-white rounded-2xl shadow-sm transition-all"
            ><ChevronLeft size={20} /></button>
            <span className="font-bold text-slate-700 min-w-[200px] text-center">{formatDate(currentDate)}</span>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}
              className="p-2 hover:bg-white rounded-2xl shadow-sm transition-all"
            ><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="grid gap-3">
          {learners.length > 0 ? learners.map((learner) => {
            const todayStr = currentDate.toISOString().split('T')[0];
            const currentStatus = learner.attendance[todayStr];

            return (
              <div key={learner.id} className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 hover:bg-slate-50/50 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-xl shadow-inner border border-indigo-100">
                    {learner.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-lg">{learner.name}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{learner.group}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {[
                    { type: 'present' as const, icon: <Check size={20} />, label: 'Present', color: 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200', active: 'bg-emerald-600 text-white' },
                    { type: 'late' as const, icon: <Clock size={20} />, label: 'Late', color: 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200', active: 'bg-amber-500 text-white' },
                    { type: 'absent' as const, icon: <X size={20} />, label: 'Absent', color: 'hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200', active: 'bg-rose-600 text-white' }
                  ].map((btn) => (
                    <button 
                      key={btn.type}
                      onClick={() => onUpdate(learner.id, btn.type)}
                      className={`flex flex-col items-center gap-1 w-20 p-3 rounded-2xl border transition-all active:scale-95 ${
                        currentStatus === btn.type 
                          ? btn.active 
                          : `bg-white border-slate-100 text-slate-400 ${btn.color}`
                      }`}
                    >
                      {btn.icon}
                      <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
               <p className="text-slate-400 font-bold">No learners in the database yet.</p>
               <p className="text-slate-300 text-sm">Add learners in the Learner Registry tab.</p>
            </div>
          )}
        </div>

        <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex gap-12">
            <div>
              <p className="text-4xl font-black text-emerald-500 leading-none">{statusCounts.present}</p>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Present</p>
            </div>
            <div>
              <p className="text-4xl font-black text-rose-500 leading-none">{statusCounts.absent}</p>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Absent</p>
            </div>
            <div>
              <p className="text-4xl font-black text-amber-500 leading-none">{statusCounts.late}</p>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Late</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1">
            SUBMIT FOR TODAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
