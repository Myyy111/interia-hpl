import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    Settings, 
    LogOut, 
    ChevronDown, 
    Menu, 
    X, 
    Globe, 
    User,
    Image as ImageIcon,
    FileText,
    Users
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import { supabase } from '../lib/api';

const AdminLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('admin_auth') === 'true');
    const [isLoading] = useState(false);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(true); // Default open for easier navigation
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    const fetchPendingCount = async () => {
        try {
            const { count, error } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'Selesai')
                .neq('status', 'Draft');
            
            if (!error) setPendingCount(count || 0);
        } catch (err) {
            console.error('Error fetching count:', err);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        
        fetchPendingCount();

        const channel = supabase
            .channel('sidebar-orders')
            .on(
                'postgres_changes', 
                { event: '*', table: 'orders', schema: 'public' }, 
                () => fetchPendingCount()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
        navigate('/admin');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin onLogin={setIsAuthenticated} />;
    }

    const navItemClass = ({ isActive }) => `
        group flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300
        ${isActive 
            ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
    `;

    const subNavItemClass = ({ isActive }) => `
        group flex items-center space-x-3 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300
        ${isActive 
            ? 'text-slate-900 bg-slate-100 translate-x-1' 
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}
    `;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="h-20 flex items-center px-8 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                                <Settings className="text-white" size={18} />
                            </div>
                            <span className="text-lg font-black tracking-tight text-slate-900">AFANDI<span className="text-slate-400 font-light ml-1 text-base uppercase tracking-widest">CMS</span></span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
                        <div className="space-y-1">
                            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
                            <NavLink to="/admin" end className={navItemClass}>
                                <div className="flex items-center space-x-3">
                                    <LayoutDashboard size={18} />
                                    <span>Ringkasan</span>
                                </div>
                            </NavLink>
                            <NavLink to="/admin/orders" className={navItemClass}>
                                <div className="flex items-center space-x-3">
                                    <ShoppingCart size={18} />
                                    <span>Pesanan Masuk</span>
                                </div>
                                {pendingCount > 0 && (
                                    <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse-subtle">
                                        {pendingCount}
                                    </span>
                                )}
                            </NavLink>
                            <NavLink to="/admin/products" className={navItemClass}>
                                <div className="flex items-center space-x-3">
                                    <Package size={18} />
                                    <span>Master Produk</span>
                                </div>
                            </NavLink>
                        </div>

                        <div className="space-y-1">
                            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Website Content</p>
                            
                            <button 
                                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
                            >
                                <div className="flex items-center space-x-3">
                                    <Globe size={18} />
                                    <span>Edit Konten Web</span>
                                </div>
                                <ChevronDown size={14} className={`transform transition-transform ${showSettingsDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {showSettingsDropdown && (
                                <div className="mt-2 space-y-1 pl-4 border-l-2 border-slate-50 ml-6 animate-fade-in">
                                    <NavLink to="/admin/settings" end className={subNavItemClass}>
                                        <div className="w-1 h-1 rounded-full bg-slate-300 group-[.active]:bg-slate-900 group-hover:bg-slate-900 transition-colors"></div>
                                        <span>Hero & Landing</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/catalog" className={subNavItemClass}>
                                        <div className="w-1 h-1 rounded-full bg-slate-300 group-[.active]:bg-slate-900 group-hover:bg-slate-900 transition-colors"></div>
                                        <span>Portofolio Grid</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/community" className={subNavItemClass}>
                                        <div className="w-1 h-1 rounded-full bg-slate-300 group-[.active]:bg-slate-900 group-hover:bg-slate-900 transition-colors"></div>
                                        <span>Tim & Testimoni</span>
                                    </NavLink>
                                    <NavLink to="/admin/settings/blog" className={subNavItemClass}>
                                        <div className="w-1 h-1 rounded-full bg-slate-300 group-[.active]:bg-slate-900 group-hover:bg-slate-900 transition-colors"></div>
                                        <span>Manajemen Blog</span>
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/20">
                        <div className="flex items-center gap-4 px-2 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                                <User size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest truncate">Administrator</p>
                                <p className="text-[10px] font-bold text-slate-400 truncate">Super Admin</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-500 bg-white border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm shadow-rose-100 active:scale-95"
                        >
                            <LogOut size={16} />
                            Keluar Sistem
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-8 lg:px-12 justify-between sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Pages</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-900">Dashboard</span>
                        </div>
                        <h2 className="lg:hidden text-lg font-black tracking-tight">DASHBOARD</h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <NavLink 
                            to="/" 
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2 rounded-lg transition-all"
                        >
                            <Globe size={16} />
                            <span className="hidden sm:inline">Pratinjau Web</span>
                        </NavLink>
                        <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase">Server Online</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 scroll-smooth">
                    <div className="max-w-6xl mx-auto animate-fade-in-up">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
