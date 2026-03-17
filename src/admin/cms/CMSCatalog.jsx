import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Briefcase, Image as ImageIcon, Plus } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, ImageField, Card } from './CMSComponents';

const CMSCatalog = () => {
    const [settings, setSettings] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.getSettings().then(setSettings);
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.updateSettings(settings);
            setMessage('Berhasil disimpan!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) { 
            console.error(error);
            setMessage('Gagal simpan'); 
        }
        setIsSaving(false);
    };

    if (!settings) return null;

    const addItem = (section, template) => {
        setSettings({...settings, [section]: [...settings[section], template]});
    };

    const removeItem = (section, index) => {
        if (window.confirm('Hapus item ini?')) {
            setSettings({...settings, [section]: settings[section].filter((_, i) => i !== index)});
        }
    };

    const handleImageChange = (section, index, file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const newArr = [...settings[section]];
            newArr[index] = {...newArr[index], img: reader.result};
            setSettings({...settings, [section]: newArr});
        };
        reader.readAsDataURL(file);
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
                        <button onClick={() => addItem('products', {title: '', features: '', img: ''})} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                            <Plus size={18} /> Tambah Produk
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
                        <button onClick={() => addItem('portfolio', {title: '', img: ''})} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                            <Plus size={18} /> Tambah Proyek
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
