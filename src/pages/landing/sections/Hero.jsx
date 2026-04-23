import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MoveRight, ChevronDown, Layers, Wrench } from 'lucide-react';

export default function Hero({ cmsData }) {
    if (!cmsData) return null;

    return (
        <section className="relative min-h-screen lg:h-screen flex items-center pt-32 pb-20 lg:pt-20 justify-center bg-[#1c1917] overflow-hidden">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0 flex justify-center items-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                    alt="Modern Interior Design"
                    className="min-w-full min-h-full object-cover opacity-30 object-center scale-100 animate-[slow-scale_30s_ease-in-out_infinite_alternate]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1c1917] via-transparent to-[#1c1917]/30"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdfaf6]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Text Side */}
                    <div className="lg:col-span-7 text-center lg:text-left space-y-8 lg:space-y-10 animate-fade-in-up">
                        <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-teal-500/20 bg-white/5 backdrop-blur-2xl shadow-2xl">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.4em]">Exquisite Interior Craftsmanship</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] lg:leading-[0.9] drop-shadow-sm">
                            {cmsData.title.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    <span className={i === 1 ? "text-teal-600 italic font-medium block mt-2" : "block"}>
                                        {line}
                                    </span>
                                </React.Fragment>
                            ))}
                        </h1>

                        <p className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                            {cmsData.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 lg:gap-6 pt-4 justify-center lg:justify-start">
                            <Link
                                to="/configurator"
                                className="relative inline-flex items-center justify-center gap-4 px-10 lg:px-12 py-5 lg:py-6 bg-slate-900 text-white rounded-[2rem] font-black transition-all shadow-2xl hover:bg-teal-600 transform hover:-translate-y-2 active:scale-95 text-lg group overflow-hidden"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shine_2s_ease-out]"></span>
                                Mulai Desain
                                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <a
                                href="#portfolio"
                                className="inline-flex items-center justify-center gap-2 px-10 lg:px-12 py-5 lg:py-6 bg-white hover:bg-slate-50 text-slate-900 shadow-xl border border-slate-100 rounded-[2rem] font-black transition-all hover:-translate-y-2 active:scale-95 text-lg"
                            >
                                Portfolio
                            </a>
                        </div>
                        
                        <div className="pt-8 lg:pt-10 flex items-center justify-center lg:justify-start gap-8 lg:gap-12 border-t border-slate-200/50">
                            <div>
                                <p className="text-2xl lg:text-3xl font-black text-slate-900">150+</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Projects Done</p>
                            </div>
                            <div className="w-px h-10 bg-slate-200"></div>
                            <div>
                                <p className="text-2xl lg:text-3xl font-black text-slate-900">10+</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Years Experience</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="lg:col-span-5 hidden lg:block perspective-2000 relative h-full flex items-center justify-center">
                        <div className="absolute -inset-10 bg-teal-500/10 blur-[120px] rounded-full animate-pulse"></div>
                        <div className="relative transform rotate-y-[-15deg] rotate-x-[10deg] hover:rotate-y-[-5deg] transition-transform duration-1000 ease-out w-full max-w-sm lg:max-w-md">
                            <div className="rounded-[3rem] p-2.5 bg-white/30 backdrop-blur-md border border-white/50 shadow-2xl overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                                    className="rounded-[2.5rem] shadow-2xl object-cover aspect-[3/4] w-full"
                                    alt="Premium Interior" />
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -left-12 top-1/4 glass p-5 rounded-[2rem] shadow-2xl animate-float">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white">
                                        <Layers size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pricing Model</p>
                                        <p className="text-sm font-black text-slate-900 leading-none">Estimator</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute -right-8 bottom-1/4 glass p-5 rounded-[2rem] shadow-2xl animate-float" style={{ animationDelay: '1.5s' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                        <Wrench size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Service</p>
                                        <p className="text-sm font-black text-slate-900 leading-none">Custom</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <a href="#tentang" className="absolute bottom-10 lg:bottom-12 left-1/2 -translate-x-1/2 text-slate-400 hover:text-teal-600 transition-colors animate-bounce">
                <ChevronDown size={32} />
            </a>
        </section>
    );
}
    );
}
