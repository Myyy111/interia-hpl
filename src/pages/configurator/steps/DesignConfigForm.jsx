import React from 'react';
import { CheckCircle2 } from 'lucide-react';

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

    return (
        <div className="space-y-8">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">Gaya Desain</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Minimalis', 'Modern', 'Klasik'].map((model) => (
                        <button
                            key={model}
                            onClick={() => updateConfig('design', { model })}
                            className={`p-4 rounded-xl border-2 font-bold text-sm transition-all focus:outline-none flex items-center justify-between gap-2 ${design.model === model ? 'border-amber-500 bg-amber-50 text-amber-700 scale-[1.02] shadow-md' : 'border-slate-200 text-slate-600 hover:border-amber-200 hover:bg-slate-50'}`}
                        >
                            {model}
                            {design.model === model && <CheckCircle2 size={16} className="text-amber-600" />}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">Material Utama</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {materials.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => updateConfig('design', { materialId: m.id })}
                            className={`p-4 rounded-xl border-2 text-left transition-all focus:outline-none flex items-start justify-between gap-3 ${design.materialId === m.id ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-slate-200 hover:border-amber-200 hover:bg-slate-50'}`}
                        >
                            <div>
                                <div className="font-bold text-slate-800 text-sm mb-1">{m.name}</div>
                                {m.priceModifier > 1 ? (
                                    <div className="text-xs text-amber-700 font-medium">+{Math.round((m.priceModifier - 1) * 100)}% harga</div>
                                ) : (
                                    <div className="text-xs text-slate-500">Standar</div>
                                )}
                            </div>
                            {design.materialId === m.id && <CheckCircle2 size={18} className="text-amber-600 flex-shrink-0" />}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">Aksesoris Tambahan</label>
                <div className="space-y-3">
                    {accessories.map((a) => (
                        <label key={a.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${design.accessories.includes(a.id) ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={design.accessories.includes(a.id)}
                                    onChange={() => toggleAccessory(a.id)}
                                    className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                                />
                                <span className="font-semibold text-slate-800 text-sm">{a.name}</span>
                            </div>
                            <span className="font-bold text-amber-700 text-sm">+Rp {a.price.toLocaleString('id-ID')}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
