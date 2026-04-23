import React, { useEffect, useState } from 'react';
import { Eye, X, Image as ImageIcon, ShoppingBag, Clock, CheckCircle2, AlertCircle, Phone, MapPin, Package, Wrench, User } from 'lucide-react';
import { api, supabase } from '../lib/api';
import RoomPreview2D from '../components/RoomPreview2D';
import { MATERIAL_COLORS, WALL_POS } from '../lib/constants';
import { CMSHeader } from './cms/CMSComponents';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = (showLoader = false) => {
        if (showLoader) setLoading(true);
        api.getOrders().then((data) => {
            if (!Array.isArray(data)) {
                setOrders([]);
                setLoading(false);
                return;
            }
            const realOrders = data.filter(o => o && o.status !== 'Draft' && o.customer?.name);
            setOrders(realOrders);
            setLoading(false);
        }).catch(err => {
            console.error('Error fetching orders:', err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchOrders();

        // Realtime Subscription
        const channel = supabase
            .channel('realtime-orders')
            .on(
                'postgres_changes', 
                { event: '*', table: 'orders', schema: 'public' }, 
                () => {
                    console.log('Realtime update detected in orders table');
                    fetchOrders(false); // Silent refresh
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await api.updateOrderStatus(id, status);
            fetchOrders(false);
        } catch (err) {
            console.error('Update status error:', err);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'produksi': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'selesai': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Sinkronisasi Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <CMSHeader 
                title="Pesanan Masuk" 
                desc="Kelola antrean produksi dan status pengiriman pelanggan." 
                onSave={() => fetchOrders(true)}
                message={orders.length > 0 ? `${orders.length} Pesanan Aktif` : ''}
            />

            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produk</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Estimasi</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-300">
                                            <ShoppingBag size={48} strokeWidth={1.5} />
                                            <p className="text-sm font-bold uppercase tracking-widest">Belum ada pesanan masuk</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-white shadow-sm">
                                                {order.customer?.name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-none mb-1">{order.customer?.name || 'Anonim'}</p>
                                                <p className="text-xs text-slate-400 font-medium">{order.customer?.phone || '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{order.config?.productSelection?.name || order.product?.name || '-'}</span>
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{order.config?.productSelection?.shape || 'Custom'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black text-slate-900">
                                        Rp {(order.totalPrice || order.estimatedPrice || 0).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                                {order.status || 'PENDING'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <select
                                                value={order.status || 'Pending'}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="text-[10px] font-black text-slate-600 border border-slate-200 rounded-xl bg-white px-3 py-2 focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all cursor-pointer uppercase tracking-widest"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Produksi">Produksi</option>
                                                <option value="Selesai">Selesai</option>
                                            </select>
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-95"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modern Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
                    <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-modal-in border border-white/20">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-20">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Pesanan #{selectedOrder.id?.split('-')[0]}</h3>
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} /> {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all border border-transparent hover:border-rose-100 shadow-sm bg-slate-50"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-10 overflow-y-auto flex-1 space-y-10 custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Side: Customer & Design Info */}
                                <div className="space-y-10">
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100"><User size={16} /></div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Informasi Pelanggan</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama Lengkap</p>
                                                <p className="text-sm font-bold text-slate-900">{selectedOrder.customer?.name || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
                                                <p className="text-sm font-bold text-slate-900">{selectedOrder.customer?.phone || '-'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alamat Pemasangan</p>
                                                <p className="text-sm font-medium text-slate-600 leading-relaxed">{selectedOrder.customer?.address || '-'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Catatan</p>
                                                <p className="text-sm font-medium text-slate-500 italic">"{selectedOrder.customer?.notes || 'Tidak ada catatan.'}"</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100"><Wrench size={16} /></div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Detail Konfigurasi</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><Package size={16} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Produk</p>
                                                        <p className="text-sm font-bold text-slate-900">{selectedOrder.config?.productSelection?.name || '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bentuk</p>
                                                    <p className="text-sm font-bold text-slate-900">{selectedOrder.config?.productSelection?.shape || '-'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><MapPin size={16} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimensi Ruang</p>
                                                        <p className="text-sm font-bold text-slate-900">{selectedOrder.config?.room?.length} x {selectedOrder.config?.room?.width} cm</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tinggi</p>
                                                    <p className="text-sm font-bold text-slate-900">{selectedOrder.config?.room?.height} cm</p>
                                                </div>
                                            </div>

                                            <div className="p-5 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Material Utama</p>
                                                <p className="text-lg font-black">{MATERIAL_COLORS[selectedOrder.config?.design?.materialId]?.name || 'Plywood Standard'}</p>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {selectedOrder.config?.design?.accessories?.map((accId, i) => (
                                                        <span key={i} className="text-[9px] font-black bg-white/10 text-white/80 px-2.5 py-1 rounded-md uppercase tracking-widest">
                                                            + {accId}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Side: 2D Visual & Photos */}
                                <div className="space-y-10">
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100"><ImageIcon size={16} /></div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Visualisasi Desain (2D)</h4>
                                        </div>
                                        <div className="aspect-square w-full bg-slate-100 rounded-[2.5rem] p-8 border border-slate-200 flex items-center justify-center shadow-inner overflow-hidden">
                                            {selectedOrder.config?.room ? (
                                                <div className="w-full h-full scale-110">
                                                    <RoomPreview2D config={selectedOrder.config} />
                                                </div>
                                            ) : (
                                                <div className="text-center text-slate-300">
                                                    <AlertCircle size={48} className="mx-auto mb-2 opacity-20" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">Preview tidak tersedia</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {selectedOrder.config?.photos?.length > 0 && (
                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100"><ImageIcon size={16} /></div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Foto Lokasi ({selectedOrder.config.photos.length})</h4>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4">
                                                {selectedOrder.config.photos.map((photo, i) => (
                                                    <a key={i} href={photo} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-2xl overflow-hidden border border-slate-200 hover:ring-4 hover:ring-slate-900/5 transition-all group">
                                                        <img src={photo} alt="Lokasi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </a>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-4 sticky bottom-0 z-20">
                            {selectedOrder.customer?.phone && (
                                <a 
                                    href={`https://wa.me/${selectedOrder.customer.phone?.replace(/[^0-9]/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-[#25D366] hover:bg-[#1da851] text-white font-black rounded-2xl transition-all flex items-center gap-3 shadow-xl shadow-emerald-200 active:scale-95 text-xs uppercase tracking-widest"
                                >
                                    <Phone size={16} /> Hubungi via WhatsApp
                                </a>
                            )}
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl transition-all hover:bg-slate-50 active:scale-95 text-xs uppercase tracking-widest"
                            >
                                Tutup Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
