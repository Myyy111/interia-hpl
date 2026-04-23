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
        { span: 'col-span-1 row-span-2', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop', title: 'Modern Minimalist Kitchen', desc: 'Dapur minimalis dengan material HPL premium dan pencahayaan cerdas yang menciptakan suasana hangat namun tetap fungsional.', category: 'Kitchen Set' },
        { span: 'col-span-1 row-span-1', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop', title: 'Cozy Living Area', desc: 'Ruang tamu yang hangat dengan sentuhan kayu solid dan desain ergonomis untuk kenyamanan keluarga.', category: 'Living Room' },
        { span: 'col-span-1 row-span-1', img: 'https://images.unsplash.com/photo-1595522904535-ba2c628e93ad?q=80&w=800&auto=format&fit=crop', title: 'Master Bedroom Wardrobe', desc: 'Lemari pakaian custom yang memaksimalkan setiap jengkal ruang penyimpanan kamar tidur utama.', category: 'Bedroom' },
        { span: 'col-span-2 row-span-1', img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop', title: 'Open Space TV Setup', desc: 'Instalasi TV gantung dengan backdrop HPL bermotif serat kayu alami dan laci penyimpanan tersembunyi.', category: 'Entertainment' },
    ];

    const works = (cmsData || []).length > 0 ? cmsData.map((w, i) => ({
        ...w,
        span: defaultWorks[i] ? defaultWorks[i].span : 'col-span-1 row-span-1',
        desc: w.desc || (defaultWorks[i] ? defaultWorks[i].desc : 'Project interior berkualitas tinggi dari Afandi Interior.'),
        category: w.category || (defaultWorks[i] ? defaultWorks[i].category : 'Custom Furniture')
    })) : defaultWorks;

    return (
        <section id="portfolio" className="py-24 bg-[#fdfaf6]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 reveal">
                    <div className="space-y-4">
                        <div className="text-sm font-bold text-teal-600 uppercase tracking-[0.3em]">Signature Collection</div>
                        <h2 className="text-5xl font-black text-slate-900">Mahakarya Kami</h2>
                        <p className="text-slate-500 text-lg font-light max-w-md italic">"Setiap sudut ruangan memiliki cerita, dan kami di sini untuk menulisnya bersama Anda."</p>
                    </div>
                    <a 
                        href="https://instagram.com/afandi_interior" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:bg-teal-600 shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        Eksplorasi di Instagram
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-45 transition-transform">
                            <Maximize2 size={16} />
                        </div>
                    </a>
                </div>

                {/* Magazine Grid */}
                <div className="flex md:grid md:grid-cols-3 md:auto-rows-[320px] gap-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
                    {works.map((w, i) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedItem(w)}
                            className={`
                                relative rounded-[2rem] overflow-hidden group shadow-2xl transition-all duration-700 
                                shrink-0 w-[85vw] md:w-auto snap-center cursor-pointer magazine-card
                                ${w.span} ${w.span.includes('col-span-2') ? 'md:col-span-2' : ''} 
                                h-[500px] md:h-auto reveal reveal-delay-${(i+1)*100}
                            `}
                        >
                            <img src={w.img} alt={w.title} className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000" />
                            
                            <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-10">
                                <div className="space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-xs font-black text-teal-400 uppercase tracking-widest bg-slate-900/50 backdrop-blur-sm px-3 py-1 rounded-full">{w.category}</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                        {w.title}
                                    </h3>
                                    <div className="h-0.5 w-12 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </div>

                            {/* Hover Overlay Icon */}
                            <div className="absolute top-8 right-8 z-20 w-12 h-12 rounded-full glass flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
                                <Maximize2 size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity duration-500" onClick={() => setSelectedItem(null)}></div>
                    
                    <div className="bg-[#fdfaf6] w-full max-w-6xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative z-10 flex flex-col lg:flex-row h-auto max-h-[95vh] animate-modal-in border border-white/20">
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white lg:text-slate-900 lg:bg-slate-100 lg:hover:bg-slate-200 transition-all z-20 shadow-xl"
                        >
                            <X size={32} />
                        </button>
                        
                        {/* Left: Hero Image */}
                        <div className="w-full lg:w-2/3 h-80 lg:h-auto overflow-hidden relative group">
                            <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute top-8 left-8">
                                <span className="bg-teal-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-2xl">
                                    {selectedItem.category}
                                </span>
                            </div>
                        </div>
                        
                        {/* Right: Refined Content */}
                        <div className="w-full lg:w-1/3 p-10 md:p-16 flex flex-col justify-center bg-white">
                            <div className="space-y-8">
                                <div>
                                    <div className="h-1 w-20 bg-teal-600 mb-8 rounded-full"></div>
                                    <h3 className="text-4xl md:text-5xl font-black text-slate-950 mb-6 leading-[1.1] tracking-tight">
                                        {selectedItem.title}
                                    </h3>
                                    <p className="text-slate-500 text-lg leading-relaxed font-light">
                                        {selectedItem.desc}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                                            <CalendarCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Proyek</p>
                                            <p className="font-bold text-slate-900">Selesai Produksi & Terpasang</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                            <MousePointerClick size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Material Utama</p>
                                            <p className="font-bold text-slate-900">Premium HPL - Anti Scratched</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                                    <a 
                                        href={`https://wa.me/628123456789?text=Halo Afandi Interior, saya sangat menyukai desain: ${selectedItem.title}. Bisa bantu wujudkan di rumah saya?`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-teal-600 text-white rounded-2xl font-black hover:bg-teal-700 transition-all shadow-xl shadow-teal-500/20 active:scale-95"
                                    >
                                        Wujudkan Desain Ini
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
