import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut, ChevronDown } from 'lucide-react';
import AdminLogin from './AdminLogin';

const AdminLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('admin_auth') === 'true');
    const [isLoading] = useState(false);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMobileMenuOpen(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
        navigate('/admin');
    };

    if (isLoading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    if (!isAuthenticated) {
        return <AdminLogin onLogin={setIsAuthenticated} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">Workshop CMS</span>
                </div>
                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
                    <NavLink to="/admin" end className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <ShoppingCart size={20} />
                        <span>Pesanan</span>
                    </NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <Package size={20} />
                        <span>Produk & Harga</span>
                    </NavLink>

                    {/* Dropdown Pengaturan Web */}
                    <div className="pt-2">
                        <button 
                            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${showSettingsDropdown ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <Settings size={20} />
                                <span>Pengaturan Web</span>
                            </div>
                            <ChevronDown size={16} className={`transform transition-transform ${showSettingsDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showSettingsDropdown && (
                            <div className="mt-2 ml-4 pl-4 border-l border-slate-800 space-y-1">
                                <NavLink to="/admin/settings" end className={({ isActive }) => `block px-4 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'text-teal-400 bg-teal-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
                                    Umum & Hero
                                </NavLink>
                                <NavLink to="/admin/settings/catalog" className={({ isActive }) => `block px-4 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'text-teal-400 bg-teal-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
                                    Katalog & Portofolio
                                </NavLink>
                                <NavLink to="/admin/settings/community" className={({ isActive }) => `block px-4 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'text-teal-400 bg-teal-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
                                    Tim & Testimoni
                                </NavLink>
                                <NavLink to="/admin/settings/blog" className={({ isActive }) => `block px-4 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'text-teal-400 bg-teal-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
                                    Manajemen Blog
                                </NavLink>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden w-full">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 shadow-sm justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            <LayoutDashboard size={24} />
                        </button>
                        <h1 className="text-lg font-bold text-slate-800 truncate">Admin Panel</h1>
                    </div>
                    
                    <div className="flex items-center gap-3 md:gap-6">
                        <NavLink to="/" className="hidden sm:block text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors">Lihat Web &rarr;</NavLink>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-xs md:text-sm text-rose-500 hover:text-rose-600 font-bold px-3 py-2 rounded-lg hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                        >
                            <LogOut size={16} /> <span className="hidden xs:inline">Keluar</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
