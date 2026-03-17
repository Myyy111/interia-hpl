import React, { useRef, useCallback } from 'react';
import { CheckCircle2, Info, HelpCircle } from 'lucide-react';

const Tooltip = ({ text }) => (
    <span className="group relative inline-flex items-center ml-1">
        <HelpCircle size={14} className="text-slate-400 cursor-help" />
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl leading-relaxed">
            {text}
        </span>
    </span>
);

export default function RoomSizeForm({ config, updateConfig }) {
    const { room } = config;
    const debounceRef = useRef({});

    const handleChange = useCallback((e) => {
        const name = e.target.name;
        const rawVal = e.target.value;
        
        // Debounce only for number clamping, but update immediately for responsiveness
        let val = parseFloat(rawVal);
        if (isNaN(val) || val < 0) val = 0;
        if (val > 2000) val = 2000;
        
        if (debounceRef.current[name]) clearTimeout(debounceRef.current[name]);
        
        debounceRef.current[name] = setTimeout(() => {
            updateConfig('room', { [name]: val });
        }, 150);
        updateConfig('room', { [name]: val });
    }, [updateConfig]);

    const handleShapeChange = (shape) => {
        updateConfig('room', { shape });
    };



    return (
        <div className="space-y-8 pb-6">
            {/* Tip Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 leading-relaxed">
                    <strong>Tips:</strong> Masukkan ukuran dalam <strong>sentimeter (cm)</strong>. Contoh: ruangan 3,5 meter = <strong>350 cm</strong>. Tim kami akan mengukur ulang saat survey.
                </p>
            </div>

            {/* Room Shape */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Bentuk Ruangan</label>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { shape: 'Persegi panjang', svg: <rect x="4" y="4" width="32" height="24" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" /> },
                        { shape: 'L-shape', svg: <><rect x="4" y="4" width="32" height="12" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" /><rect x="4" y="4" width="14" height="24" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" /></> },
                        { shape: 'U-shape', svg: <><rect x="4" y="4" width="32" height="10" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" /><rect x="4" y="4" width="12" height="24" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" /><rect x="24" y="4" width="12" height="24" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" /></> },
                    ].map(({ shape, svg }) => (
                        <button
                            key={shape}
                            onClick={() => handleShapeChange(shape)}
                            className={`relative py-5 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-200 flex flex-col items-center gap-3 focus:outline-none ${
                                room.shape === shape
                                    ? 'border-teal-500 bg-teal-50 text-teal-700 scale-[1.03] shadow-md shadow-teal-100'
                                    : 'border-slate-200 text-slate-500 hover:border-teal-200 hover:bg-slate-50'
                            }`}
                        >
                            {room.shape === shape && (
                                <div className="absolute top-2 right-2 text-teal-600 animate-fade-in">
                                    <CheckCircle2 size={16} className="fill-teal-100" />
                                </div>
                            )}
                            <svg
                                viewBox="0 0 40 32"
                                className={`w-10 h-8 ${room.shape === shape ? 'text-teal-500' : 'text-slate-300'}`}
                            >
                                {svg}
                            </svg>
                            <span className="text-xs leading-tight text-center">{shape}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <InputField
                    label="Panjang Utama"
                    name="length"
                    value={room.length}
                    onChange={handleChange}
                    placeholder="300"
                    tooltip="Panjang terpanjang ruangan. Contoh: ruangan 3 meter masukkan 300"
                />
                <InputField
                    label="Lebar Utama"
                    name="width"
                    value={room.width}
                    onChange={handleChange}
                    placeholder="300"
                    tooltip="Lebar ruangan dari kiri ke kanan. Contoh: 4 meter = 400 cm"
                />
                <InputField
                    label="Tinggi Plafon"
                    name="height"
                    value={room.height}
                    onChange={handleChange}
                    placeholder="280"
                    tooltip="Tinggi ruangan dari lantai ke plafon. Umumnya 240-300 cm"
                />
            </div>

            {/* Area Calculation */}
            {room.length > 0 && room.width > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Luas Lantai', value: `${((room.length * room.width) / 10000).toFixed(2)} m²`, color: 'text-teal-600' },
                        { label: 'Keliling', value: `${(2 * (room.length + room.width) / 100).toFixed(2)} m`, color: 'text-indigo-600' },
                        { label: 'Volume', value: `${((room.length * room.width * room.height) / 1000000).toFixed(2)} m³`, color: 'text-amber-600' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-1">{label}</div>
                            <div className={`font-extrabold text-sm ${color}`}>{value}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* L/U Shape Extra Fields */}
            {(room.shape === 'L-shape' || room.shape === 'U-shape') && (
                <div className="p-5 bg-teal-50 rounded-xl border border-teal-200 space-y-4">
                    <h4 className="font-bold text-teal-800 flex items-center gap-2">
                        <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-black">+</span>
                        Dimensi Sisi Tambahan
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {room.shape === 'L-shape' && (
                            <div>
                                <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                                    Panjang Sisi L <span className="text-slate-400 font-normal text-xs">(cm)</span>
                                    <Tooltip text="Panjang sisi yang memanjang dari sudut ruangan L." />
                                </label>
                                <input
                                    type="number"
                                    name="LSide"
                                    value={room.LSide || ''}
                                    onChange={handleChange}
                                    placeholder="150"
                                    className="w-full border-2 border-teal-200 bg-white p-3 rounded-xl focus:border-teal-500 outline-none font-semibold text-slate-800"
                                />
                                {room.LSide > 0 && <p className="text-xs text-teal-600 font-medium mt-1 pl-1">≈ {(room.LSide / 100).toFixed(2)} meter</p>}
                            </div>
                        )}
                        {room.shape === 'U-shape' && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                                        Sayap Kiri <span className="text-slate-400 font-normal text-xs">(cm)</span>
                                    </label>
                                    <input
                                        type="number" name="USideL" value={room.USideL || ''} onChange={handleChange} placeholder="150"
                                        className="w-full border-2 border-teal-200 bg-white p-3 rounded-xl focus:border-teal-500 outline-none font-semibold text-slate-800"
                                    />
                                    {room.USideL > 0 && <p className="text-xs text-teal-600 font-medium mt-1 pl-1">≈ {(room.USideL / 100).toFixed(2)} m</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                                        Sayap Kanan <span className="text-slate-400 font-normal text-xs">(cm)</span>
                                    </label>
                                    <input
                                        type="number" name="USideR" value={room.USideR || ''} onChange={handleChange} placeholder="150"
                                        className="w-full border-2 border-teal-200 bg-white p-3 rounded-xl focus:border-teal-500 outline-none font-semibold text-slate-800"
                                    />
                                    {room.USideR > 0 && <p className="text-xs text-teal-600 font-medium mt-1 pl-1">≈ {(room.USideR / 100).toFixed(2)} m</p>}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const InputField = ({ label, name, value, onChange, placeholder, unit = 'cm', tooltip }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            {label} <span className="text-slate-400 font-normal text-xs">({unit})</span>
            {tooltip && <Tooltip text={tooltip} />}
        </label>
        <div className="relative">
            <input
                type="number"
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                min="50"
                max="2000"
                step="10"
                className="w-full border-2 border-slate-200 bg-slate-50 p-4 pr-12 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold outline-none text-slate-800 placeholder-slate-300"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{unit}</span>
        </div>
        {value > 0 && (
            <p className="text-xs text-teal-600 font-medium mt-1 pl-1">
                ≈ {(value / 100).toFixed(2)} meter
            </p>
        )}
    </div>
);
