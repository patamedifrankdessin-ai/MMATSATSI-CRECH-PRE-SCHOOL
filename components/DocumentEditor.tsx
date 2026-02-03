
import React from 'react';
import { Document } from '../types';
import { FileText, Table, Save, Trash2, Wand2, Share2, Download, CheckCircle2, Plus, X, ClipboardCheck, UserPlus, FolderOpen, Database, ShieldCheck } from 'lucide-react';
import { generateLessonPlan } from '../services/gemini';

interface DocumentEditorProps {
  documents: Document[];
  onSave: (doc: Document) => void;
  onAdd: (doc: Document) => void;
  onDelete: (id: string) => void;
}

const FORM_TEMPLATE = JSON.stringify({
  childName: '',
  surname: '',
  dob: '',
  gender: '',
  address: '',
  parent1: '',
  contact1: '',
  parent2: '',
  contact2: '',
  allergies: '',
  emergencyName: '',
  emergencyPhone: ''
});

const DocumentEditor: React.FC<DocumentEditorProps> = ({ documents, onSave, onAdd, onDelete }) => {
  const [selectedDoc, setSelectedDoc] = React.useState<Document | null>(documents[0] || null);
  const [editingContent, setEditingContent] = React.useState<string>('');
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [showSavedToast, setShowSavedToast] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const [newDocData, setNewDocData] = React.useState({ 
    title: '', 
    type: 'word' as 'word' | 'excel', 
    category: 'General' 
  });

  // Handle auto-selection if the current selected document is deleted
  React.useEffect(() => {
    if (selectedDoc && !documents.find(d => d.id === selectedDoc.id)) {
      setSelectedDoc(documents[0] || null);
    }
  }, [documents, selectedDoc]);

  React.useEffect(() => {
    if (selectedDoc) {
      setEditingContent(selectedDoc.content);
    }
  }, [selectedDoc]);

  // Robust Auto-Save logic to ensure user data is never lost
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedDoc && editingContent !== selectedDoc.content) {
        onSave({ 
          ...selectedDoc, 
          content: editingContent, 
          lastModified: new Date().toISOString().split('T')[0] 
        });
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
      }
    }, 1500); // Save automatically 1.5s after user stops typing
    return () => clearTimeout(timer);
  }, [editingContent, selectedDoc, onSave]);

  const handleAiAssist = async () => {
    if (!selectedDoc) return;
    setIsAiLoading(true);
    const newContent = await generateLessonPlan("Early Childhood Development", "Learning Activity");
    setEditingContent(newContent);
    setIsAiLoading(false);
  };

  const handleSave = () => {
    if (selectedDoc) {
      onSave({ ...selectedDoc, content: editingContent, lastModified: new Date().toISOString().split('T')[0] });
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }
  };

  const updateFormField = (key: string, value: string) => {
    try {
      const data = JSON.parse(editingContent);
      data[key] = value;
      setEditingContent(JSON.stringify(data));
    } catch (e) {
      setEditingContent(value);
    }
  };

  const updateExcelCell = (rowIndex: number, colIndex: number, value: string) => {
    try {
      const data = JSON.parse(editingContent);
      if (Array.isArray(data)) {
        data[rowIndex][colIndex] = value;
        setEditingContent(JSON.stringify(data));
      }
    } catch (e) {
      console.error("Excel data error", e);
    }
  };

  const handleCreateNew = () => {
    const id = Math.random().toString(36).substr(2, 9);
    let initialContent = '';
    
    if (newDocData.category === 'Form') {
      initialContent = FORM_TEMPLATE;
    } else if (newDocData.type === 'excel') {
      initialContent = JSON.stringify([['Title', 'Description', 'Amount', 'Date'], ['', '', '', ''], ['', '', '', '']]);
    }
    
    const doc: Document = {
      id,
      title: newDocData.title || (newDocData.category === 'Form' ? 'New Admission Form' : 'New Document'),
      content: initialContent,
      type: newDocData.type,
      category: newDocData.category,
      lastModified: new Date().toISOString().split('T')[0]
    };
    onAdd(doc);
    setSelectedDoc(doc);
    setShowCreateModal(false);
    setNewDocData({ title: '', type: 'word', category: 'General' });
  };

  const admissionForms = documents.filter(doc => doc.category === 'Form');
  const otherDocs = documents.filter(doc => doc.category !== 'Form');

  const renderEditor = () => {
    if (!selectedDoc) return <div className="flex-1 flex items-center justify-center text-slate-400">Select or create a document to start.</div>;

    if (selectedDoc.category === 'Form') {
      let formData: any = {};
      try { formData = JSON.parse(editingContent); } catch (e) { formData = {}; }

      return (
        <div className="space-y-8 pb-20">
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
            <ShieldCheck size={24} className="text-emerald-600" />
            <div>
              <h3 className="text-emerald-800 font-bold">Auto-Save Protection Enabled</h3>
              <p className="text-emerald-600 text-sm">Mrs MJ Ramokolo: Any changes you make are saved instantly to your secure local registry.</p>
            </div>
          </div>

          <section className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Child's Personal Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Child's Full Name", key: 'childName' },
                { label: "Surname", key: 'surname' },
                { label: "Date of Birth (YYYY/MM/DD)", key: 'dob' },
                { label: "Gender", key: 'gender' },
                { label: "Home Address", key: 'address' }
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{f.label}</label>
                  <input 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formData[f.key] || ''} 
                    onChange={(e) => updateFormField(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Parent / Guardian Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Parent 1 Name", key: 'parent1' },
                { label: "Contact Number", key: 'contact1' },
                { label: "Parent 2 Name", key: 'parent2' },
                { label: "Contact Number", key: 'contact2' }
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{f.label}</label>
                  <input 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formData[f.key] || ''} 
                    onChange={(e) => updateFormField(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="p-12 bg-white rounded-3xl border-2 border-slate-100 text-center relative overflow-hidden min-h-[250px] flex flex-col items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none p-8">
               <svg viewBox="0 0 600 240" className="w-full max-w-[360px] h-auto drop-shadow-md">
                  <path 
                    d="M60,165 C85,30 135,30 155,165 C175,30 225,30 245,165" 
                    fill="none" 
                    stroke="#1e293b" 
                    strokeWidth="4.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M280,75 L410,35" 
                    fill="none" 
                    stroke="#1e293b" 
                    strokeWidth="4.5" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M305,170 L445,45 C490,10 555,55 515,135 C485,190 410,170 390,120 L570,105" 
                    fill="none" 
                    stroke="#1e293b" 
                    strokeWidth="4.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M50,205 L550,205" 
                    fill="none" 
                    stroke="#1e293b" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
               </svg>
            </div>
            
            <div className="relative z-10 mt-36 w-full max-w-sm">
               <div className="pt-3">
                  <p className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    Mrs MJ Ramokolo
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                    Principal & Managing Director
                  </p>
               </div>
            </div>
          </div>

          <div className="pt-12 mt-12 border-t border-rose-100">
            <button 
              onClick={() => selectedDoc && onDelete(selectedDoc.id)}
              className="flex items-center gap-3 px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100 group"
            >
              <Trash2 size={18} className="group-hover:animate-bounce" /> Delete This Admission Form Permanently
            </button>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 px-1 italic">
              Warning: Deletion is permanent and cannot be reversed once confirmed.
            </p>
          </div>
        </div>
      );
    }

    if (selectedDoc.type === 'excel') {
      let gridData: string[][] = [];
      try { gridData = JSON.parse(editingContent); } catch (e) { gridData = []; }

      return (
        <div className="flex-1 overflow-auto bg-slate-50 rounded-xl p-1 border border-slate-200">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-slate-100">
                {gridData[0]?.map((col, ci) => (
                  <th key={ci} className="border border-slate-200 p-3 text-left font-bold text-slate-600 text-sm">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gridData.slice(1).map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-slate-200 p-0">
                      <input 
                        className="w-full h-full p-3 outline-none focus:bg-indigo-50/50 text-sm"
                        value={cell}
                        onChange={(e) => updateExcelCell(ri + 1, ci, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                 <td colSpan={gridData[0]?.length} className="p-3">
                   <button 
                     onClick={() => {
                       const newData = [...gridData, new Array(gridData[0].length).fill('')];
                       setEditingContent(JSON.stringify(newData));
                     }}
                     className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                   >+ Add Row</button>
                 </td>
              </tr>
            </tbody>
          </table>
          <div className="p-8 border-t border-slate-100">
             <button 
                onClick={() => selectedDoc && onDelete(selectedDoc.id)}
                className="text-rose-500 text-xs font-bold hover:underline flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete Spreadsheet
              </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1">
        <textarea
          value={editingContent}
          onChange={(e) => setEditingContent(e.target.value)}
          className="flex-1 w-full text-lg leading-loose border-none outline-none resize-none bg-transparent placeholder:text-slate-300 font-mono"
          placeholder="Start typing your Word document here..."
        />
        <div className="pt-8 mt-8 border-t border-slate-100">
           <button 
              onClick={() => selectedDoc && onDelete(selectedDoc.id)}
              className="text-rose-500 text-xs font-bold hover:underline flex items-center gap-2"
            >
              <Trash2 size={14} /> Delete Document
            </button>
        </div>
      </div>
    );
  };

  const renderDocButton = (doc: Document) => (
    <div key={doc.id} className="group relative">
      <button
        onClick={() => setSelectedDoc(doc)}
        className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedDoc?.id === doc.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'hover:bg-slate-50 border-transparent text-slate-600'}`}
      >
        <div className="flex items-center gap-3 mb-1 pr-6">
          {doc.category === 'Form' ? <ClipboardCheck size={16} className="text-indigo-500" /> : doc.type === 'word' ? <FileText size={16} className="text-blue-500" /> : <Table size={16} className="text-emerald-500" />}
          <span className={`text-sm font-bold truncate ${selectedDoc?.id === doc.id ? 'text-indigo-600' : 'text-slate-700'}`}>{doc.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase">{doc.category}</span>
          <span className="text-[10px] text-slate-400 font-medium">{doc.lastModified}</span>
        </div>
      </button>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(doc.id);
        }}
        className="absolute top-4 right-3 p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        title="Delete Record"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="w-80 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/10">
        <div className="p-6 border-b border-slate-100 bg-white">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            <UserPlus size={18} /> Register New Child
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
          {/* Section: Admission Forms Registry */}
          <section>
            <h3 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
              <ClipboardCheck size={12} /> Student Registry (Forms)
            </h3>
            <div className="space-y-1">
              {admissionForms.length > 0 ? (
                admissionForms.map(renderDocButton)
              ) : (
                <p className="px-2 text-xs text-slate-400 italic">No students registered yet.</p>
              )}
            </div>
          </section>

          {/* Section: General Documents */}
          <section>
            <h3 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
              <FolderOpen size={12} /> Other School Docs
            </h3>
            <div className="space-y-1">
              {otherDocs.length > 0 ? (
                otherDocs.map(renderDocButton)
              ) : (
                <p className="px-2 text-xs text-slate-400 italic">No other documents found.</p>
              )}
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
           <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <CheckCircle2 size={14} /> Records Saved Locally
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button className="p-2.5 hover:bg-slate-200 rounded-xl text-slate-500 transition-all" title="Save" onClick={handleSave}><Save size={20} /></button>
              <button className="p-2.5 hover:bg-slate-200 rounded-xl text-slate-500 transition-all" title="Print/PDF"><Download size={20} /></button>
              <button className="p-2.5 hover:bg-slate-200 rounded-xl text-slate-500 transition-all" title="Share"><Share2 size={20} /></button>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm">
               <Database size={12} /> Storage: Your Local PC
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showSavedToast && <span className="text-xs text-emerald-600 font-bold animate-pulse">Saved Successfully</span>}
            <button 
              onClick={() => selectedDoc && onDelete(selectedDoc.id)}
              className="p-2.5 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all"
            ><Trash2 size={20} /></button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-slate-50/10">
          <div className="max-w-4xl mx-auto min-h-full flex flex-col bg-white p-12 shadow-sm border border-slate-100 rounded-3xl">
            <input 
              value={selectedDoc?.title || ''} 
              onChange={(e) => selectedDoc && setSelectedDoc({...selectedDoc, title: e.target.value})}
              className="text-3xl font-black border-none outline-none mb-2 placeholder:text-slate-200 bg-transparent text-slate-800" 
              placeholder="Document Title"
            />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-1">
               <Database size={10} /> Saved in Student Registry Registry
            </p>
            {renderEditor()}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <h2 className="text-2xl font-bold">Registration Portal</h2>
              <button onClick={() => setShowCreateModal(false)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Child / Document Name</label>
                <input 
                  autoFocus
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700" 
                  value={newDocData.title}
                  placeholder="e.g. Admission for [Name]"
                  onChange={e => setNewDocData({...newDocData, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setNewDocData({...newDocData, type: 'word', category: 'Form'})}
                  className={`p-6 rounded-3xl border flex flex-col items-center justify-center gap-3 transition-all ${newDocData.category === 'Form' ? 'bg-indigo-600 border-indigo-700 text-white shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'}`}
                >
                  <ClipboardCheck size={32} />
                  <span className="font-black text-xs uppercase tracking-widest">Creche Admission Form</span>
                </button>

                <button 
                  onClick={() => setNewDocData({...newDocData, type: 'word', category: 'General'})}
                  className={`p-6 rounded-3xl border flex flex-col items-center justify-center gap-3 transition-all ${newDocData.type === 'word' && newDocData.category === 'General' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'}`}
                >
                  <FileText size={32} />
                  <span className="font-black text-xs uppercase tracking-widest">Blank Word Document</span>
                </button>

                <button 
                  onClick={() => setNewDocData({...newDocData, type: 'excel', category: 'General'})}
                  className={`p-6 rounded-3xl border flex flex-col items-center justify-center gap-3 transition-all ${newDocData.type === 'excel' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'}`}
                >
                  <Table size={32} />
                  <span className="font-black text-xs uppercase tracking-widest">Spreadsheet Record</span>
                </button>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">School Policy: Secure Registration</p>
                <p className="text-xs text-slate-500 italic">"Mrs MJ Ramokolo, once you start recording, the form will be added to the Student Registry sidebar automatically. It stays there until you delete it."</p>
              </div>

              <button 
                onClick={handleCreateNew}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
              >
                CREATE RECORD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;
