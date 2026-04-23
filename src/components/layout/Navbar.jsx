import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar({ contactData }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Layanan', href: '#layanan' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Teknologi', href: '#teknologi' },
        { name: 'Tentang Kami', href: '#tentang' },
        { name: 'Kontak', href: '#kontak' },
    ];

    const handleNavClick = (e, href) => {
        if (location.pathname !== '/') return;
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: offsetTop - 80,
                behavior: 'smooth'
            });
            setMobileMenuOpen(false);
        }
    };

    const isHeaderSolid = isScrolled || mobileMenuOpen;
    const navTextColor = isHeaderSolid ? 'text-slate-900 hover:text-teal-600' : 'text-white/90 hover:text-white';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isHeaderSolid ? 'glass py-3 shadow-lg' : 'bg-transparent py-8'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-4 group" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative">
                        <img src={isHeaderSolid ? "/brand/logo-icon-dark.png" : "/brand/logo-icon-light.png"} alt="Afandi Interior Logo" className="w-[60px] h-[60px] object-contain drop-shadow-md transition-all duration-500 group-hover:scale-110" />
                        {!isHeaderSolid && <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                    </div>
                    <div className="flex flex-col items-start">
                        <span className={`font-['Playfair_Display'] text-[24px] font-black leading-none tracking-tight transition-colors duration-500 ${isHeaderSolid ? 'text-slate-900' : 'text-white'}`}>Afandi</span>
                        <span className={`font-['Cinzel'] text-[9px] tracking-[0.4em] font-bold mt-1 transition-colors duration-500 ${isHeaderSolid ? 'text-teal-600' : 'text-teal-400'}`}>INTERIOR</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`relative text-[13px] font-black uppercase tracking-[0.2em] transition-all group ${navTextColor}`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${isHeaderSolid ? 'bg-teal-600' : 'bg-white'}`}></span>
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden lg:flex items-center">
                    <Link
                        to="/configurator"
                        className={`
                            group flex items-center gap-3 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl 
                            active:scale-95
                            ${isHeaderSolid 
                                ? 'bg-slate-900 text-white hover:bg-teal-600' 
                                : 'bg-white text-slate-900 hover:bg-teal-100 hover:text-teal-900 shadow-white/10'
                            }
                        `}
                    >
                        Mulai Desain <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className={`lg:hidden p-3 rounded-2xl transition-all ${isHeaderSolid ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white backdrop-blur-md'}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-4 right-4 mt-4 bg-white/95 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.2)] rounded-[2.5rem] border border-slate-100 flex flex-col p-8 space-y-6 animate-modal-in overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    {navLinks.map((link, i) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`text-slate-900 font-black text-2xl tracking-tight transition-all hover:text-teal-600 flex items-center justify-between group animate-fade-in-up`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {link.name}
                            <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                        </a>
                    ))}
                    
                    <div className="pt-6 space-y-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                        <Link
                            to="/configurator"
                            className="flex items-center justify-center gap-3 w-full py-5 bg-teal-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
                        >
                            Mulai Desain Kustom <ArrowRight size={18} />
                        </Link>
                        {contactData?.phone && (
                            <a 
                                href={`https://wa.me/${contactData.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-5 bg-slate-50 text-slate-900 rounded-[1.5rem] font-black text-sm uppercase tracking-widest border border-slate-100 active:scale-95 transition-all"
                            >
                                Konsultasi WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
