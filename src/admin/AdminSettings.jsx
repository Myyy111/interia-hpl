import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Settings, Save, LayoutTemplate, MessageSquare, Briefcase } from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        hero: { title: '', subtitle: '', stat: '' },
        about: { description: '' },
        contact: { phone: '', email: '', mapUrl: '' }
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        api.getSettings().then((data) => {
            if (data) setSettings(data);
            setLoading(false);
        });
    }, []);

    const handleChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        setSettings(prev => {
            const newArr = [...(prev[section] || [])];
            newArr[index] = { ...newArr[index], [field]: value };
            return { ...prev, [section]: newArr };
        });
    };

    const handleImageUpload = (section, index, field, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                if (index !== null) {
                    handleArrayChange(section, index, field, base64String);
                } else {
                    handleChange(section, field, base64String);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.updateSettings(settings);
            setMessage('Pengaturan berhasil disimpan!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Gagal menyimpan.');
        }
        setIsSaving(false);
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                    <Settings className="text-slate-500" />
                    <h2 className="text-xl font-bold text-slate-800">Pengaturan Website (CMS)</h2>
                </div>
                <div className="flex items-center gap-4">
                    {message && <span className="text-sm font-medium text-teal-600 animate-fade-in">{message}</span>}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:bg-indigo-400"
                    >
                        <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-10">
                {/* Hero Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <LayoutTemplate size={20} className="text-indigo-500" /> Bagian Utama (Hero)
                    </h3>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Utama</label>
                            <input
                                type="text"
                                value={settings.hero.title || ''}
                                onChange={(e) => handleChange('hero', 'title', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Sub-judul (Deskripsi)</label>
                            <textarea
                                rows="3"
                                value={settings.hero.subtitle || ''}
                                onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <Briefcase size={20} className="text-indigo-500" /> Tentang Kami
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Perusahaan</label>
                            <textarea
                                rows="4"
                                value={settings.about.description || ''}
                                onChange={(e) => handleChange('about', 'description', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Angka Badge (e.g 5+)</label>
                                <input
                                    type="text"
                                    value={settings.about.badgeValue || ''}
                                    onChange={(e) => handleChange('about', 'badgeValue', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Badge</label>
                                <input
                                    type="text"
                                    value={settings.about.badgeTitle || ''}
                                    onChange={(e) => handleChange('about', 'badgeTitle', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Sub Badge</label>
                                <input
                                    type="text"
                                    value={settings.about.badgeSub || ''}
                                    onChange={(e) => handleChange('about', 'badgeSub', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Update Foto Section Tentang</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border">
                                    <img src={settings.about.img} className="w-full h-full object-cover" />
                                </div>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload('about', null, 'img', e)} className="text-sm" />
                            </div>
                        </div>
                    </div>
                </section>


                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <MessageSquare size={20} className="text-indigo-500" /> Informasi Kontak
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
                            <input
                                type="text"
                                value={settings.contact.phone || ''}
                                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Email</label>
                            <input
                                type="email"
                                value={settings.contact.email || ''}
                                onChange={(e) => handleChange('contact', 'email', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <Briefcase size={20} className="text-indigo-500" /> Layanan Spesialis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(settings.services || []).map((s, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3 relative">
                                <span className="absolute top-2 right-4 text-[10px] font-bold text-slate-400">Layanan {index + 1}</span>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Layanan</label>
                                    <input
                                        type="text"
                                        value={s.title}
                                        onChange={(e) => handleArrayChange('services', index, 'title', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Singkat</label>
                                    <textarea
                                        rows="2"
                                        value={s.desc}
                                        onChange={(e) => handleArrayChange('services', index, 'desc', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Portfolio Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <LayoutTemplate size={20} className="text-indigo-500" /> Galeri Portfolio (Upload Foto)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(settings.portfolio || []).map((p, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
                                <div className="h-32 bg-slate-200 rounded-lg overflow-hidden relative group">
                                    <img src={p.img} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label className="cursor-pointer bg-white text-slate-900 px-3 py-1 rounded text-[10px] font-bold">
                                            Ganti Foto
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('portfolio', index, 'img', e)} />
                                        </label>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Judul Proyek"
                                    value={p.title}
                                    onChange={(e) => handleArrayChange('portfolio', index, 'title', e.target.value)}
                                    className="w-full border border-slate-300 rounded p-2 text-xs outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </section>
                {/* FAQ Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <MessageSquare size={20} className="text-indigo-500" /> FAQ (Pertanyaan Umum)
                    </h3>
                    <div className="space-y-4">
                        {(settings.faqs || []).map((faq, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3 relative">
                                <div className="absolute top-2 right-4 text-xs font-bold text-slate-400">FAQ {index + 1}</div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Pertanyaan</label>
                                    <input
                                        type="text"
                                        value={faq.q}
                                        onChange={(e) => handleArrayChange('faqs', index, 'q', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jawaban</label>
                                    <textarea
                                        rows="2"
                                        value={faq.a}
                                        onChange={(e) => handleArrayChange('faqs', index, 'a', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <MessageSquare size={20} className="text-indigo-500" /> Testimoni Klien
                    </h3>
                    <div className="space-y-4">
                        {(settings.testimonials || []).map((testi, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3 relative">
                                <div className="absolute top-2 right-4 text-xs font-bold text-slate-400">Testimoni {index + 1}</div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Isi Ulasan</label>
                                    <textarea
                                        rows="2"
                                        value={testi.text}
                                        onChange={(e) => handleArrayChange('testimonials', index, 'text', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Klien</label>
                                        <input
                                            type="text"
                                            value={testi.name}
                                            onChange={(e) => handleArrayChange('testimonials', index, 'name', e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Lokasi</label>
                                        <input
                                            type="text"
                                            value={testi.loc}
                                            onChange={(e) => handleArrayChange('testimonials', index, 'loc', e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <Briefcase size={20} className="text-indigo-500" /> Tim Profesional
                    </h3>
                    <div className="space-y-4">
                        {(settings.team || []).map((t, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3 relative">
                                <div className="absolute top-2 right-4 text-xs font-bold text-slate-400">Anggota {index + 1}</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nama</label>
                                        <input
                                            type="text"
                                            value={t.name}
                                            onChange={(e) => handleArrayChange('team', index, 'name', e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Jabatan / Role</label>
                                        <input
                                            type="text"
                                            value={t.role}
                                            onChange={(e) => handleArrayChange('team', index, 'role', e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Upload Foto</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                                            {t.img ? <img src={t.img} className="w-full h-full object-cover" /> : null}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload('team', index, 'img', e)}
                                            className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                {/* How It Works Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <LayoutTemplate size={20} className="text-indigo-500" /> Alur Pemesanan (How It Works)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(settings.howItWorks || []).map((step, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3 relative">
                                <span className="absolute top-2 right-4 text-[10px] font-bold text-slate-400">Step {index + 1}</span>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Langkah</label>
                                    <input
                                        type="text"
                                        value={step.title}
                                        onChange={(e) => handleArrayChange('howItWorks', index, 'title', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Singkat</label>
                                    <textarea
                                        rows="2"
                                        value={step.desc}
                                        onChange={(e) => handleArrayChange('howItWorks', index, 'desc', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Products Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <Briefcase size={20} className="text-indigo-500" /> Produk Unggulan (Katalog Depan)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(settings.products || []).map((prod, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
                                <div className="h-32 bg-slate-200 rounded-lg overflow-hidden relative group">
                                    <img src={prod.img} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label className="cursor-pointer bg-white text-slate-900 px-3 py-1 rounded text-[10px] font-bold">
                                            Ganti Foto
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('products', index, 'img', e)} />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Produk</label>
                                    <input
                                        type="text"
                                        value={prod.title}
                                        onChange={(e) => handleArrayChange('products', index, 'title', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Fitur (Pisahkan dengan koma)</label>
                                    <input
                                        type="text"
                                        value={prod.features}
                                        onChange={(e) => handleArrayChange('products', index, 'features', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technology Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <LayoutTemplate size={20} className="text-indigo-500" /> Bagian Teknologi (Configurator)
                    </h3>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Teknologi</label>
                            <input
                                type="text"
                                value={settings.tech?.title || ''}
                                onChange={(e) => handleChange('tech', 'title', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Teknologi</label>
                            <textarea
                                rows="3"
                                value={settings.tech?.desc || ''}
                                onChange={(e) => handleChange('tech', 'desc', e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Blog Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <MessageSquare size={20} className="text-indigo-500" /> Artikel Blog / Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(settings.articles || []).map((art, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
                                <div className="h-24 bg-slate-200 rounded-lg overflow-hidden relative group">
                                    <img src={art.img} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label className="cursor-pointer bg-white text-slate-900 px-2 py-1 rounded text-[10px] font-bold">
                                            Ubah
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('articles', index, 'img', e)} />
                                        </label>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Judul"
                                    value={art.title}
                                    onChange={(e) => handleArrayChange('articles', index, 'title', e.target.value)}
                                    className="w-full border border-slate-300 rounded p-2 text-xs outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Tanggal"
                                    value={art.date}
                                    onChange={(e) => handleArrayChange('articles', index, 'date', e.target.value)}
                                    className="w-full border border-slate-300 rounded p-2 text-xs outline-none"
                                />
                                <textarea
                                    rows="2"
                                    placeholder="Ringkasan"
                                    value={art.desc}
                                    onChange={(e) => handleArrayChange('articles', index, 'desc', e.target.value)}
                                    className="w-full border border-slate-300 rounded p-2 text-xs outline-none resize-none"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
