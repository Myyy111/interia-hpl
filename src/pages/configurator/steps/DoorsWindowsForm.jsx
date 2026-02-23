import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function DoorsWindowsForm({ config, updateConfig }) {
    const { fixtures } = config;

    const addFixture = (type) => {
        updateConfig('fixtures', [
            ...fixtures,
            { id: Date.now(), type, position: 'Utara', width: 80, height: 200, offset: 0 }
        ]);
    };

    const removeFixture = (id) => {
        updateConfig('fixtures', fixtures.filter(f => f.id !== id));
    };

    const updateFixture = (id, field, value) => {
        updateConfig('fixtures', fixtures.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    return (
        <div className="space-y-8 pb-6">
            <div className="flex gap-4">
                <button
                    onClick={() => addFixture('door')}
                    className="flex-1 border-2 border-indigo-500 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:scale-[1.02] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                    <Plus size={20} /> + Tambah Pintu
                </button>
                <button
                    onClick={() => addFixture('window')}
                    className="flex-1 border-2 border-teal-500 text-teal-700 bg-teal-50 hover:bg-teal-100 hover:scale-[1.02] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                    <Plus size={20} /> + Tambah Jendela
                </button>
            </div>

            <div className="space-y-4">
                {fixtures.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 font-medium">Belum ada pintu atau jendela yang ditambahkan</div>
                ) : fixtures.map((f, i) => (
                    <div key={f.id} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col gap-4 relative animate-fade-in group hover:border-slate-300 transition-colors">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner ${f.type === 'door' ? 'bg-indigo-500' : 'bg-teal-500'}`}>
                                    {i + 1}
                                </span>
                                {f.type === 'door' ? 'Pintu' : 'Jendela'}
                            </h4>
                            <button onClick={() => removeFixture(f.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors group-hover:bg-rose-50">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Dinding</label>
                                <select value={f.position} onChange={(e) => updateFixture(f.id, 'position', e.target.value)} className="w-full border border-slate-200 bg-slate-50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700">
                                    {['Utara', 'Selatan', 'Timur', 'Barat'].map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Lebar (cm)</label>
                                <input type="number" value={f.width} onChange={(e) => updateFixture(f.id, 'width', parseInt(e.target.value) || 0)} className="w-full border border-slate-200 bg-slate-50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Tinggi (cm)</label>
                                <input type="number" value={f.height} onChange={(e) => updateFixture(f.id, 'height', parseInt(e.target.value) || 0)} className="w-full border border-slate-200 bg-slate-50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">{f.type === 'window' ? 'Jarak dr Lantai' : 'Jarak dr Sudut'}</label>
                                <input type="number" value={f.offset} onChange={(e) => updateFixture(f.id, 'offset', parseInt(e.target.value) || 0)} className="w-full border border-slate-200 bg-slate-50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
