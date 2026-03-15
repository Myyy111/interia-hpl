import React from 'react';
import { Sofa, LayoutDashboard, Hammer, ShieldCheck, Ruler, ThumbsUp, Utensils } from 'lucide-react';

export function About({ cmsData }) {
    if (!cmsData) return null;
    return (
        <section id="tentang" className="py-24 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 transform origin-top shadow-inner"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                    <div className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] relative before:content-[''] before:absolute before:left-[-40px] before:top-1/2 before:w-8 before:h-px before:bg-indigo-600">
                        Lebih Dari Sekadar Furniture
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                        Afandi Interior: Kombinasi <br /> <span className="text-indigo-600">Seni Desain</span> & <span className="text-teal-500">Keahlian</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed font-light">
                        {cmsData.description}
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <ShieldCheck className="text-indigo-500 shrink-0" size={28} />
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Garansi Kualitas</h4>
                                <p className="text-sm text-slate-500">Material HPL tahan aus terbaik</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <Ruler className="text-indigo-500 shrink-0" size={28} />
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Presisi Milimeter</h4>
                                <p className="text-sm text-slate-500">Ukuran akurat 100% custom</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <img
                        src={cmsData.img || "https://images.unsplash.com/photo-1540932239986-30128078f3d5?q=80&w=1200&auto=format&fit=crop"}
                        className="w-full rounded-2xl shadow-xl border-4 border-white transform md:-rotate-3 hover:rotate-0 transition-transform duration-500"
                        alt="Tim Workshop Afandi Interior"
                    />
                    <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-2xl animate-float border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-black text-2xl">
                                {cmsData.badgeValue || '5+'}
                            </div>
                            <div>
                                <h5 className="font-bold text-lg text-slate-900">{cmsData.badgeTitle || 'Tahun Pengalaman'}</h5>
                                <p className="text-slate-500 text-sm">{cmsData.badgeSub || 'Workshop Produksi Sendiri'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Services({ cmsData }) {
    const defaultServices = [
        {
            icon: <LayoutDashboard size={40} className="text-indigo-600" />,
            title: 'Desain Interior Custom',
            desc: 'Solusi perancangan tata ruang, mulai dari apartemen kecil hingga rumah mewah dengan arsitek in-house.'
        },
        {
            icon: <Utensils size={40} className="text-indigo-600" />,
            title: 'Pembuatan Kitchen Set',
            desc: 'Dapur estetik dan fungsional (L-shape, U-shape, dll) dengan perhitungan ergonomi presisi dan aksesoris rak cerdas.'
        },
        {
            icon: <Sofa size={40} className="text-indigo-600" />,
            title: 'Furniture Custom',
            desc: 'Wardrobe lemari pakaian, rak TV, meja kerja cerdas yang didesain khusus menyesuaikan luas ruangan Anda.'
        },
        {
            icon: <Hammer size={40} className="text-indigo-600" />,
            title: 'Renovasi Interior Lengkap',
            desc: 'Dari perubahan partisi drywall, plafon, elektrikal hingga instalasi akhir furniture oleh tim ahli.'
        },
    ];

    const services = (cmsData || []).length > 0 ? cmsData.map((d, i) => ({
        ...d,
        icon: defaultServices[i] ? defaultServices[i].icon : <Sofa size={40} className="text-indigo-600" />
    })) : defaultServices;

    return (
        <section id="layanan" className="py-24 bg-slate-50 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em]">Layanan Afandi Interior</div>
                    <h2 className="text-4xl font-extrabold text-slate-900">Spesialisasi Kami</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((s, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col h-full transform hover:-translate-y-2 duration-300">
                            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                {s.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{s.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-light flex-1">{s.desc}</p>

                            <a 
                                href={`https://wa.me/${cmsData?.phone?.replace(/[^0-9]/g, '') || ''}?text=Halo Afandi Interior, saya ingin bertanya tentang ${s.title}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 flex items-center text-sm font-bold text-indigo-600 group-hover:text-indigo-800 uppercase tracking-widest gap-2"
                            >
                                Pelajari <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
