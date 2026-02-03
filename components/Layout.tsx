
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { View, Notification } from '../types';
import { Bell, Menu, Calendar as CalIcon, X, CheckCircle, AlertCircle, Wifi, WifiOff, Shield, HardDrive, Phone } from 'lucide-react';

// Custom Logo Component based on the provided image
const MmatsatsiLogo = ({ size = 60, showText = true }: { size?: number, showText?: boolean }) => (
  <div className="flex flex-col items-center">
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Red circle background mimicking the shirt color */}
        <circle cx="50" cy="50" r="48" fill="#ef4444" />
        
        {/* Sun and rays in Yellow - Recreating the rising sun from photo */}
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
        
        {/* Horizon lines from the sun symbol */}
        <g stroke="#fbbf24" strokeWidth="1.5" fill="none">
          <path d="M35 55 Q50 50 65 55" />
          <path d="M30 60 Q50 55 70 60" />
        </g>

        {/* Arched Text Path */}
        <defs>
          <path id="textArc" d="M 15,55 A 35,35 0 0,1 85,55" />
        </defs>
        
        {/* Arched MMATSATSI CRECHE Text */}
        <text fill="#fbbf24" style={{ fontSize: '8px', fontWeight: '900', letterSpacing: '0.05em' }}>
          <textPath xlinkHref="#textArc" startOffset="50%" textAnchor="middle">
            MMATSATSI CRECHE
          </textPath>
        </text>

        {/* & PRE-SCHOOL text */}
        <text x="50" y="78" fill="#fbbf24" textAnchor="middle" style={{ fontSize: '9px', fontWeight: '900' }}>
          & PRE-SCHOOL
        </text>

        {/* Phone number text at the bottom */}
        <text x="50" y="90" fill="#fbbf24" textAnchor="middle" style={{ fontSize: '8px', fontWeight: '800' }}>
          073 432 6896
        </text>
      </svg>
    </div>
    {showText && (
      <div className="mt-2 text-center flex flex-col items-center">
        <span className="font-black text-[10px] tracking-tight text-slate-800 uppercase leading-none">MMATSATSI CRECHE</span>
        <span className="font-bold text-[8px] text-slate-500 uppercase leading-none mt-1">Professional Portal</span>
      </div>
    )}
  </div>
);

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  isOnline: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, notifications, setNotifications, isOnline }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const dateString = currentTime.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-24'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col z-20`}>
        <div className="p-4 border-b border-slate-50 flex flex-col items-center justify-center">
          <MmatsatsiLogo size={isSidebarOpen ? 80 : 50} showText={isSidebarOpen} />
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className={activeView === item.id ? 'text-indigo-600' : 'text-slate-400'}>
                {item.icon}
              </span>
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
           <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isSidebarOpen && (isOnline ? 'Online' : 'Offline')}
           </div>
           <div className="px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
              <Shield size={14} />
              {isSidebarOpen && 'FREE MODE'}
           </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center gap-4 px-4 py-2 w-full text-slate-500 hover:text-indigo-600">
            <Menu size={20} />
            {isSidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <CalIcon size={16} className="text-indigo-500" />
                <span className="text-sm font-bold text-slate-700">{dateString}</span>
             </div>
             <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-tighter shadow-sm border border-emerald-200">
               <HardDrive size={12} className="animate-pulse" />
               Recorded
             </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
            >
              <Bell size={20} className={unreadCount > 0 ? 'animate-tada text-indigo-600' : ''} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Mrs MJ Ramokolo</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Principal</p>
              </div>
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=MJ" 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-slate-200 shadow-sm"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {children}
        </div>
      </main>

      {isNotifOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs" onClick={() => setIsNotifOpen(false)}></div>
          <div className="relative w-80 bg-white shadow-2xl h-full animate-in slide-in-from-right duration-300 border-l border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <h3 className="font-black flex items-center gap-2">
                <Bell size={20} /> NOTIFICATIONS
              </h3>
              <button onClick={() => setIsNotifOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {notifications.length > 0 ? (
                <>
                  <div className="flex justify-end">
                    <button onClick={markAllAsRead} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Mark all as read</button>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-4 rounded-2xl border ${n.read ? 'bg-white border-slate-100' : 'bg-indigo-50 border-indigo-100 shadow-sm'} relative group`}>
                      <button onClick={() => removeNotif(n.id)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                      <div className="flex gap-3">
                        <div className={`mt-1 ${n.type === 'warning' ? 'text-amber-500' : 'text-indigo-500'}`}>
                          {n.type === 'warning' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-tight">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{n.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <Bell size={48} className="mb-4 opacity-20" />
                  <p className="font-bold">No new notifications</p>
                  <p className="text-sm">Robot system is currently quiet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes tada {
          0% { transform: scale(1); }
          10%, 20% { transform: scale(0.9) rotate(-3deg); }
          30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
          40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .animate-tada {
          animation: tada 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default Layout;
