import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = () => {
        setLoading(true);
        api.getOrders().then((data) => {
            setOrders(data);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, status) => {
        await api.updateOrderStatus(id, status);
        fetchOrders();
    };

    if (loading) return <div>Loading...</div>;

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
                                <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                                <td className="px-6 py-4">
                                    <div>{order.customer.name}</div>
                                    <div className="text-xs text-slate-400">{order.customer.phone}</div>
                                </td>
                                <td className="px-6 py-4">{order.product?.name || '-'}</td>
                                <td className="px-6 py-4 font-medium">Rp {order.totalPrice?.toLocaleString('id-ID')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            order.status === 'produksi' ? 'bg-blue-100 text-blue-700' :
                                                'bg-emerald-100 text-emerald-700'
                                        }`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="text-sm border-slate-300 rounded-md bg-white shadow-sm focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="produksi">Produksi</option>
                                        <option value="selesai">Selesai</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
