import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { 
    Settings, Save, LayoutTemplate, MessageSquare, Briefcase, 
    Plus, Trash2, Image as ImageIcon, Users, Star, HelpCircle, 
    FileText, Phone, Info, Zap
} from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('umum');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const data = await api.getSettings();
        if (data) setSettings(data);
        setLoading(false);
    };

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

    const addItem = (section, defaultObj) => {
        setSettings(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), defaultObj]
        }));
    };

    const removeItem = (section, index) => {
        if (window.confirm('Hapus item ini?')) {
            setSettings(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));
        }
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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Memuat data...</p>
        </div>
    );

    const tabs = [
        { id: 'umum', label: 'Umum & Kontak', icon: <Settings size={18} /> },
        { id: 'produk', label: 'Produk & Portofolio', icon: <Briefcase size={18} /> },
        { id: 'alur', label: 'Layanan & Alur', icon: <Zap size={18} /> },
        { id: 'orang', label: 'Tim & Testimoni', icon: <Users size={18} /> },
        { id: 'faq', label: 'FAQ & Blog', icon: <HelpCircle size={18} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">CMS Pengaturan Konten</h2>
                    <p className="text-slate-500 text-sm">Kelola semua teks dan gambar yang tampil di halaman depan.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {message && <span className="text-sm font-bold text-teal-600 animate-fade-in mr-2">{message}</span>}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50 w-full md:w-auto justify-center"
                    >
                        <Save size={20} /> {isSaving ? 'Menyimpan...' : 'Simpan Semua'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <aside className="lg:w-64 shrink-0 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                activeTab === tab.id 
                                ? 'bg-teal-500 text-white shadow-md shadow-teal-100' 
                                : 'text-slate-500 hover:bg-white hover:text-slate-800'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8">
                        {/* TAB: UMUM */}
                        {activeTab === 'umum' && (
                            <div className="space-y-10 animate-fade-in">
                                <SectionHeader icon={<LayoutTemplate className="text-indigo-500" />} title="Hero Section" />
                                <div className="grid gap-6">
                                    <Input label="Judul Utama" value={settings.hero.title} onChange={v => handleChange('hero', 'title', v)} />
                                    <Textarea label="Sub-judul (Deskripsi)" value={settings.hero.subtitle} onChange={v => handleChange('hero', 'subtitle', v)} />
                                </div>

                                <SectionHeader icon={<Info className="text-teal-500" />} title="Tentang Kami" />
                                <div className="space-y-6">
                                    <Textarea label="Deskripsi Perusahaan" value={settings.about.description} onChange={v => handleChange('about', 'description', v)} rows={4} />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Input label="Angka Badge (e.g 5+)" value={settings.about.badgeValue} onChange={v => handleChange('about', 'badgeValue', v)} />
                                        <Input label="Judul Badge" value={settings.about.badgeTitle} onChange={v => handleChange('about', 'badgeTitle', v)} />
                                        <Input label="Sub Badge" value={settings.about.badgeSub} onChange={v => handleChange('about', 'badgeSub', v)} />
                                    </div>
                                    <ImageField label="Foto Section Tentang" img={settings.about.img} onUpload={e => handleImageUpload('about', null, 'img', e)} />
                                </div>

                                <SectionHeader icon={<Phone className="text-rose-500" />} title="Kontak & Lokasi" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Nomor WhatsApp" value={settings.contact.phone} onChange={v => handleChange('contact', 'phone', v)} />
                                    <Input label="Alamat Email" value={settings.contact.email} onChange={v => handleChange('contact', 'email', v)} />
                                </div>

                                <SectionHeader icon={<Zap className="text-amber-500" />} title="Teknologi Configurator" />
                                <div className="grid gap-6">
                                    <Input label="Judul Teknologi" value={settings.tech?.title} onChange={v => handleChange('tech', 'title', v)} />
                                    <Textarea label="Deskripsi Teknologi" value={settings.tech?.desc} onChange={v => handleChange('tech', 'desc', v)} />
                                </div>
                            </div>
                        )}

                        {/* TAB: PRODUK & PORTOFOLIO */}
                        {activeTab === 'produk' && (
                            <div className="space-y-12 animate-fade-in">
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <SectionHeader icon={<Briefcase className="text-indigo-500" />} title="Katalog Produk" />
                                        <button onClick={() => addItem('products', { title: 'Produk Baru', features: 'Fitur 1, Fitur 2', img: '' })} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                                            <Plus size={18} /> Tambah Produk
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {settings.products.map((p, i) => (
                                            <Card key={i} onDelete={() => removeItem('products', i)}>
                                                <ImageField img={p.img} onUpload={e => handleImageUpload('products', i, 'img', e)} className="h-40" />
                                                <Input label="Nama Produk" value={p.title} onChange={v => handleArrayChange('products', i, 'title', v)} />
                                                <Input label="Fitur (Koma)" value={p.features} onChange={v => handleArrayChange('products', i, 'features', v)} />
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <SectionHeader icon={<ImageIcon className="text-rose-500" />} title="Galeri Portofolio" />
                                        <button onClick={() => addItem('portfolio', { title: 'Proyek Baru', img: '', span: 'col-span-1 row-span-1' })} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                                            <Plus size={18} /> Tambah Foto
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {settings.portfolio.map((p, i) => (
                                            <Card key={i} onDelete={() => removeItem('portfolio', i)}>
                                                <ImageField img={p.img} onUpload={e => handleImageUpload('portfolio', i, 'img', e)} className="h-32" />
                                                <Input label="Judul Proyek" value={p.title} onChange={v => handleArrayChange('portfolio', i, 'title', v)} />
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: LAYANAN & ALUR */}
                        {activeTab === 'alur' && (
                            <div className="space-y-12 animate-fade-in">
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <SectionHeader icon={<Zap className="text-amber-500" />} title="Layanan Spesialis" />
                                        <button onClick={() => addItem('services', { title: 'Layanan Baru', desc: '' })} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                                            <Plus size={18} /> Tambah Layanan
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {settings.services.map((s, i) => (
                                            <Card key={i} onDelete={() => removeItem('services', i)}>
                                                <Input label="Judul" value={s.title} onChange={v => handleArrayChange('services', i, 'title', v)} />
                                                <Textarea label="Deskripsi" value={s.desc} onChange={v => handleArrayChange('services', i, 'desc', v)} />
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <SectionHeader icon={<LayoutTemplate className="text-indigo-500" />} title="Alur Kerja (How It Works)" />
                                        <button onClick={() => addItem('howItWorks', { title: 'Langkah Baru', desc: '' })} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                                            <Plus size={18} /> Tambah Langkah
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {settings.howItWorks.map((step, i) => (
                                            <Card key={i} onDelete={() => removeItem('howItWorks', i)}>
                                                <Input label="Langkah" value={step.title} onChange={v => handleArrayChange('howItWorks', i, 'title', v)} />
                                                <Textarea label="Deskripsi" value={step.desc} onChange={v => handleArrayChange('howItWorks', i, 'desc', v)} />
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: ORANG */}
                        {activeTab === 'orang' && (
                            <div className="space-y-12 animate-fade-in">
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <SectionHeader icon={<Users className="text-indigo-500" />} title="Tim Profesional" />
                                        <button onClick={() => addItem('team', { name: 'Nama', role: 'Jabatan', img: '' })} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                                            <Plus size={18} /> Tambah Anggota
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {settings.team.map((t, i) => (
                                            <Card key={i} onDelete={() => removeItem('team', i)}>
                                                <div className="flex justify-center mb-4">
                                                    <ImageField img={t.img} onUpload={e => handleImageUpload('team', i, 'img', e)} className="w-24 h-24 rounded-full" />
                                                </div>
                                                <Input label="Nama" value={t.name} onChange={v => handleArrayChange('team', i, 'name', v)} />
                                                <Input label="Jabatan" value={t.role} onChange={v => handleArrayChange('team', i, 'role', v)} />
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <SectionHeader icon={<Star className="text-amber-500" />} title="Testimoni Klien" />
                                        <button onClick={() => addItem('testimonials', { name: 'Klien', loc: 'Lokasi', text: '' })} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                                            <Plus size={18} /> Tambah Ulasan
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {settings.testimonials.map((testi, i) => (
                                            <Card key={i} onDelete={() => removeItem('testimonials', i)}>
                                                <Textarea label="Isi Ulasan" value={testi.text} onChange={v => handleArrayChange('testimonials', i, 'text', v)} />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input label="Nama" value={testi.name} onChange={v => handleArrayChange('testimonials', i, 'name', v)} />
                                                    <Input label="Lokasi" value={testi.loc} onChange={v => handleArrayChange('testimonials', i, 'loc', v)} />
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: FAQ & BLOG */}
                        {activeTab === 'faq' && (
                            <div className="space-y-12 animate-fade-in">
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <SectionHeader icon={<HelpCircle className="text-indigo-500" />} title="FAQ (Tanya Jawab)" />
                                        <button onClick={() => addItem('faqs', { q: 'Pertanyaan?', a: '' })} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                                            <Plus size={18} /> Tambah FAQ
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {settings.faqs.map((faq, i) => (
                                            <Card key={i} onDelete={() => removeItem('faqs', i)}>
                                                <Input label="Pertanyaan" value={faq.q} onChange={v => handleArrayChange('faqs', i, 'q', v)} />
                                                <Textarea label="Jawaban" value={faq.a} onChange={v => handleArrayChange('faqs', i, 'a', v)} />
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <SectionHeader icon={<FileText className="text-rose-500" />} title="Artikel Blog" />
                                        <button onClick={() => addItem('articles', { title: 'Judul', date: 'Tanggal', desc: '', img: '' })} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                                            <Plus size={18} /> Tambah Artikel
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {settings.articles.map((art, i) => (
                                            <Card key={i} onDelete={() => removeItem('articles', i)}>
                                                <ImageField img={art.img} onUpload={e => handleImageUpload('articles', i, 'img', e)} className="h-40" />
                                                <Input label="Judul" value={art.title} onChange={v => handleArrayChange('articles', i, 'title', v)} />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input label="Tanggal" value={art.date} onChange={v => handleArrayChange('articles', i, 'date', v)} />
                                                </div>
                                                <Textarea label="Ringkasan" value={art.desc} onChange={v => handleArrayChange('articles', i, 'desc', v)} />
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Global Components for UI Consistency
const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">{icon}</div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
    </div>
);

const Input = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-1.5 w-full">
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
        />
    </div>
);

const Textarea = ({ label, value, onChange, rows = 3 }) => (
    <div className="space-y-1.5 w-full">
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
        <textarea
            rows={rows}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium resize-none"
        />
    </div>
);

const ImageField = ({ label, img, onUpload, className = "w-full h-48" }) => (
    <div className="space-y-2">
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
        <div className={`${className} bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden relative group`}>
            {img ? (
                <img src={img} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <ImageIcon size={32} />
                    <span className="text-xs font-bold">Belum ada foto</span>
                </div>
            )}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                <label className="cursor-pointer bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg">
                    Upload Baru
                    <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                </label>
                {img && <p className="text-white text-[10px] font-bold">Klik untuk ganti</p>}
            </div>
        </div>
    </div>
);

const Card = ({ children, onDelete }) => (
    <div className="p-6 border border-slate-200 rounded-3xl bg-white space-y-4 relative group/card hover:border-slate-300 transition-all hover:shadow-xl hover:shadow-slate-100">
        <button 
            onClick={onDelete}
            className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-rose-500 shadow-md opacity-0 group-hover/card:opacity-100 hover:bg-rose-500 hover:text-white transition-all z-20"
        >
            <Trash2 size={18} />
        </button>
        {children}
    </div>
);
