
import React from 'react';
import { TrashItem } from '../types';
import { Trash2, RotateCcw, FileText, Users, AlertCircle, Trash } from 'lucide-react';

interface TrashBinProps {
  trashItems: TrashItem[];
  onRestore: (item: TrashItem) => void;
  onDeletePermanently: (id: string) => void;
  onEmptyTrash: () => void;
}

const TrashBin: React.FC<TrashBinProps> = ({ trashItems, onRestore, onDeletePermanently, onEmptyTrash }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Trash Bin</h1>
          <p className="text-slate-500 mt-1 font-medium">Recently deleted items. You can restore them or remove them forever.</p>
        </div>
        {trashItems.length > 0 && (
          <button 
            onClick={onEmptyTrash}
            className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
          >
            <Trash size={18} /> Empty Trash Bin
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {trashItems.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {trashItems.map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${item.type === 'learner' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                    {item.type === 'learner' ? <Users size={24} /> : <FileText size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.type === 'learner' ? 'Student Record' : 'School Document'}
                      </span>
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                        Deleted: {item.deletedDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onRestore(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <RotateCcw size={16} /> Restore
                  </button>
                  <button 
                    onClick={() => onDeletePermanently(item.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Forever"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="bg-slate-50 p-8 rounded-full mb-6">
              <Trash2 size={64} className="opacity-20" />
            </div>
            <p className="font-black text-xl uppercase tracking-widest opacity-30">Trash Bin is Empty</p>
            <p className="text-sm font-medium mt-2">Deleted items will appear here for safety.</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
        <AlertCircle size={24} className="text-amber-500 shrink-0" />
        <div>
          <h4 className="text-amber-800 font-bold">Safe Removal Policy</h4>
          <p className="text-amber-700/80 text-sm mt-1">
            Mrs MJ Ramokolo, this Trash Bin acts as a safety net. If you delete a child's record or a document by mistake, 
            it stays here. Once you "Delete Permanently", the information is removed from your PC for good.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrashBin;
