import React from 'react';
import { Sparkles, ChevronRight, Layers, Ruler, DoorOpen, Palette, CheckCircle, Camera, Send } from 'lucide-react';

const STEPS_INFO = [
    { icon: Layers, label: 'Pilih Produk', desc: 'Jenis furnitur & model' },
    { icon: Ruler, label: 'Ukuran Ruangan', desc: 'Dimensi & bentuk ruangan' },
    { icon: DoorOpen, label: 'Pintu & Jendela', desc: 'Posisi & ukuran bukaan' },
    { icon: Palette, label: 'Gaya & Material', desc: 'Material & aksesori' },
    { icon: CheckCircle, label: 'Review Pesanan', desc: 'Ringkasan konfigurasi' },
    { icon: Camera, label: 'Upload Foto', desc: 'Opsional - foto ruangan' },
    { icon: Send, label: 'Form Kontak', desc: 'Data pengiriman' },
];

export default function WelcomeScreen({ onStart }) {
    return (
        <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
                
                {/* Grid pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
                    <defs>
                        <pattern id="welcome-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#welcome-grid)" />
                </svg>
            </div>

            <div className="relative z-10 max-w-4xl w-full text-center">
                {/* Logo / Brand */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-6 md:mb-8 w-full">
                    <div className="flex justify-end pr-3 md:pr-4">
                        <img src="/brand/logo-icon-dark.png" alt="Afandi Interior" className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-glow" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="font-playfair text-[24px] md:text-[28px] font-bold leading-[0.85] text-[#b08d57] uppercase">Afandi</span>
                        <span className="font-cinzel text-[9px] md:text-[10px] mt-1.5 md:mt-2 tracking-[0.34em] font-bold text-slate-300 ml-[2px]">INTERIOR</span>
                    </div>
                    <div className="pl-3 md:pl-4"></div>
                </div>

                {/* Hero Text */}
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                    <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 text-teal-300 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold backdrop-blur-sm">
                        <Sparkles size={14} />
                        Interior Design Configurator
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Desain ruangan <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-amber-300">
                            impianmu
                        </span>
                        {' '}dalam{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
                            7 langkah
                        </span>
                    </h1>

                    <p className="text-slate-300 text-sm md:text-lg leading-relaxed max-w-xl mx-auto hidden sm:block">
                        Konfigurasi furniture custom, estimasi harga real-time, dan kirimkan langsung ke tim workshop kami — tanpa ribet.
                    </p>
                </div>

                {/* Steps Preview */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 md:mb-8 text-left max-w-3xl mx-auto">
                    {STEPS_INFO.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 md:px-4 md:py-3 hover:bg-white/10 transition-colors w-full sm:w-[calc(50%-0.375rem)] md:w-[220px] flex-shrink-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-500/20 border border-teal-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <step.icon size={16} className="text-teal-400 md:w-5 md:h-5" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-white text-xs md:text-sm font-semibold truncate">{step.label}</div>
                                <div className="text-slate-400 text-[10px] md:text-xs truncate">{step.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={onStart}
                    id="btn-start-configurator"
                    className="group inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-teal-600 to-amber-500 hover:from-teal-500 hover:to-amber-400 text-white font-bold text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4 rounded-2xl shadow-xl shadow-teal-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-teal-500/40 active:scale-95"
                >
                    Mulai Konfigurasi Sekarang
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="mt-4 text-slate-500 text-xs md:text-sm">
                    ✓ Gratis &nbsp;&nbsp; ✓ Tanpa daftar &nbsp;&nbsp; ✓ Estimasi instan
                </p>
                <p className="text-[10px] text-slate-800/10 mt-4">v1.1</p>
            </div>
        </div>
    );
}
