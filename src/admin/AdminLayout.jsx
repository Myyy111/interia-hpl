import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut, ChevronDown } from 'lucide-react';
import AdminLogin from './AdminLogin';

const AdminLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

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
        <div className="min-h-screen bg-slate-50 flex">
            <aside className="w-64 bg-slate-900 border-r border-slate-200">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">Workshop CMS</span>
                </div>
                <nav className="p-4 space-y-2">
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
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm justify-between">
                    <h1 className="text-lg font-semibold text-slate-800">Admin Panel</h1>
                    <div className="flex items-center gap-6">
                        <NavLink to="/" className="text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors">Lihat Configurator &rarr;</NavLink>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 font-bold px-3 py-2 rounded-lg hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                        >
                            <LogOut size={16} /> Keluar
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 bg-slate-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
