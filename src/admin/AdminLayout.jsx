import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings } from 'lucide-react';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <aside className="w-64 bg-slate-900 border-r border-slate-200">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent border-slate-700">Workshop CMS</span>
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
                    <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <Settings size={20} />
                        <span>Pengaturan Web</span>
                    </NavLink>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm justify-between">
                    <h1 className="text-lg font-semibold text-slate-800">Admin Panel</h1>
                    <div className="flex items-center gap-4">
                        <NavLink to="/" className="text-sm text-teal-600 hover:text-teal-700 font-medium">Lihat Configurator &rarr;</NavLink>
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
