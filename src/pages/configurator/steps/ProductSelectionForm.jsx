import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ProductSelectionForm({ config, updateConfig, metadata }) {
    const { productSelection } = config;
    const { products } = metadata;

    const handleProductSelect = (p) => {
        updateConfig('productSelection', {
            productId: p.id,
            name: p.name,
            shape: p.shapes[0] || 'Lurus'
        });
    };

    const selectedProduct = products.find(p => p.id === productSelection.productId);

    return (
        <div className="space-y-8 pb-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">Pilih Kategori Produk</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => handleProductSelect(p)}
                            className={`relative p-6 rounded-xl border-2 font-bold text-sm transition-all focus:outline-none flex flex-col items-center justify-center text-center gap-1 ${productSelection.productId === p.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700 scale-[1.02] shadow-md' : 'border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'}`}
                        >
                            {productSelection.productId === p.id && (
                                <div className="absolute top-2 right-2 text-indigo-600 animate-fade-in">
                                    <CheckCircle2 size={18} className="fill-indigo-100" />
                                </div>
                            )}
                            <div className="text-lg leading-tight w-full truncate px-4">{p.name}</div>
                            <div className="text-xs font-normal opacity-70">Mulai Rp {p.basePrice.toLocaleString()}/m</div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedProduct && selectedProduct.shapes.length > 0 && (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Model Custom {selectedProduct.name}</label>
                    <div className="flex flex-wrap gap-3">
                        {selectedProduct.shapes.map((shape) => (
                            <button
                                key={shape}
                                onClick={() => updateConfig('productSelection', { shape })}
                                className={`py-2.5 px-6 rounded-full font-semibold outline-none transition-all ${productSelection.shape === shape ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-300 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
                            >
                                {shape}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
