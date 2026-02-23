import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function OrderForm({ onSubmit, isSubmitting }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.address) {
            alert("Mohon lengkapi Nama, WhatsApp, dan Alamat Anda.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <form id="order-form" onSubmit={handleSubmit} className="space-y-6 pb-6">
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 space-y-2 mb-8">
                <h4 className="font-bold text-emerald-800 flex items-center gap-2">Hampir Selesai!</h4>
                <p className="text-sm text-emerald-700">Silakan isi data kontak Anda untuk keperluan survey lokasi dan konfirmasi pesanan oleh tim Workshop kami.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all font-medium outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor WhatsApp Aktif</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="081234567890"
                        className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all font-medium outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Lengkap</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Masukkan alamat lengkap untuk keperluan survey..."
                        className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all font-medium outline-none resize-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Catatan Tambahan (Opsional)</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Tuliskan jika ada request khusus..."
                        className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all font-medium outline-none resize-none"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
            >
                {isSubmitting ? 'Memproses...' : 'Kirim Permintaan Produksi'} <Send size={20} />
            </button>
        </form>
    );
}
