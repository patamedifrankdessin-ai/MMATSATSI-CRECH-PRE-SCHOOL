
import React from 'react';
import { Learner, ScheduleEvent, Document } from '../types';
import { Users, FileText, Calendar, ShieldCheck, Clock, ArrowRight, Shield, Download, HardDrive, Bot, Phone, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  learners: Learner[];
  documents: Document[];
  schedule: ScheduleEvent[];
  onEmailReport: () => void;
  onDownloadBackup: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ learners, documents, schedule, onEmailReport, onDownloadBackup }) => {
  const [liveDateTime, setLiveDateTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setLiveDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = liveDateTime.toLocaleDateString('en-ZA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeString = liveDateTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const stats = [
    { label: 'Total Learners', value: learners.length, icon: <Users className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'School Docs', value: documents.length, icon: <FileText className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Today Events', value: schedule.length, icon: <Calendar className="text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Data Security', value: 'High', icon: <HardDrive className="text-indigo-600" />, bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 relative shrink-0">
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                <circle cx="50" cy="50" r="48" fill="#ef4444" />
                <circle cx="50" cy="48" r="10" fill="#fbbf24" />
                <g stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round">
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30) - 90;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 50 + 12 * Math.cos(rad);
                    const y1 = 48 + 12 * Math.sin(rad);
                    const x2 = 50 + 22 * Math.cos(rad);
                    const y2 = 48 + 22 * Math.sin(rad);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                  })}
                </g>
                <g stroke="#fbbf24" strokeWidth="1.5" fill="none">
                  <path d="M35 55 Q50 50 65 55" />
                  <path d="M30 60 Q50 55 70 60" />
                </g>
                <defs>
                  <path id="dashArc" d="M 15,55 A 35,35 0 0,1 85,55" />
                </defs>
                <text fill="#fbbf24" style={{ fontSize: '8px', fontWeight: '900', letterSpacing: '0.05em' }}>
                  <textPath xlinkHref="#dashArc" startOffset="50%" textAnchor="middle">
                    MMATSATSI CRECHE
                  </textPath>
                </text>
                <text x="50" y="78" fill="#fbbf24" textAnchor="middle" style={{ fontSize: '9px', fontWeight: '900' }}>
                  & PRE-SCHOOL
                </text>
                <text x="50" y="90" fill="#fbbf24" textAnchor="middle" style={{ fontSize: '8px', fontWeight: '800' }}>
                  073 432 6896
                </text>
              </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Free Mode</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">Welcome, Mrs MJ Ramokolo</h1>
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-slate-500 font-bold text-lg leading-none">MMATSATSI CRECHE & PRE-SCHOOL</p>
              <p className="text-indigo-600 font-black text-sm flex items-center gap-2">
                <GraduationCap size={16} /> Lead Teacher: Miss MM Ramokolo
              </p>
            </div>
            <p className="text-rose-600 text-sm font-black flex items-center gap-2 mt-2 bg-rose-50 w-fit px-3 py-1 rounded-full border border-rose-100">
              <Phone size={14} /> 073 432 6896
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 shadow-sm inline-flex items-center gap-2">
            <Calendar size={14} /> System Date: {dateString}
          </p>
          <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm inline-flex items-center gap-2">
            <Clock size={14} /> Live Time: {timeString}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg">
              <ShieldCheck size={32} />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-800">Information Safety Protocol</h3>
              <p className="text-slate-500 text-sm font-medium">Your recordings are automatically saved. Download a copy anytime to keep them safe forever.</p>
           </div>
        </div>
        <button 
          onClick={onDownloadBackup}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Download size={18} /> Download System Backup
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Registration Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Learners', count: learners.length }, { name: 'Documents', count: documents.length }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
           <Bot size={48} className="text-indigo-600 animate-pulse" />
           <h3 className="font-black text-slate-800">Staff & System Mode</h3>
           <p className="text-sm text-slate-500">The system is supervised by Mrs MJ Ramokolo and Conducted by Miss MM Ramokolo. All information stays on this device unless backed up.</p>
           <button onClick={onEmailReport} className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
             Email Daily Report <ArrowRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
