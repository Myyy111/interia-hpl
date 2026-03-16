import React from 'react';
import { Plus, Trash2, DoorOpen, Square, Info } from 'lucide-react';

// Renamed wall labels: Utara → Dinding A (Depan), etc.
const WALL_OPTIONS = [
    { value: 'Utara', label: 'Dinding A – Depan' },
    { value: 'Selatan', label: 'Dinding B – Belakang' },
    { value: 'Barat', label: 'Dinding C – Kiri' },
    { value: 'Timur', label: 'Dinding D – Kanan' },
];

const WALL_COLORS = {
    Utara: 'bg-blue-100 text-blue-700 border-blue-200',
    Selatan: 'bg-green-100 text-green-700 border-green-200',
    Barat: 'bg-orange-100 text-orange-700 border-orange-200',
    Timur: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function DoorsWindowsForm({ config, updateConfig }) {
    const { fixtures } = config;

    const addFixture = (type) => {
        updateConfig('fixtures', [
            ...fixtures,
            { id: Date.now(), type, position: 'Utara', width: type === 'door' ? 80 : 120, height: type === 'door' ? 200 : 100, offset: 50 }
        ]);
    };

    const removeFixture = (id) => {
        updateConfig('fixtures', fixtures.filter(f => f.id !== id));
    };

    const updateFixture = (id, field, value) => {
        updateConfig('fixtures', fixtures.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    const doorCount = fixtures.filter(f => f.type === 'door').length;
    const windowCount = fixtures.filter(f => f.type === 'window').length;

    return (
        <div className="space-y-6 pb-6">
            {/* Info Banner */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-start gap-3">
                <Info size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-teal-800 leading-relaxed">
                    Tambahkan pintu dan jendela sesuai layout ruangan Anda. <strong>Dinding A</strong> = sisi depan, <strong>B</strong> = belakang, <strong>C</strong> = kiri, <strong>D</strong> = kanan. Posisi ini membantu tim kami dalam survey.
                </p>
            </div>

            {/* Add Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => addFixture('door')}
                    className="flex items-center justify-center gap-2 border-2 border-indigo-400 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-500 hover:scale-[1.02] py-4 rounded-xl font-bold transition-all shadow-sm"
                >
                    <DoorOpen size={20} />
                    <span>+ Tambah Pintu</span>
                    {doorCount > 0 && (
                        <span className="bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{doorCount}</span>
                    )}
                </button>
                <button
                    onClick={() => addFixture('window')}
                    className="flex items-center justify-center gap-2 border-2 border-teal-400 text-teal-700 bg-teal-50 hover:bg-teal-100 hover:border-teal-500 hover:scale-[1.02] py-4 rounded-xl font-bold transition-all shadow-sm"
                >
                    <Square size={20} />
                    <span>+ Tambah Jendela</span>
                    {windowCount > 0 && (
                        <span className="bg-teal-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{windowCount}</span>
                    )}
                </button>
            </div>

            {/* Fixture List */}
            <div className="space-y-4">
                {fixtures.length === 0 ? (
                    <div className="text-center py-14 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                        <DoorOpen size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-slate-400 font-medium text-sm">Belum ada pintu atau jendela</p>
                        <p className="text-slate-300 text-xs mt-1">Opsional — bisa dilewati jika tidak diperlukan</p>
                    </div>
                ) : fixtures.map((f, i) => (
                    <div
                        key={f.id}
                        className={`rounded-xl border-2 bg-white shadow-sm overflow-hidden transition-all animate-fade-in ${f.type === 'door' ? 'border-indigo-200' : 'border-teal-200'}`}
                    >
                        {/* Card Header */}
                        <div className={`px-5 py-3 flex items-center justify-between ${f.type === 'door' ? 'bg-indigo-50' : 'bg-teal-50'}`}>
                            <div className="flex items-center gap-2">
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-inner ${f.type === 'door' ? 'bg-indigo-500' : 'bg-teal-500'}`}>
                                    {i + 1}
                                </span>
                                <span className={`font-bold text-sm ${f.type === 'door' ? 'text-indigo-700' : 'text-teal-700'}`}>
                                    {f.type === 'door' ? '🚪 Pintu' : '🪟 Jendela'}
                                </span>
                            </div>
                            <button
                                onClick={() => removeFixture(f.id)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                title="Hapus"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">Posisi Dinding</label>
                                <select
                                    value={f.position}
                                    onChange={(e) => updateFixture(f.id, 'position', e.target.value)}
                                    className="w-full border-2 border-slate-200 bg-slate-50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-semibold text-slate-700 text-sm"
                                >
                                    {WALL_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <div className={`mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${WALL_COLORS[f.position]}`}>
                                    {WALL_OPTIONS.find(o => o.value === f.position)?.label}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">Lebar (cm)</label>
                                <input
                                    type="number"
                                    value={f.width}
                                    onChange={(e) => updateFixture(f.id, 'width', parseInt(e.target.value) || 0)}
                                    className="w-full border-2 border-slate-200 bg-slate-50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-semibold text-slate-700 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">Tinggi (cm)</label>
                                <input
                                    type="number"
                                    value={f.height}
                                    onChange={(e) => updateFixture(f.id, 'height', parseInt(e.target.value) || 0)}
                                    className="w-full border-2 border-slate-200 bg-slate-50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-semibold text-slate-700 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                                    {f.type === 'window' ? 'Jarak dr Lantai (cm)' : 'Jarak dr Sudut (cm)'}
                                </label>
                                <input
                                    type="number"
                                    value={f.offset}
                                    onChange={(e) => updateFixture(f.id, 'offset', parseInt(e.target.value) || 0)}
                                    className="w-full border-2 border-slate-200 bg-slate-50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all font-semibold text-slate-700 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {fixtures.length > 0 && (
                <p className="text-xs text-center text-slate-400">
                    {doorCount} pintu · {windowCount} jendela · Total {fixtures.length} bukaan
                </p>
            )}
        </div>
    );
}
