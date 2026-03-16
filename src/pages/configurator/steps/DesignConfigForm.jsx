import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

// Material color palette for preview
export const MATERIAL_COLORS = {
    '1': { fill: '#e8d5b7', stroke: '#c4a882', name: 'Multiplek + HPL' },    // wood/beige
    '2': { fill: '#d4e8d4', stroke: '#7ab87a', name: 'PVC' },                 // green-ish
    '3': { fill: '#c4a882', stroke: '#8b6f47', name: 'Kayu Solid' },          // dark wood
};

export default function DesignConfigForm({ config, updateConfig, metadata }) {
    const { design } = config;
    const { materials, accessories } = metadata;

    const toggleAccessory = (id) => {
        const accs = [...design.accessories];
        if (accs.includes(id)) {
            updateConfig('design', { accessories: accs.filter(a => a !== id) });
        } else {
            updateConfig('design', { accessories: [...accs, id] });
        }
    };

    const STYLES = [
        {
            model: 'Minimalis',
            icon: '⬜',
            desc: 'Clean lines, hardware tersembunyi',
            tags: ['Modern', 'Simpel']
        },
        {
            model: 'Modern',
            icon: '▣',
            desc: 'Bold form, sentuhan metalik',
            tags: ['Dinamis', 'Stylish']
        },
        {
            model: 'Klasik',
            icon: '◫',
            desc: 'Ornamen halus, kesan mewah',
            tags: ['Elegan', 'Timeless']
        },
    ];

    return (
        <div className="space-y-8 pb-6">
            {/* Gaya Desain */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Gaya Desain</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {STYLES.map(({ model, icon, desc, tags }) => (
                        <button
                            key={model}
                            onClick={() => updateConfig('design', { model })}
                            className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none group ${
                                design.model === model
                                    ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-100 scale-[1.02]'
                                    : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                            }`}
                        >
                            {design.model === model && (
                                <CheckCircle2 size={16} className="absolute top-3 right-3 text-amber-600 fill-amber-100" />
                            )}
                            <div className="text-2xl mb-2">{icon}</div>
                            <div className={`font-bold text-sm mb-1 ${design.model === model ? 'text-amber-800' : 'text-slate-700'}`}>{model}</div>
                            <div className="text-xs text-slate-500 mb-3 leading-tight">{desc}</div>
                            <div className="flex flex-wrap gap-1">
                                {tags.map(tag => (
                                    <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${design.model === model ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>{tag}</span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Material */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Material Utama
                    <span className="ml-2 text-xs text-slate-400 font-normal">Pengaruhi harga & tampilan</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {materials.map((m) => {
                        const matColor = MATERIAL_COLORS[m.id];
                        return (
                            <button
                                key={m.id}
                                onClick={() => updateConfig('design', { materialId: m.id })}
                                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none ${
                                    design.materialId === m.id
                                        ? 'border-amber-500 bg-amber-50 shadow-md'
                                        : 'border-slate-200 hover:border-amber-200 hover:bg-slate-50'
                                }`}
                            >
                                {design.materialId === m.id && (
                                    <CheckCircle2 size={16} className="absolute top-3 right-3 text-amber-600 fill-amber-100" />
                                )}
                                {/* Color Swatch */}
                                {matColor && (
                                    <div
                                        className="w-full h-10 rounded-lg mb-3 border"
                                        style={{ backgroundColor: matColor.fill, borderColor: matColor.stroke }}
                                    />
                                )}
                                <div className="font-bold text-slate-800 text-sm mb-1">{m.name}</div>
                                {m.priceModifier > 1 ? (
                                    <div className="text-xs text-amber-700 font-semibold bg-amber-100 inline-block px-2 py-0.5 rounded-full">
                                        +{Math.round((m.priceModifier - 1) * 100)}% harga
                                    </div>
                                ) : (
                                    <div className="text-xs text-teal-700 font-semibold bg-teal-50 inline-block px-2 py-0.5 rounded-full border border-teal-200">
                                        ✓ Harga Standar
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
                {!design.materialId && (
                    <p className="text-xs text-amber-600 font-medium mt-2 pl-1 flex items-center gap-1">
                        <Info size={12} /> Pilih material untuk melihat estimasi harga yang akurat
                    </p>
                )}
            </div>

            {/* Accessories */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Aksesori Tambahan
                    <span className="ml-2 text-xs text-slate-400 font-normal">Opsional</span>
                </label>
                <div className="space-y-3">
                    {accessories.map((a) => {
                        const isSelected = design.accessories.includes(a.id);
                        return (
                            <label
                                key={a.id}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    isSelected
                                        ? 'border-amber-500 bg-amber-50 shadow-sm'
                                        : 'border-slate-200 hover:border-amber-200 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-slate-300 bg-white'}`}>
                                        {isSelected && (
                                            <svg viewBox="0 0 12 10" className="w-3 h-3 fill-white">
                                                <polyline points="1,5 4,8 11,1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <input type="checkbox" checked={isSelected} onChange={() => toggleAccessory(a.id)} className="sr-only" />
                                    <div>
                                        <span className={`font-semibold text-sm block ${isSelected ? 'text-amber-800' : 'text-slate-800'}`}>{a.name}</span>
                                        {a.type && <span className="text-[10px] text-slate-400 uppercase tracking-wider">{a.type}</span>}
                                    </div>
                                </div>
                                <span className={`font-bold text-sm shrink-0 ${isSelected ? 'text-amber-700' : 'text-slate-600'}`}>
                                    +Rp {a.price.toLocaleString('id-ID')}
                                </span>
                            </label>
                        );
                    })}
                </div>

                {design.accessories.length > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                        <span className="text-sm text-amber-700 font-semibold">{design.accessories.length} aksesori dipilih</span>
                        <span className="text-sm font-bold text-amber-800">
                            +Rp {accessories
                                .filter(a => design.accessories.includes(a.id))
                                .reduce((sum, a) => sum + a.price, 0)
                                .toLocaleString('id-ID')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
