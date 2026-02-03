
import React from 'react';
import { Learner } from '../types';
import { MoreVertical, Filter, Plus, Download, X, Trash2, History, Clock } from 'lucide-react';

interface LearnerDatabaseProps {
  learners: Learner[];
  onAddLearner: (learner: Learner) => void;
  onDeleteLearner: (id: string) => void;
}

const LearnerDatabase: React.FC<LearnerDatabaseProps> = ({ learners, onAddLearner, onDeleteLearner }) => {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [historyLearner, setHistoryLearner] = React.useState<Learner | null>(null);
  const [newLearner, setNewLearner] = React.useState<Partial<Learner>>({
    name: '',
    age: 0,
    gender: 'Boy',
    group: 'Babies',
    status: 'active'
  });

  const handleExportCSV = () => {
    if (learners.length === 0) {
      alert("No learners to export.");
      return;
    }

    const headers = ['Name', 'Age', 'Gender', 'Group', 'Joined Date', 'Status'];
    const rows = learners.map(l => [
      l.name,
      l.age,
      l.gender,
      l.group,
      l.joinedDate,
      l.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mmatsatsi_learners_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const learner: Learner = {
      id: Math.random().toString(36).substr(2, 9),
      name: newLearner.name || 'Unknown',
      age: Number(newLearner.age) || 0,
      gender: (newLearner.gender as any) || 'Boy',
      group: newLearner.group || 'Babies',
      joinedDate: today,
      status: 'active',
      attendance: {},
      activityLog: []
    };
    onAddLearner(learner);
    setShowAddModal(false);
    setNewLearner({ name: '', age: 0, gender: 'Boy', group: 'Babies' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Learner Registry</h1>
          <p className="text-slate-500 mt-1">Creche Database for Babies, Toddlers, and Grade R.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download size={18} /> Export List
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Add New Learner
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">View By:</span>
            <button className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded-md">All Groups</button>
            <button className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded-md">Babies</button>
            <button className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded-md">Toddlers</button>
          </div>
          <span className="text-xs text-slate-400 font-bold">{learners.length} Total Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Learner</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Age</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Group</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {learners.map((learner) => (
                <tr key={learner.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                        {learner.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{learner.name}</p>
                        <p className="text-xs text-slate-400">Joined: {learner.joinedDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{learner.age} Years</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${learner.gender === 'Boy' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                      {learner.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-semibold">{learner.group}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setHistoryLearner(learner)}
                        title="View History"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      ><History size={18} /></button>
                      <button 
                        onClick={() => onDeleteLearner(learner.id)}
                        title="Delete Learner Record"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      ><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {learners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-slate-400 font-medium italic">No learners found. Add one to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <h2 className="text-xl font-bold">Add New Learner</h2>
              <button onClick={() => setShowAddModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input 
                  autoFocus
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newLearner.name}
                  onChange={e => setNewLearner({...newLearner, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Age</label>
                  <input 
                    type="number"
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 border-slate-200 outline-none" 
                    value={newLearner.age}
                    onChange={e => setNewLearner({...newLearner, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Gender</label>
                  <select 
                    className="w-full p-3 rounded-xl bg-slate-50 border-slate-200 outline-none"
                    value={newLearner.gender}
                    onChange={e => setNewLearner({...newLearner, gender: e.target.value as any})}
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Group Assignment</label>
                <select 
                  className="w-full p-3 rounded-xl bg-slate-50 border-slate-200 outline-none"
                  value={newLearner.group}
                  onChange={e => setNewLearner({...newLearner, group: e.target.value})}
                >
                  <option value="Babies">Babies (0-1yr)</option>
                  <option value="Toddlers">Toddlers (2-3yrs)</option>
                  <option value="Grade R">Grade R (4-5yrs)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl mt-4 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                Register Learner
              </button>
            </form>
          </div>
        </div>
      )}

      {historyLearner && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
              <div className="flex items-center gap-3">
                <History className="text-indigo-400" />
                <h2 className="text-xl font-bold">Activity History: {historyLearner.name}</h2>
              </div>
              <button onClick={() => setHistoryLearner(null)} className="hover:bg-slate-700 p-1 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar space-y-6">
              {historyLearner.activityLog && historyLearner.activityLog.length > 0 ? (
                <div className="relative border-l-2 border-slate-100 ml-4 pl-8 space-y-8">
                  {historyLearner.activityLog.map((log, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white"></div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <Clock size={12} />
                        {new Date(log.date).toLocaleString()}
                      </div>
                      <p className="text-slate-700 font-semibold">{log.action}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                   <p className="text-slate-400 italic">No past activity recorded beyond registration.</p>
                   <p className="text-xs text-slate-300 mt-2">Registration Date: {historyLearner.joinedDate}</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setHistoryLearner(null)}
                className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all"
              >Close History</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerDatabase;
