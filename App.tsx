
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LearnerDatabase from './components/LearnerDatabase';
import DocumentEditor from './components/DocumentEditor';
import AttendanceTracker from './components/AttendanceTracker';
import TrashBin from './components/TrashBin';
import { View, Learner, Document, ScheduleEvent, Notification, TrashItem } from './types';
import { INITIAL_LEARNERS, INITIAL_DOCUMENTS, INITIAL_SCHEDULE } from './constants';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [activeView, setActiveView] = React.useState<View>('dashboard');
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  
  // Persistence logic for all modules
  const [learners, setLearners] = React.useState<Learner[]>(() => {
    const saved = localStorage.getItem('mmatsatsi_learners');
    return saved ? JSON.parse(saved) : INITIAL_LEARNERS;
  });

  const [documents, setDocuments] = React.useState<Document[]>(() => {
    const saved = localStorage.getItem('mmatsatsi_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [notifications, setNotifications] = React.useState<Notification[]>(() => {
    const saved = localStorage.getItem('mmatsatsi_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [schedule, setSchedule] = React.useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('mmatsatsi_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [trash, setTrash] = React.useState<TrashItem[]>(() => {
    const saved = localStorage.getItem('mmatsatsi_trash');
    return saved ? JSON.parse(saved) : [];
  });

  const [viewDate, setViewDate] = React.useState(new Date());

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Proactive "Robot" Notification Check
  React.useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newNotifications: Notification[] = [];

    const attendanceMarked = learners.some(l => l.attendance[todayStr]);
    if (!attendanceMarked && learners.length > 0) {
      const exists = notifications.some(n => n.title === 'Missing Attendance' && n.date === todayStr);
      if (!exists) {
        newNotifications.push({
          id: 'attendance-' + todayStr,
          title: 'Missing Attendance',
          message: 'The bell is ringing! Mrs MJ Ramokolo, please record today\'s learner attendance (Present/Absent/Late).',
          type: 'warning',
          date: todayStr,
          read: false
        });
      }
    }

    const lastUsed = localStorage.getItem('mmatsatsi_last_used');
    if (lastUsed !== todayStr) {
      const exists = notifications.some(n => n.title === 'Daily Reminder' && n.date === todayStr);
      if (!exists) {
        newNotifications.push({
          id: 'daily-' + todayStr,
          title: 'Daily Reminder',
          message: 'Good morning! The school day has started. Please ensure all records are kept safe today.',
          type: 'info',
          date: todayStr,
          read: false
        });
      }
      localStorage.setItem('mmatsatsi_last_used', todayStr);
    }

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  }, [learners.length, notifications.length]);

  // Persistent Storage Sync
  React.useEffect(() => {
    localStorage.setItem('mmatsatsi_learners', JSON.stringify(learners));
  }, [learners]);

  React.useEffect(() => {
    localStorage.setItem('mmatsatsi_documents', JSON.stringify(documents));
  }, [documents]);

  React.useEffect(() => {
    localStorage.setItem('mmatsatsi_notifications', JSON.stringify(notifications));
  }, [notifications]);

  React.useEffect(() => {
    localStorage.setItem('mmatsatsi_schedule', JSON.stringify(schedule));
  }, [schedule]);

  React.useEffect(() => {
    localStorage.setItem('mmatsatsi_trash', JSON.stringify(trash));
  }, [trash]);

  const handleDownloadBackup = () => {
    const data = {
      learners,
      documents,
      schedule,
      trash,
      exportedAt: new Date().toISOString(),
      school: "MMATSATSI CRECH & PRE-SCHOOL"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mmatsatsi_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateAttendance = (learnerId: string, status: 'present' | 'absent' | 'late') => {
    setLearners(prev => prev.map(l => 
      l.id === learnerId 
        ? { 
            ...l, 
            attendance: { ...l.attendance, [new Date().toISOString().split('T')[0]]: status },
            activityLog: [...l.activityLog, { date: new Date().toISOString(), action: `Attendance marked: ${status}` }]
          }
        : l
    ));
    const todayStr = new Date().toISOString().split('T')[0];
    setNotifications(prev => prev.filter(n => !(n.title === 'Missing Attendance' && n.date === todayStr)));
  };

  const handleSendEmailReport = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const todayStr = new Date().toISOString().split('T')[0];
    const presentCount = learners.filter(l => l.attendance[todayStr] === 'present').length;
    const total = learners.length;

    const prompt = `Generate a professional daily school report for MMATSATSI CRECH & PRE-SCHOOL. 
    Date: ${todayStr}
    Attendance: ${presentCount}/${total} present.
    Provide a encouraging summary for the principal.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      const emailBody = encodeURIComponent(response.text || 'Daily report content missing.');
      const mailtoLink = `mailto:patamedifrankdessin@gmail.com?subject=Daily Report - MMATSATSI CRECH - ${todayStr}&body=${emailBody}`;
      window.location.href = mailtoLink;
    } catch (e) {
      window.location.href = `mailto:patamedifrankdessin@gmail.com?subject=Daily Report&body=Daily update for ${todayStr}`;
    }
  };

  const handleAddLearner = (learner: Learner) => {
    setLearners(prev => [...prev, {
      ...learner,
      activityLog: [{ date: new Date().toISOString(), action: 'Learner registered in system' }]
    }]);
  };

  const handleDeleteLearner = (id: string) => {
    const learner = learners.find(l => l.id === id);
    if (learner && window.confirm(`Move ${learner.name} to Trash Bin?`)) {
      setTrash(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        originalId: learner.id,
        type: 'learner',
        itemData: learner,
        deletedDate: new Date().toLocaleString(),
        title: learner.name
      }, ...prev]);
      setLearners(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleSaveDocument = (doc: Document) => {
    setDocuments(prev => prev.map(d => d.id === doc.id ? doc : d));
  };

  const handleAddDocument = (doc: Document) => {
    setDocuments(prev => [...prev, doc]);
  };

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc && window.confirm(`Move "${doc.title}" to Trash Bin?`)) {
      setTrash(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        originalId: doc.id,
        type: 'document',
        itemData: doc,
        deletedDate: new Date().toLocaleString(),
        title: doc.title
      }, ...prev]);
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  // Trash Bin Operations
  const handleRestoreFromTrash = (trashItem: TrashItem) => {
    if (trashItem.type === 'learner') {
      setLearners(prev => [...prev, trashItem.itemData]);
    } else {
      setDocuments(prev => [...prev, trashItem.itemData]);
    }
    setTrash(prev => prev.filter(t => t.id !== trashItem.id));
  };

  const handlePermanentDelete = (trashId: string) => {
    if (window.confirm('WARNING: This will delete the information forever from this PC. Continue?')) {
      setTrash(prev => prev.filter(t => t.id !== trashId));
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Empty the entire Trash Bin? This removes all deleted data permanently.')) {
      setTrash([]);
    }
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarCells = [];

    for (let i = 0; i < firstDay; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="h-32 border-slate-100 border p-2 bg-slate-50/20"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;
      calendarCells.push(
        <div key={d} className={`h-32 border-slate-100 border p-4 transition-all hover:shadow-inner ${isToday ? 'bg-indigo-50/50 ring-2 ring-inset ring-indigo-200' : 'bg-white hover:bg-slate-50'}`}>
          <div className="flex justify-between items-start">
            <span className={`text-xl font-black ${isToday ? 'text-indigo-600' : 'text-slate-800'}`}>{d}</span>
          </div>
          <div className="mt-2 space-y-1">
            {schedule.filter(e => {
              const eDate = new Date(e.date);
              return eDate.getDate() === d && eDate.getMonth() === month && eDate.getFullYear() === year;
            }).map(e => (
              <div key={e.id} className="text-[10px] font-bold bg-indigo-100 text-indigo-700 p-1 rounded-md truncate">
                {e.startTime} - {e.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              School Calendar <CalendarIcon className="text-indigo-600" />
            </h1>
            <p className="text-slate-500 font-medium">Monthly Overview</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2.5 rounded-3xl border border-slate-100 shadow-xl">
            <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all active:scale-90"><ChevronLeft size={24} /></button>
            <h2 className="text-2xl font-black text-slate-800 min-w-[200px] text-center">{monthName} {year}</h2>
            <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all active:scale-90"><ChevronRight size={24} /></button>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden border-t-8 border-t-indigo-600">
          <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
            {days.map(d => (
              <div key={d} className="py-6 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarCells}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout 
      activeView={activeView} 
      onViewChange={setActiveView} 
      notifications={notifications} 
      setNotifications={setNotifications}
      isOnline={isOnline}
    >
      {activeView === 'dashboard' ? (
        <Dashboard 
          learners={learners} 
          documents={documents} 
          schedule={schedule} 
          onEmailReport={handleSendEmailReport} 
          onDownloadBackup={handleDownloadBackup}
        />
      ) : activeView === 'learners' ? (
        <LearnerDatabase 
          learners={learners} 
          onAddLearner={handleAddLearner} 
          onDeleteLearner={handleDeleteLearner}
        />
      ) : activeView === 'documents' ? (
        <DocumentEditor 
          documents={documents} 
          onSave={handleSaveDocument} 
          onAdd={handleAddDocument}
          onDelete={handleDeleteDocument}
        />
      ) : activeView === 'attendance' ? (
        <AttendanceTracker learners={learners} onUpdate={handleUpdateAttendance} />
      ) : activeView === 'trash' ? (
        <TrashBin 
          trashItems={trash} 
          onRestore={handleRestoreFromTrash} 
          onDeletePermanently={handlePermanentDelete}
          onEmptyTrash={handleEmptyTrash}
        />
      ) : renderCalendar()}
      
      <div className="fixed bottom-8 right-8 z-[100]">
        <button 
          onClick={handleSendEmailReport}
          className="group relative bg-white p-4 rounded-full shadow-2xl border border-slate-100 hover:scale-110 transition-all active:scale-95"
          title="Send Daily Status"
        >
          <Bot size={32} className="text-indigo-600 animate-bounce" />
        </button>
      </div>
    </Layout>
  );
};

export default App;
