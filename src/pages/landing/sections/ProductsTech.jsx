import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Laptop, Maximize, CircleDollarSign, CheckCircle2 } from 'lucide-react';

export function Products({ cmsData }) {
    const defaultProducts = [
        {
            title: 'Kitchen Set Minimalis',
            img: 'https://images.unsplash.com/photo-1556910103-1c02745a8289?q=80&w=800&auto=format&fit=crop',
            features: 'L-Shape / U-Shape, Anti-Rayap (PVC/Blockboard), Engsel Soft-close',
        },
        {
            title: 'Lemari Pakaian Wardrobe',
            img: 'https://images.unsplash.com/photo-1595526114101-23da160c87ad?q=80&w=800&auto=format&fit=crop',
            features: 'Full Plafon 3 Meter, Cermin Terintegrasi, LED Strip Sensor',
        },
        {
            title: 'Meja Kerja & Belajar',
            img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bf?q=80&w=800&auto=format&fit=crop',
            features: 'Ruang Penyimpanan, Cable Management, Desain Ergonomis',
        },
        {
            title: 'Kabinet Rak TV',
            img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop',
            features: 'Floating Design, Hidden Storage, Back panel HPL',
        },
    ];

    const products = (cmsData || []).length > 0 ? cmsData : defaultProducts;

    return (
        <section id="produk" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <div className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-4">Katalog Produk</div>
                        <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">Furniture yang dirancang <br />untuk ruangan nyata Anda.</h2>
                    </div>
                    <p className="text-slate-500 max-w-sm md:text-right font-light leading-relaxed">
                        Pilih jenis produk yang ingin dibuat, masukkan ukuran Anda, dan kami akan menyesuaikan proporsinya.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {products.map((p, i) => (
                        <div key={i} className="group overflow-hidden rounded-3xl relative h-[450px] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
                            <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                            <div className="absolute inset-0 p-8 flex flex-col justify-end transform group-hover:-translate-y-2 transition-transform duration-500">
                                <h3 className="text-2xl font-bold text-white mb-0 leading-tight">{p.title}</h3>
                                <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-48 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                    <ul className="space-y-2 pt-4 pb-2">
                                        {(typeof p.features === 'string' ? p.features.split(',') : p.features || []).map((feat, idx) => (
                                            <li key={idx} className="flex items-center text-slate-300 font-medium text-sm gap-2">
                                                <CheckCircle2 size={16} className="text-teal-400" /> {feat.trim()}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link to="/configurator" className="flex items-center gap-2 cursor-pointer text-indigo-300 hover:text-indigo-200 uppercase text-sm font-bold tracking-wider mt-2">
                                    Desain Sekarang &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Technology({ cmsData }) {
    if (!cmsData) return null;
    return (
        <section id="teknologi" className="py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 w-full flex items-center justify-center perspective-1000 order-2 md:order-1">
                    <div className="relative transform rotate-y-[15deg] rotate-x-[5deg] bg-slate-800 rounded-3xl p-4 shadow-2xl border border-slate-700 w-full max-w-lg">
                        <div className="flex gap-2 mb-4 border-b border-slate-700 pb-4">
                            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                        {/* Mockup UI configurator */}
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 h-64 flex flex-col justify-between overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-bl-full blur-xl"></div>
                            <div className="space-y-4">
                                <div className="h-4 w-1/3 bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-6 w-2/3 bg-slate-600 rounded"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="aspect-square bg-slate-800 rounded-lg border border-indigo-500/50 flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                    <span className="w-8 h-8 rounded border-2 border-indigo-400"></span>
                                    <span className="text-[10px] mt-2 font-bold text-indigo-400">P. Panjang</span>
                                </div>
                                <div className="aspect-square bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center opacity-50">
                                    <span className="text-[10px] font-bold">L-Shape</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-8 order-1 md:order-2">
                    <div className="inline-flex items-center gap-2 text-indigo-400 font-bold tracking-widest uppercase text-sm bg-indigo-900/40 px-4 py-2 rounded-full border border-indigo-500/30">
                        <Laptop size={16} /> Teknologi Afandi Interior
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                        {cmsData.title}
                    </h2>

                    <p className="text-lg text-slate-300 font-light leading-relaxed">
                        {cmsData.desc}
                    </p>

                    <div className="space-y-6 pt-4">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 shadow-inner">
                                <Maximize className="text-teal-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-1">Input Denah presisi</h4>
                                <p className="text-slate-400">Masukkan bentuk ruangan asli Anda beserta posisi celah pintu/jendela.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 shadow-inner">
                                <CircleDollarSign className="text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-1">Estimasi Harga Tepat</h4>
                                <p className="text-slate-400">Harga otomatis menyesuaikan luas dan material (HPL/PVC/Solid) yang Anda pilih secara instan tanpa perlu tebak-tebak biaya.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Link
                            to="/configurator"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-slate-900 rounded-xl font-black text-lg shadow-lg shadow-teal-500/20 transform hover:-translate-y-1 transition-all group"
                        >
                            Coba Configurator Sekarang <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
