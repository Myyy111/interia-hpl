import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function RoomSizeForm({ config, updateConfig }) {
    const { room } = config;

    const handleChange = (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 0) val = 0;
        if (val > 2000) val = 2000;
        updateConfig('room', { [e.target.name]: val });
    };

    const handleShapeChange = (shape) => {
        updateConfig('room', { shape });
    };

    return (
        <div className="space-y-8 pb-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bentuk Ruangan</label>
                <div className="grid grid-cols-3 gap-4">
                    {['Persegi panjang', 'L-shape', 'U-shape'].map((shape) => (
                        <button
                            key={shape}
                            onClick={() => handleShapeChange(shape)}
                            className={`relative py-4 px-2 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-3 ${room.shape === shape ? 'border-indigo-500 bg-indigo-50 text-indigo-700 scale-105 shadow-md' : 'border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-slate-50'}`}
                        >
                            {room.shape === shape && (
                                <div className="absolute top-2 right-2 text-indigo-600 animate-fade-in">
                                    <CheckCircle2 size={18} className="fill-indigo-100" />
                                </div>
                            )}
                            <div className={`w-12 h-12 border-4 rounded-sm flex items-center justify-center ${room.shape === shape ? 'border-indigo-500 bg-indigo-100' : 'border-slate-300'}`}>
                                {shape === 'L-shape' && <div className="w-1/2 h-full bg-white ml-auto mt-auto" />}
                                {shape === 'U-shape' && <div className="w-1/2 h-1/2 bg-white mt-auto" />}
                            </div>
                            {shape}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Panjang Utama (cm)</label>
                    <input
                        type="number"
                        name="length"
                        value={room.length || ''}
                        onChange={handleChange}
                        placeholder="300"
                        className="w-full border-2 border-slate-200 bg-slate-50 p-4 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Lebar Utama (cm)</label>
                    <input
                        type="number"
                        name="width"
                        value={room.width || ''}
                        onChange={handleChange}
                        placeholder="300"
                        className="w-full border-2 border-slate-200 bg-slate-50 p-4 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tinggi (cm)</label>
                    <input
                        type="number"
                        name="height"
                        value={room.height || ''}
                        onChange={handleChange}
                        placeholder="280"
                        className="w-full border-2 border-slate-200 bg-slate-50 p-4 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold outline-none"
                    />
                </div>
            </div>

            {(room.shape === 'L-shape' || room.shape === 'U-shape') && (
                <div className="p-6 bg-teal-50 rounded-xl border border-teal-100 space-y-4">
                    <h4 className="font-bold text-teal-800">Sisi Tambahan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {room.shape === 'L-shape' && (
                            <div>
                                <label className="block text-sm font-semibold text-teal-700 mb-1">Panjang Sisi L (cm)</label>
                                <input
                                    type="number"
                                    name="LSide"
                                    value={room.LSide || ''}
                                    onChange={handleChange}
                                    placeholder="150"
                                    className="w-full border border-teal-200 p-3 rounded-lg focus:border-teal-500 outline-none"
                                />
                            </div>
                        )}
                        {room.shape === 'U-shape' && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-teal-700 mb-1">Sayap Kiri (cm)</label>
                                    <input
                                        type="number"
                                        name="USideL"
                                        value={room.USideL || ''}
                                        onChange={handleChange}
                                        placeholder="150"
                                        className="w-full border border-teal-200 p-3 rounded-lg focus:border-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-teal-700 mb-1">Sayap Kanan (cm)</label>
                                    <input
                                        type="number"
                                        name="USideR"
                                        value={room.USideR || ''}
                                        onChange={handleChange}
                                        placeholder="150"
                                        className="w-full border border-teal-200 p-3 rounded-lg focus:border-teal-500 outline-none"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
