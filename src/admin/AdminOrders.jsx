import React, { useEffect, useState } from 'react';
import { Eye, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../lib/api';
import RoomPreview2D from '../components/RoomPreview2D';
import { MATERIAL_COLORS, WALL_POS } from '../lib/constants';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = (showLoader = false) => {
        if (showLoader) setLoading(true);
        api.getOrders().then((data) => {
            // Hanya tampilkan order yang sudah di-submit beneran (punya customer & bukan sekadar Draft)
            const realOrders = data.filter(o => o.status !== 'Draft' && o.customer?.name);
            setOrders(realOrders);
            setLoading(false);
        }).catch(err => {
            console.error('Error fetching orders:', err);
            setLoading(false);
        });
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, status) => {
        // Optimistic UI updates could be added here
        await api.updateOrderStatus(id, status);
        fetchOrders(true);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Memuat data pesanan...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Daftar Pesanan</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">ID Pesanan</th>
                            <th className="px-6 py-4">Pelanggan</th>
                            <th className="px-6 py-4">Produk</th>
                            <th className="px-6 py-4">Estimasi Harga</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Belum ada pesanan</td>
                            </tr>
                        ) : orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 font-mono text-xs">
                                    {order.id?.split('-')[0] || 'INV'}...
                                </td>
                                <td className="px-6 py-4">
                                    <div>{order.customer?.name || 'Draft (Anonim)'}</div>
                                    <div className="text-xs text-slate-400">{order.customer?.phone || '-'}</div>
                                </td>
                                <td className="px-6 py-4">{order.config?.productSelection?.name || order.product?.name || '-'}</td>
                                <td className="px-6 py-4 font-medium text-slate-800">
                                    Rp {(order.totalPrice || order.estimatedPrice || 0).toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                        order.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                                        order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                        order.status === 'Produksi' ? 'bg-indigo-100 text-indigo-700' :
                                        'bg-teal-100 text-teal-700'
                                    }`}>
                                        {(order.status || 'Draft').toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <select
                                        value={order.status || 'Draft'}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="text-sm font-medium text-slate-700 border-2 border-slate-200 rounded-lg bg-slate-50 px-3 py-1.5 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white outline-none transition-all cursor-pointer"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Produksi">Produksi</option>
                                        <option value="Selesai">Selesai</option>
                                    </select>
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-2 text-teal-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors border border-transparent hover:border-teal-100"
                                        title="Lihat Detail"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Detail Pesanan */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in text-left">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Detail Pesanan: {selectedOrder.id?.split('-')[0]}</h3>
                                <p className="text-sm text-slate-500">{selectedOrder.customer?.name} - {selectedOrder.customer?.phone}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {/* Kontak & Pengiriman */}
                            <div className="bg-white rounded-xl border border-slate-200 p-4">
                                <h4 className="text-sm font-bold text-teal-700 uppercase tracking-widest mb-3 border-b border-teal-100 pb-2">Info Kontak & Pengiriman</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500 block mb-1">Alamat Pemasangan:</span>
                                        <p className="font-medium text-slate-800">{selectedOrder.customer?.address || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block mb-1">Catatan Khusus:</span>
                                        <p className="font-medium text-slate-800 italic">{selectedOrder.customer?.notes || 'Tidak ada catatan.'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Konfigurasi Produk */}
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Konfigurasi Desain</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <span className="text-slate-500 block mb-2 font-bold">Produk Utama</span>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between border-b border-slate-100 pb-1">
                                                <span className="text-slate-500">Jenis:</span>
                                                <span className="font-medium">{selectedOrder.config?.productSelection?.name || selectedOrder.product?.name || '-'}</span>
                                            </li>
                                            <li className="flex justify-between border-b border-slate-100 pb-1">
                                                <span className="text-slate-500">Bentuk/Model:</span>
                                                <span className="font-medium">{selectedOrder.config?.productSelection?.shape || '-'}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <span className="text-slate-500 block mb-2 font-bold">Spesifikasi Ruangan</span>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between border-b border-slate-100 pb-1">
                                                <span className="text-slate-500">Panjang x Lebar:</span>
                                                <span className="font-medium">{selectedOrder.config?.room?.length || 0}cm x {selectedOrder.config?.room?.width || 0}cm</span>
                                            </li>
                                            <li className="flex justify-between border-b border-slate-100 pb-1">
                                                <span className="text-slate-500">Tinggi Plafon:</span>
                                                <span className="font-medium">{selectedOrder.config?.room?.height || 0}cm</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <span className="text-slate-500 block mb-2 font-bold">Gaya & Estetika</span>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between border-b border-slate-100 pb-1">
                                                <span className="text-slate-500">Model Desain:</span>
                                                <span className="font-medium">{selectedOrder.config?.design?.model || '-'}</span>
                                            </li>
                                            <li className="flex justify-between border-b border-slate-100 pb-1">
                                                <span className="text-slate-500">Material Utama:</span>
                                                <span className="font-medium text-teal-700">
                                                    {MATERIAL_COLORS[selectedOrder.config?.design?.materialId]?.name || 'Plywood / HPL'}
                                                </span>
                                            </li>
                                            <li className="flex justify-between border-b border-slate-100 pb-1">
                                                <span className="text-slate-500">Aksesori Tambahan:</span>
                                                <span className="font-medium">{selectedOrder.config?.design?.accessories?.length || 0} item</span>
                                            </li>
                                            {selectedOrder.config?.design?.accessories?.length > 0 && (
                                                <li className="pt-1">
                                                    <div className="flex flex-wrap gap-1">
                                                        {selectedOrder.config.design.accessories.map((accId, i) => (
                                                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                                                {accId}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <span className="text-slate-500 block mb-2 font-bold">Bukaan (Pintu/Jendela)</span>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between border-b border-slate-100 pb-1">
                                                <span className="text-slate-500">Total Bukaan:</span>
                                                <span className="font-medium">{selectedOrder.config?.fixtures?.length || 0} bukaan</span>
                                            </li>
                                            {selectedOrder.config?.fixtures?.map((fix, idx) => (
                                                <li key={idx} className="flex justify-between border-b border-slate-100 pb-1 text-xs text-slate-500">
                                                    <span>- {fix.type === 'door' ? 'Pintu' : 'Jendela'} (Dinding {WALL_POS[fix.position] || fix.position})</span>
                                                    <span>{fix.width}x{fix.height}cm</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Visualisasi 2D */}
                            {selectedOrder.config?.room && (
                                <div className="bg-white rounded-xl border border-slate-200 p-4 overflow-hidden">
                                     <h4 className="flex items-center gap-2 text-sm font-bold text-teal-700 uppercase tracking-widest mb-4 border-b border-teal-100 pb-2">
                                        <ImageIcon size={16} /> Pratinjau Ruangan 2D
                                    </h4>
                                    <div className="w-full flex justify-center items-center bg-slate-50 rounded-xl p-2 md:p-4 border border-slate-100">
                                        <div className="w-full max-w-sm">
                                            <RoomPreview2D config={selectedOrder.config} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Lampiran Foto */}
                            {selectedOrder.config?.photos?.length > 0 && (
                                <div className="bg-white rounded-xl border border-slate-200 p-4">
                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Foto Referensi Dinding</h4>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                        {selectedOrder.config.photos.map((photo, i) => (
                                            <a key={i} href={photo} target="_blank" rel="noopener noreferrer" className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity">
                                                <img src={photo} alt="Referensi ruangan" className="w-full h-full object-cover" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            {selectedOrder.customer?.phone && (
                                <a 
                                    href={`https://wa.me/${selectedOrder.customer.phone}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                                >
                                    Hubungi Pelanggan
                                </a>
                            )}
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
