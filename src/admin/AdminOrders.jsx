import React, { useEffect, useState } from 'react';
import { Eye, X, Image as ImageIcon, ShoppingBag, Clock, CheckCircle2, AlertCircle, Phone, MapPin, Package, Wrench, User, FileText, ShoppingCart } from 'lucide-react';
import { api, supabase } from '../lib/api';
import RoomPreview2D from '../components/RoomPreview2D';
import { MATERIAL_COLORS, WALL_POS } from '../lib/constants';
import { CMSHeader } from './cms/CMSComponents';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('summary'); // summary, rab, invoice

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
                        <div className="p-8 border-b border-slate-50 bg-white sticky top-0 z-20">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Pesanan #{String(selectedOrder.id || '').split('-')[0]}</h3>
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} /> {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => window.print()}
                                        className="hidden md:flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-100"
                                    >
                                        <FileText size={14} /> Cetak Dokumen
                                    </button>
                                    <button 
                                        onClick={() => setSelectedOrder(null)}
                                        className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all bg-slate-50"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
                                {[
                                    { id: 'summary', label: 'Ringkasan Desain', icon: <Package size={14} /> },
                                    { id: 'rab', label: 'RAB (Penawaran)', icon: <FileText size={14} /> },
                                    { id: 'invoice', label: 'Nota / Invoice', icon: <ShoppingCart size={14} /> }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                            ${activeTab === tab.id 
                                                ? 'bg-white text-slate-900 shadow-sm' 
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}
                                        `}
                                    >
                                        {tab.icon} {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-10 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/30">
                            {activeTab === 'summary' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
                                    {/* Left Side: Customer & Design Info */}
                                    <div className="space-y-10">
                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100"><User size={16} /></div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Informasi Pelanggan</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
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
                                                <div className="col-span-2 p-4 bg-slate-50 rounded-xl">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Catatan Pesanan</p>
                                                    <p className="text-sm font-medium text-slate-500 italic">"{selectedOrder.customer?.notes || 'Tidak ada catatan khusus.'}"</p>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100"><Wrench size={16} /></div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Detail Konfigurasi</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Package size={20} /></div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Produk Utama</p>
                                                            <p className="text-sm font-black text-slate-900">{selectedOrder.config?.productSelection?.name || '-'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bentuk</p>
                                                        <p className="text-sm font-bold text-teal-600">{selectedOrder.config?.productSelection?.shape || '-'}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dimensi Ruang</p>
                                                        <div className="flex items-end gap-1">
                                                            <span className="text-xl font-black text-slate-900">{selectedOrder.config?.room?.length} x {selectedOrder.config?.room?.width}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 pb-1">CM</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tinggi Unit</p>
                                                        <div className="flex items-end gap-1">
                                                            <span className="text-xl font-black text-slate-900">{selectedOrder.config?.room?.height}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 pb-1">CM</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Wrench size={80} /></div>
                                                    <div className="relative z-10">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pilihan Material & Finishing</p>
                                                        <p className="text-xl font-black mb-4">{MATERIAL_COLORS[selectedOrder.config?.design?.materialId]?.name || 'Plywood High Grade'}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedOrder.config?.design?.accessories?.map((accId, i) => (
                                                                <span key={i} className="text-[9px] font-black bg-white/10 text-white/90 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/5">
                                                                    {accId}
                                                                </span>
                                                            ))}
                                                        </div>
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
                                            <div className="aspect-square w-full bg-white rounded-[3rem] p-10 border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden relative group">
                                                <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                                                        <a key={i} href={photo} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm hover:ring-4 hover:ring-slate-900/5 transition-all group">
                                                            <img src={photo} alt="Lokasi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'rab' && (
                                <div className="max-w-4xl mx-auto bg-white p-12 md:p-16 rounded-[3rem] shadow-xl border border-slate-100 animate-fade-in print:shadow-none print:border-none">
                                    {/* Document Header */}
                                    <div className="flex justify-between items-start mb-16 pb-12 border-b-2 border-slate-50">
                                        <div>
                                            <img src="/brand/logo-icon-dark.png" alt="Logo" className="w-16 h-16 mb-4" />
                                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Penawaran Harga (RAB)</h2>
                                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Afandi Interior & Furnitur Custom</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">No. Dokumen</p>
                                            <p className="text-xl font-black text-slate-900">RAB-{String(selectedOrder.id || '').split('-')[0].toUpperCase()}</p>
                                            <p className="text-xs font-bold text-slate-500 mt-2 italic">Diterbitkan pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    {/* Client & Project Info */}
                                    <div className="grid grid-cols-2 gap-16 mb-16">
                                        <div>
                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi Klien</h5>
                                            <p className="text-xl font-black text-slate-900 mb-1">{selectedOrder.customer?.name}</p>
                                            <p className="text-sm font-bold text-slate-500 mb-2">{selectedOrder.customer?.phone}</p>
                                            <p className="text-sm font-medium text-slate-400 max-w-xs leading-relaxed">{selectedOrder.customer?.address}</p>
                                        </div>
                                        <div className="text-right">
                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Ringkasan Proyek</h5>
                                            <p className="text-xl font-black text-slate-900 mb-1">{selectedOrder.config?.productSelection?.name}</p>
                                            <p className="text-sm font-bold text-teal-600 mb-2">Bentuk: {selectedOrder.config?.productSelection?.shape}</p>
                                            <p className="text-sm font-medium text-slate-400">Total Ukuran: {selectedOrder.config?.room?.length} x {selectedOrder.config?.room?.width} cm</p>
                                        </div>
                                    </div>

                                    {/* Itemized Table */}
                                    <div className="mb-16">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-2 border-slate-900">
                                                    <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-900">Deskripsi Pekerjaan</th>
                                                    <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-900">Spesifikasi</th>
                                                    <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-900">Estimasi Biaya</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="group">
                                                    <td className="py-8">
                                                        <p className="font-black text-slate-900 mb-1">Produksi Unit Utama</p>
                                                        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">Pabrikasi furnitur menggunakan material Plywood/Blockboard 18mm dengan finishing HPL luar dalam.</p>
                                                    </td>
                                                    <td className="py-8 text-center text-sm font-bold text-slate-600">
                                                        {MATERIAL_COLORS[selectedOrder.config?.design?.materialId]?.name || 'Standard HPL'}
                                                    </td>
                                                    <td className="py-8 text-right font-black text-slate-900">
                                                        Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}
                                                    </td>
                                                </tr>
                                                {selectedOrder.config?.design?.accessories?.length > 0 && (
                                                    <tr>
                                                        <td className="py-8">
                                                            <p className="font-black text-slate-900 mb-1">Aksesoris Tambahan</p>
                                                            <p className="text-xs text-slate-400 font-medium">{selectedOrder.config.design.accessories.join(', ')}</p>
                                                        </td>
                                                        <td className="py-8 text-center text-sm font-bold text-slate-600">Custom Kit</td>
                                                        <td className="py-8 text-right font-black text-slate-900 italic text-xs">Termasuk Harga</td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td className="py-8">
                                                        <p className="font-black text-slate-900 mb-1">Pengiriman & Pemasangan</p>
                                                        <p className="text-xs text-slate-400 font-medium">Pengiriman armada workshop dan instalasi di lokasi pelanggan.</p>
                                                    </td>
                                                    <td className="py-8 text-center text-sm font-bold text-slate-600">On-site</td>
                                                    <td className="py-8 text-right font-black text-slate-900 italic text-xs">Free Promo</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-t-4 border-slate-900">
                                                    <td colSpan="2" className="py-8 text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Penawaran</p>
                                                    </td>
                                                    <td className="py-8 text-right">
                                                        <p className="text-3xl font-black text-slate-900">Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}</p>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    {/* Footer / Terms */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
                                        <div className="space-y-4">
                                            <h6 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Syarat & Ketentuan:</h6>
                                            <ul className="text-[10px] text-slate-400 space-y-2 font-medium">
                                                <li>• Harga berlaku selama 14 hari sejak diterbitkan.</li>
                                                <li>• Pembayaran DP minimal 50% untuk mulai produksi.</li>
                                                <li>• Waktu pengerjaan 7-14 hari kerja setelah approval desain.</li>
                                                <li>• Perubahan desain setelah produksi akan dikenakan biaya tambahan.</li>
                                            </ul>
                                        </div>
                                        <div className="text-center pt-8">
                                            <div className="inline-block border-b-2 border-slate-900 w-48 mb-2"></div>
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Tim Afandi Interior</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'invoice' && (
                                <div className="max-w-4xl mx-auto bg-white p-12 md:p-16 rounded-[3rem] shadow-xl border-t-[12px] border-slate-900 animate-fade-in print:shadow-none print:border-none">
                                    {/* Invoice Header */}
                                    <div className="flex justify-between items-start mb-16">
                                        <div>
                                            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-2">Nota Tagihan</h1>
                                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">INVOICE / RECEIPT</p>
                                        </div>
                                        <div className="bg-slate-100 px-8 py-6 rounded-[2rem] text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Pembayaran</p>
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-amber-200">Menunggu DP</span>
                                        </div>
                                    </div>

                                    {/* Invoice Info */}
                                    <div className="grid grid-cols-3 gap-8 mb-16 py-8 border-y border-slate-100">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ditujukan Kepada</p>
                                            <p className="text-sm font-black text-slate-900">{selectedOrder.customer?.name}</p>
                                            <p className="text-xs font-bold text-slate-500 mt-1">{selectedOrder.customer?.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">No. Invoice</p>
                                            <p className="text-sm font-black text-slate-900">INV/{new Date().getFullYear()}/{String(selectedOrder.id || '').split('-')[0].toUpperCase()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tanggal</p>
                                            <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    {/* Invoice Items */}
                                    <div className="space-y-4 mb-16">
                                        <div className="grid grid-cols-4 gap-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <div className="col-span-2">Item Pekerjaan</div>
                                            <div className="text-center">Kuantitas</div>
                                            <div className="text-right">Harga Total</div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl items-center">
                                            <div className="col-span-2">
                                                <p className="text-sm font-black text-slate-900">Pesanan Furnitur Custom</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{selectedOrder.config?.productSelection?.name} ({selectedOrder.config?.productSelection?.shape})</p>
                                            </div>
                                            <div className="text-center text-sm font-black text-slate-900">1 Unit</div>
                                            <div className="text-right text-sm font-black text-slate-900">Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}</div>
                                        </div>
                                    </div>

                                    {/* Totals & Payments */}
                                    <div className="flex flex-col md:flex-row gap-12 items-start justify-between border-t border-slate-100 pt-12">
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Informasi Pembayaran:</p>
                                                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] text-white font-black">BCA</div>
                                                        <p className="text-xs font-black text-slate-900">890 1234 567</p>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">A/N Ahmad Helmi Afandi</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-80 space-y-4">
                                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                                <span>Subtotal</span>
                                                <span>Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                                <span>PPN (0%)</span>
                                                <span>Rp 0</span>
                                            </div>
                                            <div className="flex justify-between items-center py-6 border-t-2 border-slate-100">
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Total Bayar</span>
                                                <span className="text-3xl font-black text-slate-900">Rp {(selectedOrder.totalPrice || 0).toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex justify-between items-center">
                                                <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">Down Payment (50%)</span>
                                                <span className="text-sm font-black text-teal-700">Rp {((selectedOrder.totalPrice || 0) * 0.5).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Invoice Footer */}
                                    <div className="mt-20 text-center">
                                        <div className="inline-block p-4 bg-slate-900 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.4em] mb-4">TERIMA KASIH</div>
                                        <p className="text-xs text-slate-400 font-medium italic">Nota ini sah tanpa tanda tangan karena dihasilkan oleh sistem Afandi Interior CMS</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-4 sticky bottom-0 z-20">
                            {selectedOrder.customer?.phone && (
                                <a 
                                    href={`https://wa.me/${String(selectedOrder.customer.phone || '').replace(/[^0-9]/g, '')}`} 
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
