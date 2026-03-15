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

    const navTextColor = isScrolled ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-white';
    const logoTextColor = isScrolled ? 'text-slate-900' : 'text-white';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/brand/logo-icon.jpg" alt="Afandi Interior Logo" className="w-10 h-10 object-cover rounded-lg" />
                    <img src="/brand/logo-text.jpg" alt="Afandi Interior Text Logo" className="h-[46px] object-contain rounded-lg p-1 bg-white" />
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
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isScrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
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
                        <X size={24} className={isScrolled ? 'text-slate-900' : 'text-white'} />
                    ) : (
                        <Menu size={24} className={isScrolled ? 'text-slate-900' : 'text-white'} />
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
