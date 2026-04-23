import React, { useState } from 'react';
import { Send, MessageCircle, Download, User, Phone, MapPin, FileText, ExternalLink, ShoppingCart } from 'lucide-react';
import { trackEvent, ANALYTICS_EVENTS } from '../../../lib/analytics';

// WhatsApp sales number — update this to the real number
const WA_SALES_NUMBER = '6281234567890';

function buildWhatsAppMessage({ config, metadata, estimatedPrice, customerData }) {
    const { room, fixtures, productSelection, design } = config;
    const { products, materials, accessories } = metadata;

    const product = products.find(p => p.id === productSelection.productId);
    const material = materials.find(m => m.id === design.materialId);
    const accs = accessories.filter(a => design.accessories.includes(a.id));

    const lines = [
        `🏠 *PERMINTAAN DESAIN INTERIOR*`,
        `_Dari Web Configurator Afandi Interior_`,
        ``,
        `👤 *Data Pelanggan:*`,
        `• Nama: ${customerData.name}`,
        `• WhatsApp: ${customerData.phone}`,
        `• Email: ${customerData.email || '-'}`,
        `• Alamat: ${customerData.address}`,
        customerData.notes ? `• Catatan: ${customerData.notes}` : null,
        ``,
        `💳 *Metode Pembayaran:*`,
        `• Pilihan: ${customerData.paymentMethod || 'Belum dipilih'}`,
        ``,
        `📦 *Konfigurasi Pesanan:*`,
        `• Produk: ${product?.name || '-'}`,
        `• Model: ${productSelection.shape || '-'}`,
        `• Gaya: ${design.model || '-'}`,
        ``,
        `📐 *Ukuran Ruangan:*`,
        `• Bentuk: ${room.shape}`,
        `• Panjang: ${room.length}cm × Lebar: ${room.width}cm`,
        `• Tinggi: ${room.height}cm`,
        room.shape === 'L-shape' ? `• Sisi L: ${room.LSide || 0}cm` : null,
        room.shape === 'U-shape' ? `• Sayap: Kiri ${room.USideL || 0}cm, Kanan ${room.USideR || 0}cm` : null,
        ``,
        `🪟 *Pintu & Jendela (${fixtures.length} item):*`,
        ...fixtures.map(f => `• ${f.type === 'door' ? 'Pintu' : 'Jendela'}: Dinding ${f.position}, ${f.width}×${f.height}cm`),
        fixtures.length === 0 ? '• Tidak ada' : null,
        ``,
        `🎨 *Material & Aksesori:*`,
        `• Material: ${material?.name || 'Belum dipilih'}`,
        ...accs.map(a => `• ${a.name}: +Rp ${a.price.toLocaleString('id-ID')}`),
        accs.length === 0 ? '• Aksesori: Tidak ada' : null,
        ``,
        `💰 *Estimasi Harga: Rp ${estimatedPrice.toLocaleString('id-ID')}*`,
        ``,
        `_Mohon konfirmasi ketersediaan jadwal survey. Terima kasih!_ 🙏`,
    ].filter(Boolean).join('\n');

    return encodeURIComponent(lines);
}

export default function OrderForm({ onSubmit, isSubmitting, config, metadata, estimatedPrice }) {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', notes: '', paymentMethod: 'Transfer BCA' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
        if (!formData.phone.trim()) newErrors.phone = 'Nomor WhatsApp wajib diisi';
        else if (!/^[\d\s+()-]{8,16}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Format nomor tidak valid';
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
        if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        await onSubmit(formData);
    };

    const handleWhatsApp = () => {
        trackEvent(ANALYTICS_EVENTS.WA_CHAT_CLICK);
        const waMsg = buildWhatsAppMessage({ config, metadata, estimatedPrice, customerData: formData });
        window.open(`https://wa.me/${WA_SALES_NUMBER}?text=${waMsg}`, '_blank');
    };



    return (
        <form id="order-form" onSubmit={handleSubmit} className="space-y-6 pb-6">
            {/* Info Banner */}
            <div className="bg-teal-50 rounded-xl p-5 border border-teal-100 space-y-1">
                <h4 className="font-bold text-teal-800 flex items-center gap-2">
                    <span className="text-lg">🎉</span> Hampir Selesai!
                </h4>
                <p className="text-sm text-teal-700">Isi data kontak untuk konfirmasi &amp; jadwal survey oleh tim workshop kami.</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <InputField label="Nama Lengkap" name="name" value={formData.name} onChange={handleChange} errors={errors} placeholder="Contoh: Budi Santoso" icon={User} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="WhatsApp" name="phone" value={formData.phone} onChange={handleChange} errors={errors} type="tel" placeholder="081234567890" icon={Phone} required />
                    <InputField label="Alamat Email (Opsional)" name="email" value={formData.email} onChange={handleChange} errors={errors} type="email" placeholder="budi@example.com" icon={MessageCircle} />
                </div>
                <InputField label="Alamat Pemasangan" name="address" value={formData.address} onChange={handleChange} errors={errors} placeholder="Jl. Contoh No. 123, Kota, Provinsi..." icon={MapPin} required multiline />
                
                {/* Payment Method Selection */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <ShoppingCart size={14} className="text-slate-400" />
                        Pilih Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Transfer BCA', 'Transfer Mandiri', 'Tunai / Cash'].map(method => (
                            <button
                                key={method}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                                className={`
                                    py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all
                                    ${formData.paymentMethod === method 
                                        ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm shadow-teal-100' 
                                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}
                                `}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                </div>

                <InputField label="Catatan Tambahan" name="notes" value={formData.notes} onChange={handleChange} errors={errors} placeholder="Request khusus, warna preferensi, atau pertanyaan..." icon={FileText} multiline />
            </div>

            {/* Price Summary Before Submit */}
            {estimatedPrice > 0 && (
                <div className="p-4 bg-slate-800 rounded-xl text-white flex items-center justify-between">
                    <span className="text-slate-300 text-sm font-semibold">Total Estimasi</span>
                    <span className="text-xl font-extrabold text-teal-400">Rp {estimatedPrice.toLocaleString('id-ID')}</span>
                </div>
            )}

            {/* Submit Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Button */}
                <button
                    type="button"
                    onClick={handleWhatsApp}
                    disabled={!formData.name || !formData.phone}
                    className="flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <MessageCircle size={20} />
                    Chat WhatsApp
                </button>

                {/* Submit to Database */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    {isSubmitting ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Kirim Permintaan
                        </>
                    )}
                </button>
            </div>

            <p className="text-center text-xs text-slate-400">
                Dengan mengirim, Anda menyetujui tim kami menghubungi Anda melalui WhatsApp yang tertera.
            </p>
        </form>
    );
}

const InputField = ({ label, name, value, onChange, errors, type = 'text', placeholder, icon: Icon, required, multiline }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            {Icon && <Icon size={14} className="text-slate-400" />}
            {label}
            {required && <span className="text-rose-500 text-xs">*</span>}
        </label>
        {multiline ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows="3"
                placeholder={placeholder}
                className={`w-full border-2 p-4 rounded-xl transition-all font-medium outline-none resize-none text-slate-800 placeholder-slate-300 ${errors[name] ? 'border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20' : 'border-slate-200 bg-slate-50 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 focus:bg-white'}`}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full border-2 p-4 rounded-xl transition-all font-medium outline-none text-slate-800 placeholder-slate-300 ${errors[name] ? 'border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20' : 'border-slate-200 bg-slate-50 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 focus:bg-white'}`}
            />
        )}
        {errors[name] && (
            <p className="text-rose-500 text-xs font-medium mt-1 pl-1">⚠ {errors[name]}</p>
        )}
    </div>
);
