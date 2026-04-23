import React from 'react';
import { Save, Trash2, Plus, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export const CMSHeader = ({ title, desc, onSave, isSaving, message }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">{desc}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
            {message && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold animate-fade-in border border-emerald-100">
                    <CheckCircle2 size={14} />
                    {message}
                </div>
            )}
            <button
                onClick={onSave}
                disabled={isSaving}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-50 w-full md:w-auto justify-center active:scale-95"
            >
                <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
        </div>
    </div>
);

export const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">{icon}</div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
    </div>
);

export const Input = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-2 w-full group">
        {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-medium text-sm placeholder:text-slate-300"
        />
    </div>
);

export const Textarea = ({ label, value, onChange, rows = 3 }) => (
    <div className="space-y-2 w-full group">
        {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
        <textarea
            rows={rows}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-medium text-sm placeholder:text-slate-300 resize-none"
        />
    </div>
);

export const ImageField = ({ label, img, onUpload, className = "w-full h-56" }) => (
    <div className="space-y-2">
        {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
        <div className={`${className} bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden relative group transition-all hover:border-slate-300`}>
            {img ? (
                <img src={img} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
                        <ImageIcon size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Belum ada foto</span>
                </div>
            )}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                <label className="cursor-pointer bg-white text-slate-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-transform">
                    Ganti Gambar
                    <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                </label>
            </div>
        </div>
    </div>
);

export const Card = ({ children, onDelete }) => (
    <div className="p-8 border border-slate-200 rounded-[2rem] bg-white space-y-6 relative group/card hover:border-slate-900 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
        {onDelete && (
            <button 
                onClick={onDelete}
                className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-rose-500 shadow-xl opacity-0 group-hover/card:opacity-100 hover:bg-rose-500 hover:text-white transition-all z-20"
            >
                <Trash2 size={18} />
            </button>
        )}
        {children}
    </div>
);
