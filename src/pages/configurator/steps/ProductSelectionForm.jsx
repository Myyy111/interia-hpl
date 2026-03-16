import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

const PRODUCT_ICONS = {
    'Kitchen Set': '🍳',
    'Lemari Pakaian': '👗',
    'Meja Kerja': '💻',
    'Rak TV': '📺',
};

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
            {/* Category Grid */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Pilih Jenis Furniture</label>
                <div className="grid grid-cols-2 gap-4">
                    {products.map((p) => {
                        const isSelected = productSelection.productId === p.id;
                        const icon = PRODUCT_ICONS[p.name] || '🪑';
                        return (
                            <button
                                key={p.id}
                                onClick={() => handleProductSelect(p)}
                                className={`group relative p-5 rounded-2xl border-2 font-bold text-sm transition-all duration-200 focus:outline-none flex flex-col items-center text-center gap-2
                                    ${isSelected
                                        ? 'border-teal-500 bg-teal-50 text-teal-800 scale-[1.02] shadow-lg shadow-teal-100'
                                        : 'border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-slate-50 hover:shadow-md hover:scale-[1.01]'
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 animate-fade-in">
                                        <CheckCircle2 size={18} className="text-teal-600 fill-teal-100" />
                                    </div>
                                )}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-200 ${isSelected ? 'bg-teal-100' : 'bg-slate-100 group-hover:bg-teal-50'}`}>
                                    {icon}
                                </div>
                                <div className={`font-bold text-sm ${isSelected ? 'text-teal-800' : 'text-slate-700'}`}>
                                    {p.name}
                                </div>
                                <div className={`text-xs font-normal ${isSelected ? 'text-teal-600' : 'text-slate-400'}`}>
                                    Mulai Rp {p.basePrice.toLocaleString('id-ID')}/m
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Shape Selection */}
            {selectedProduct && selectedProduct.shapes.length > 0 && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 animate-fade-in space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                        Model {selectedProduct.name}
                        <span className="ml-2 text-xs font-normal text-slate-400">Pilih bentuk konfigurasi</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {selectedProduct.shapes.map((shape) => (
                            <button
                                key={shape}
                                onClick={() => updateConfig('productSelection', { shape })}
                                className={`py-2.5 px-6 rounded-full font-semibold text-sm outline-none transition-all duration-200 active:scale-95 ${
                                    productSelection.shape === shape
                                        ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20 scale-[1.02]'
                                        : 'bg-white border border-slate-300 text-slate-600 hover:border-teal-400 hover:text-teal-700 hover:shadow-sm'
                                }`}
                            >
                                {shape}
                            </button>
                        ))}
                    </div>

                    {/* Shape info */}
                    <div className="flex items-start gap-2 pt-1">
                        <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {productSelection.shape === 'Lurus' && 'Konfigurasi 1 sisi dinding. Paling efisien untuk ruangan sempit.'}
                            {productSelection.shape === 'L-shape' && 'Konfigurasi 2 sisi bersambung. Ideal untuk dapur/lemari sudut ruangan.'}
                            {productSelection.shape === 'U-shape' && 'Konfigurasi 3 sisi. Kapasitas terbesar, cocok untuk dapur/ruang kerja luas.'}
                        </p>
                    </div>
                </div>
            )}

            {!productSelection.productId && (
                <p className="text-xs text-center text-slate-400 pb-2">Pilih salah satu produk untuk melanjutkan ke langkah berikutnya</p>
            )}
        </div>
    );
}
