import React from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export function Blog({ cmsData, contactData }) {
    const defaultArticles = [
        {
            title: '5 Tips Memilih Material HPL untuk Dapur Minimalis',
            date: '12 Feb 2026',
            img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop',
            desc: 'Pelajari karakter masing-masing pelapis kayu agar awet puluhan tahun...',
        },
        {
            title: 'Warna Interior Paling Dicari Tahun Ini',
            date: '08 Feb 2026',
            img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop',
            desc: 'Dari Sage Green hingga warna-warna earth tone yang menenangkan...',
        },
        {
            title: 'Perbedaan Multiplek vs Blockboard Jati',
            date: '24 Jan 2026',
            img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop',
            desc: 'Sebelum membuat lemari custom, kenali jenis kayu inti terbaik untuk budget Anda.',
        },
    ];

    const articles = (cmsData || []).length > 0 ? cmsData : defaultArticles;

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-extrabold text-slate-900">Inspirasi & Edukasi</h2>
                        <p className="text-slate-500 font-light text-lg">Tips merawat dan ide desain dari arsitek kami.</p>
                    </div>
                    <button 
                        onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 font-bold text-teal-600 hover:text-indigo-600 transition-colors uppercase tracking-widest text-sm"
                    >
                        Lihat Blog Lainnya <ArrowRight size={16} />
                    </button>
                </div>

                {/* Mobile Slider / Desktop Grid */}
                <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
                    {articles.map((a, i) => (
                        <article key={i} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 shrink-0 w-[85vw] md:w-auto snap-center">
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold text-slate-900 px-3 py-1.5 rounded-full z-10 shadow-sm">
                                    {a.date}
                                </div>
                                <img src={a.img} alt={a.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-teal-600 transition-colors uppercase tracking-tight leading-tight">{a.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-light">{a.desc}</p>
                                <a 
                                    href={`https://wa.me/${contactData?.phone?.replace(/[^0-9]/g, '') || ''}?text=Halo Afandi Interior, saya ingin membaca lebih lanjut tentang artikel: ${a.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold text-teal-600 uppercase tracking-[0.2em] cursor-pointer inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                                >
                                    Baca Selengkapnya
                                    <ArrowRight size={16} />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Mobile Slider Dots */}
                <div className="flex md:hidden justify-center gap-2.5 mt-6">
                    {articles.map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Contact({ cmsData }) {
    if (!cmsData) return null;

    return (
        <section id="kontak" className="py-24 bg-slate-900 text-slate-300 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row gap-16 items-center">

                <div className="flex-1 space-y-8">
                    <div className="text-sm font-bold text-teal-400 uppercase tracking-widest relative inline-block">
                        Siap untuk memulai?
                        <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-teal-400 rounded-full"></div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                        Kunjungi <span className="text-indigo-400">Workshop</span><br />atau hubungi kami.
                    </h2>

                    <p className="text-lg leading-relaxed font-light text-slate-400 max-w-md">
                        Tim desain dan spesialis perakitan kami siap menjawab setiap pertanyaan Anda mengenai pembuatan furnitur.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                <Phone className="text-teal-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">WhatsApp Langsung</h4>
                                <p className="text-slate-400">{cmsData.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                <Mail className="text-teal-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Email Pertanyaan</h4>
                                <p className="text-slate-400">{cmsData.email}</p>
                            </div>
                        </div>
                    </div>

                    <a href={`https://wa.me/${cmsData.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 mt-8 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-slate-900 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-1 w-full max-w-xs justify-center uppercase tracking-wider text-sm">
                        Chat WhatsApp
                    </a>
                </div>

                <div className="flex-1 w-full">
                    <div className="bg-slate-800 rounded-3xl p-6 border-2 border-slate-700 shadow-2xl relative">
                        <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg z-10 hidden md:block border border-slate-200">
                            <div className="flex items-center gap-3 mb-2">
                                <img src="/brand/logo-icon-dark.png" alt="Icon" className="w-8 h-8 object-contain drop-shadow-sm" />
                                <div>
                                    <h5 className="font-bold text-slate-900 leading-none">Afandi Interior Workshop</h5>
                                    <p className="text-[10px] text-slate-500">Jakarta Selatan</p>
                                </div>
                            </div>
                            <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 flex items-center gap-1 font-bold">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                Buka hingga 17:00 WIB
                            </div>
                        </div>
                        <div className="w-full h-80 bg-slate-700 rounded-2xl overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-luminosity opacity-80" alt="Map Location" />
                            <div className="absolute inset-0 bg-indigo-500/10 hover:bg-transparent transition-colors duration-500"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-indigo-500 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                                <MapPin className="text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
