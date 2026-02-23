import React from 'react';

export default function PriceEstimator({ price }) {
    return (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-xl border border-indigo-800/50 p-6 text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-10%] -left-12 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <h3 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                    Estimasi Biaya Produksi
                </h3>

                <div className="flex flex-col mt-4">
                    <span className="text-4xl font-extrabold tracking-tight">
                        Rp {price > 0 ? price.toLocaleString('id-ID') : '0'}
                    </span>
                    <p className="text-sm text-indigo-300 mt-2 leading-relaxed">
                        Estimasi harga dapat berubah setelah dilakukan survey langsung ke lokasi dan kesepakatan desain final.
                        Harga sudah termasuk biaya pengiriman dan instalasi standar.
                    </p>
                </div>
            </div>

            <div className="mt-8 relative z-10">
                <div className="h-2 w-full bg-indigo-950/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-indigo-400 w-full animate-pulse opacity-70"></div>
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-indigo-300 uppercase font-bold tracking-widest">
                    <span>Real-time</span>
                    <span>Perhitungan</span>
                </div>
            </div>
        </div>
    );
}
