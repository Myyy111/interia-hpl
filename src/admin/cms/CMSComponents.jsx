import React from 'react';
import { Save, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

export const CMSHeader = ({ title, desc, onSave, isSaving, message }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div>
            <h2 className="text-2xl font-black text-slate-900">{title}</h2>
            <p className="text-slate-500 text-sm">{desc}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
            {message && <span className="text-sm font-bold text-teal-600 animate-fade-in mr-2">{message}</span>}
            <button
                onClick={onSave}
                disabled={isSaving}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50 w-full md:w-auto justify-center"
            >
                <Save size={20} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
        </div>
    </div>
);

export const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">{icon}</div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
    </div>
);

export const Input = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-1.5 w-full">
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
        />
    </div>
);

export const Textarea = ({ label, value, onChange, rows = 3 }) => (
    <div className="space-y-1.5 w-full">
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
        <textarea
            rows={rows}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium resize-none"
        />
    </div>
);

export const ImageField = ({ label, img, onUpload, className = "w-full h-48" }) => (
    <div className="space-y-2">
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
        <div className={`${className} bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden relative group`}>
            {img ? (
                <img src={img} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <ImageIcon size={32} />
                    <span className="text-xs font-bold">Belum ada foto</span>
                </div>
            )}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                <label className="cursor-pointer bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg">
                    Upload Baru
                    <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                </label>
            </div>
        </div>
    </div>
);

export const Card = ({ children, onDelete }) => (
    <div className="p-6 border border-slate-200 rounded-3xl bg-white space-y-4 relative group/card hover:border-slate-300 transition-all hover:shadow-xl hover:shadow-slate-100">
        {onDelete && (
            <button 
                onClick={onDelete}
                className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-rose-500 shadow-md opacity-0 group-hover/card:opacity-100 hover:bg-rose-500 hover:text-white transition-all z-20"
            >
                <Trash2 size={18} />
            </button>
        )}
        {children}
    </div>
);
