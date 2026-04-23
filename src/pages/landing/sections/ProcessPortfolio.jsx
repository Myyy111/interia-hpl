import React, { useState } from 'react';
import { MousePointerClick, CalendarCheck, Wrench, PartyPopper, X, Maximize2 } from 'lucide-react';

export function HowItWorks({ cmsData }) {
    const defaultSteps = [
        {
            icon: <MousePointerClick className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />,
            title: 'Online Configurator',
            desc: 'Pilih jenis perabot, masukkan ukuran dinding/ruangan secara instan, dan lihat harga estimasinya.',
            color: 'bg-indigo-600',
        },
        {
            icon: <CalendarCheck className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />,
            title: 'Survey Lokasi',
            desc: 'Tim ukur profesional Afandi Interior akan datang mensurvey ruang Anda untuk sinkronisasi layout.',
            color: 'bg-teal-500',
        },
        {
            icon: <Wrench className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />,
            title: 'Produksi Workshop',
            desc: 'Pengerjaan 1-3 minggu di fasilitas mandiri (workshop kami) dengan material custom.',
            color: 'bg-amber-500',
        },
        {
            icon: <PartyPopper className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />,
            title: 'Instalasi',
            desc: 'Pemasangan rapi dan cepat minimal debu. Ruangan baru Anda siap digunakan.',
            color: 'bg-rose-500',
        },
    ];

    const finalSteps = (cmsData || []).length > 0 ? cmsData.map((s, i) => ({
        ...s,
        icon: defaultSteps[i % defaultSteps.length].icon,
        color: defaultSteps[i % defaultSteps.length].color
    })) : defaultSteps;

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4 reveal">
                    <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Alur Kerja Mudah</div>
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">Cara Kerja Pemesanan</h2>
                </div>

                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden lg:block rounded-full"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {finalSteps.map((step, idx) => (
                            <div key={idx} className={`relative group p-6 text-center transform hover:-translate-y-2 transition-transform duration-300 reveal reveal-delay-${(idx+1)*100}`}>
                                <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg relative z-10 mb-8 border border-white" style={{ backgroundColor: 'var(--tw-colors-slate-50)' }}>
                                    <div className={`absolute inset-1 rounded-xl ${step.color} flex items-center justify-center shadow-inner group-hover:shadow-[0_0_20px_var(--color-current)]`}>
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border-2 border-white text-white font-bold text-sm flex items-center justify-center shadow-md">
                                        {idx + 1}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-slate-500 font-light leading-relaxed px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Portfolio({ cmsData }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const defaultWorks = [
        { span: 'col-span-1 row-span-2', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop', title: 'Modern Minimalist Kitchen', desc: 'Dapur minimalis dengan material HPL premium dan pencahayaan cerdas.' },
        { span: 'col-span-1 row-span-1', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop', title: 'Cozy Living Area', desc: 'Ruang tamu yang hangat dengan sentuhan kayu solid dan desain ergonomis.' },
        { span: 'col-span-1 row-span-1', img: 'https://images.unsplash.com/photo-1595522904535-ba2c628e93ad?q=80&w=800&auto=format&fit=crop', title: 'Master Bedroom Wardrobe', desc: 'Lemari pakaian custom yang memaksimalkan ruang penyimpanan kamar tidur utama.' },
        { span: 'col-span-2 row-span-1', img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop', title: 'Open Space TV Setup', desc: 'Instalasi TV gantung dengan backdrop HPL dan laci penyimpanan tersembunyi.' },
    ];

    const works = (cmsData || []).length > 0 ? cmsData.map((w, i) => ({
        ...w,
        span: defaultWorks[i] ? defaultWorks[i].span : 'col-span-1 row-span-1',
        desc: w.desc || (defaultWorks[i] ? defaultWorks[i].desc : 'Project interior berkualitas tinggi dari Afandi Interior.')
    })) : defaultWorks;

    return (
        <section id="portfolio" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 reveal">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-extrabold text-slate-900">Mahakarya Kami</h2>
                        <p className="text-slate-500 text-lg font-light">Eksplorasi estetika dan material dari klien sebelumnya.</p>
                    </div>
                    <a 
                        href="https://instagram.com/afandi_interior" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl font-bold transition-colors"
                    >
                        Lihat Semua Foto (IG)
                    </a>
                </div>

                {/* Mobile Slider / Desktop Grid */}
                <div className="flex md:grid md:grid-cols-3 md:auto-rows-[300px] gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
                    {works.map((w, i) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedItem(w)}
                            className={`
                                relative rounded-3xl overflow-hidden group shadow-md transition-all duration-500 
                                shrink-0 w-[85vw] md:w-auto snap-center cursor-pointer
                                ${w.span} ${w.span.includes('col-span-2') ? 'md:col-span-2' : ''} 
                                h-[450px] md:h-auto reveal reveal-delay-${(i+1)*100}
                            `}
                        >
                            <img src={w.img} alt={w.title} className="w-full h-full object-cover transform md:group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent flex flex-col justify-end p-6 md:p-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg md:text-xl font-bold text-white shadow-sm inline-block px-4 py-2 backdrop-blur-md bg-white/10 rounded-xl translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300 border border-white/10">
                                        {w.title}
                                    </h3>
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <Maximize2 size={20} />
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
                
                {/* Mobile Scroll Indicator */}
                <div className="flex md:hidden justify-center gap-2 mt-2">
                    {works.map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
                    <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row h-auto max-h-[90vh]">
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 md:text-white hover:bg-white transition-all z-20"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="w-full md:w-2/3 h-64 md:h-auto overflow-hidden">
                            <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="w-full md:w-1/3 p-8 flex flex-col justify-center">
                            <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Portfolio Detail</div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 leading-tight">{selectedItem.title}</h3>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8">
                                {selectedItem.desc}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <CalendarCheck size={18} className="text-teal-500" />
                                    </div>
                                    <span>Selesai Produksi</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <MousePointerClick size={18} className="text-indigo-500" />
                                    </div>
                                    <span>Material Pilihan</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                            >
                                Tutup Detail
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
