import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fdf8f3 0%, #f5ede0 50%, #fdf8f3 100%)' }}>

            {/* Decorative blobs */}
            <div className="absolute top-[-8%] right-[-4%] w-[500px] h-[500px] rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(circle, #e8d5b7, transparent)' }} />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #d4b896, transparent)' }} />

            {/* Thin horizontal line accent */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #b08d57, transparent)' }} />

            <div className="max-w-lg w-full text-center relative z-10">

                {/* Brand mark */}
                <div className="flex justify-center mb-10">
                    <div className="flex flex-col items-center">
                        <span className="font-['Playfair_Display'] text-[22px] font-bold text-[#b08d57] leading-none">Afandi</span>
                        <span className="font-['Cinzel'] text-[8px] tracking-[0.35em] font-bold text-[#4a423e] uppercase mt-1">Interior</span>
                    </div>
                </div>

                {/* 404 Visual */}
                <div className="relative mb-10 select-none">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-[130px] font-black leading-none" style={{ color: '#e8d5b7', fontFamily: 'Playfair Display, serif', letterSpacing: '-0.05em' }}>4</span>
                        <div className="w-24 h-24 rounded-3xl shadow-2xl flex items-center justify-center animate-float shrink-0" style={{ background: 'linear-gradient(135deg, #b08d57, #d4a96a)', boxShadow: '0 20px 60px rgba(176, 141, 87, 0.4)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                        </div>
                        <span className="text-[130px] font-black leading-none" style={{ color: '#e8d5b7', fontFamily: 'Playfair Display, serif', letterSpacing: '-0.05em' }}>4</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-8 px-8">
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #d4b896)' }} />
                    <span className="text-[10px] font-black tracking-[0.3em] text-[#b08d57] uppercase">Halaman Tidak Ditemukan</span>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #d4b896)' }} />
                </div>

                {/* Description */}
                <p className="text-[#7a6a58] text-sm leading-relaxed max-w-sm mx-auto mb-10 font-medium">
                    Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan kembali ke beranda.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-8 py-4 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 w-full sm:w-auto shadow-xl"
                        style={{ background: 'linear-gradient(135deg, #b08d57, #c9a46b)', boxShadow: '0 8px 30px rgba(176,141,87,0.35)' }}
                    >
                        <Home size={16} /> Ke Beranda
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 w-full sm:w-auto border-2"
                        style={{ color: '#b08d57', borderColor: '#d4b896', background: 'rgba(255,255,255,0.8)' }}
                    >
                        <ArrowLeft size={16} /> Kembali
                    </button>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-14px) rotate(2deg); }
                }
                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}
