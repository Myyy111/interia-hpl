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
    const navTextColor = isHeaderSolid ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-white';
    const logoTextColor = isHeaderSolid ? 'text-slate-900' : 'text-white';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHeaderSolid ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
                    <img src={isHeaderSolid ? "/brand/logo-icon-dark.png" : "/brand/logo-icon-light.png"} alt="Afandi Interior Logo" className="w-[72px] h-[72px] object-contain drop-shadow-md transition-all duration-300" />
                    <div className="flex flex-col items-start ml-0 mt-1">
                        <span className={`font-['Playfair_Display'] text-[28px] font-bold leading-[0.85] transition-colors duration-300 ${isHeaderSolid ? 'text-[#b08d57]' : 'text-white'}`}>Afandi</span>
                        <span className={`font-['Cinzel'] text-[10px] mt-2 tracking-[0.34em] font-bold pl-0.5 transition-colors duration-300 ${isHeaderSolid ? 'text-[#4a423e]' : 'text-slate-300'}`}>INTERIOR</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`text-sm font-medium transition-colors ${navTextColor}`}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center">
                    <Link
                        to="/configurator"
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isHeaderSolid ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
                    >
                        Mulai Desain <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden p-2 rounded-lg"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X size={28} className={isHeaderSolid ? 'text-slate-900' : 'text-white'} />
                    ) : (
                        <Menu size={28} className={isHeaderSolid ? 'text-slate-900' : 'text-white'} />
                    )}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 flex flex-col p-6 space-y-4 animate-fade-in">
                    {navLinks.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="text-slate-700 font-medium text-lg py-2 border-b border-slate-50"
                        >
                            {link.name}
                        </a>
                    ))}
                    <Link
                        to="/configurator"
                        className="flex items-center justify-center gap-2 w-full py-4 mt-4 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20"
                    >
                        Mulai Desain Sekarang <ArrowRight size={20} />
                    </Link>
                    {contactData?.phone && (
                        <a 
                            href={`https://wa.me/${contactData.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold"
                        >
                            Hubungi WhatsApp
                        </a>
                    )}
                </div>
            )}
        </header>
    );
}
