import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Briefcase, Image as ImageIcon, Plus } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, ImageField, Card } from './CMSComponents';
import { useToast } from '../../components/ui/Toast';

const CMSCatalog = () => {
    const { showToast } = useToast();
    const [settings, setSettings] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        api.getSettings().then(setSettings);
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.updateSettings(settings);
            showToast('Semua perubahan berhasil disimpan!');
        } catch (error) { 
            showToast('Gagal menyimpan perubahan', 'error');
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    const addItem = (section, template) => {
        setSettings({...settings, [section]: [...settings[section], template]});
        showToast('Item baru ditambahkan');
    };

    const removeItem = (section, index) => {
        if (window.confirm('Hapus item ini?')) {
            setSettings({...settings, [section]: settings[section].filter((_, i) => i !== index)});
            showToast('Item berhasil dihapus');
        }
    };

    const handleImageChange = async (section, index, file) => {
        if (!file) return;
        try {
            const url = await api.uploadImage(file);
            const newArr = [...settings[section]];
            newArr[index] = {...newArr[index], img: url};
            setSettings({...settings, [section]: newArr});
        } catch (error) {
            console.error('Upload error:', error);
            alert('Gagal upload gambar. Pastikan bucket "content" tersedia di Supabase.');
        }
    };

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Produk & Portofolio" 
                desc="Kelola katalog produk utama dan galeri hasil kerja." 
                onSave={handleSave} 
                isSaving={isSaving} 
                message={message} 
            />
            
            <div className="space-y-12">
                <section>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <SectionHeader icon={<Briefcase className="text-indigo-500" />} title="Katalog Produk" />
                        <button 
                            onClick={() => addItem('products', {title: '', features: '', img: ''})} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            <Plus size={14} /> Tambah Produk
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {settings.products.map((p, i) => (
                            <Card key={i} onDelete={() => removeItem('products', i)}>
                                <ImageField img={p.img} onUpload={e => handleImageChange('products', i, e.target.files[0])} className="h-40" />
                                <Input label="Nama Produk" value={p.title} onChange={v => {
                                    const newArr = [...settings.products];
                                    newArr[i] = {...newArr[i], title: v};
                                    setSettings({...settings, products: newArr});
                                }} />
                                <Input label="Fitur (Koma)" value={p.features} onChange={v => {
                                    const newArr = [...settings.products];
                                    newArr[i] = {...newArr[i], features: v};
                                    setSettings({...settings, products: newArr});
                                }} />
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <SectionHeader icon={<ImageIcon className="text-rose-500" />} title="Galeri Portofolio" />
                        <button 
                            onClick={() => addItem('portfolio', {title: '', img: ''})} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            <Plus size={14} /> Tambah Proyek
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {settings.portfolio.map((p, i) => (
                            <Card key={i} onDelete={() => removeItem('portfolio', i)}>
                                <ImageField img={p.img} onUpload={e => handleImageChange('portfolio', i, e.target.files[0])} className="h-32" />
                                <Input label="Judul Proyek" value={p.title} onChange={v => {
                                    const newArr = [...settings.portfolio];
                                    newArr[i] = {...newArr[i], title: v};
                                    setSettings({...settings, portfolio: newArr});
                                }} />
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSCatalog;
