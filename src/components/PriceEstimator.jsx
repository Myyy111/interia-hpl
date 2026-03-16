import React from 'react';
import { TrendingUp, Zap } from 'lucide-react';

export default function PriceEstimator({ price }) {
    const isReady = price > 0;

    return (
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl shadow-xl border border-slate-700/50 p-6 text-white relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -left-12 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                {/* Label */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={14} className="text-teal-400" />
                        Estimasi Biaya Produksi
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                        <Zap size={10} /> Real-time
                    </span>
                </div>

                {/* Price */}
                <div className="mb-3">
                    {isReady ? (
                        <>
                            <div className="text-4xl font-extrabold tracking-tight leading-none">
                                Rp {price.toLocaleString('id-ID')}
                            </div>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                Harga sudah termasuk material, pengerjaan, & instalasi standar Jabodetabek.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-2xl font-bold text-slate-500 leading-none">Belum dihitung</div>
                            <p className="text-sm text-slate-500 mt-2">Pilih produk & material untuk melihat estimasi harga.</p>
                        </>
                    )}
                </div>

                {/* Progress / indicator bar */}
                <div className="mt-4">
                    <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${isReady ? 'bg-gradient-to-r from-amber-400 to-teal-400' : 'bg-slate-600 animate-pulse'}`}
                            style={{ width: isReady ? '100%' : '30%' }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1.5">
                        <span>{isReady ? 'Kalkulasi lengkap' : 'Menunggu input...'}</span>
                        <span>Estimasi</span>
                    </div>
                </div>

                {/* Disclaimer */}
                {isReady && (
                    <p className="text-[10px] text-slate-500 mt-3 border-t border-slate-700/50 pt-3">
                        *Harga final setelah survey langsung. Dapat berubah ±10-15%.
                    </p>
                )}
            </div>
        </div>
    );
}
