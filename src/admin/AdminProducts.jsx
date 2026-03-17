import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = (showLoader = false) => {
        if (showLoader) setLoading(true);
        api.getProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, []);

    const handlePriceChange = async (id, newPrice) => {
        await api.updateProduct(id, { basePrice: Number(newPrice) });
        fetchProducts(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">Manajemen Produk & Harga Dasar</h2>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    + Tambah Produk (Coming Soon)
                </button>
            </div>
            <div className="p-6 grid gap-6">
                {products.map((product) => (
                    <div key={product.id} className="border border-slate-200 p-5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">{product.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">Bentuk Tersedia: <span className="font-medium text-slate-700">{product.shapes.join(', ')}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Harga Dasar /m:</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                                <input
                                    type="number"
                                    defaultValue={product.basePrice}
                                    onBlur={(e) => handlePriceChange(product.id, e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-40 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow outline-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
