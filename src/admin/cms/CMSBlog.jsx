import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { BookOpen, Plus, FileText } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea, ImageField, Card } from './CMSComponents';

const CMSBlog = () => {
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

    const addItem = () => {
        const newItem = { 
            title: '', 
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), 
            img: '', 
            desc: '',
            content: ''
        };
        setSettings({...settings, articles: [...settings.articles, newItem]});
    };

    const removeItem = (index) => {
        if (window.confirm('Hapus artikel ini?')) {
            setSettings({...settings, articles: settings.articles.filter((_, i) => i !== index)});
        }
    };

    const handleImageChange = async (index, file) => {
        if (!file) return;
        try {
            const url = await api.uploadImage(file);
            const newArr = [...settings.articles];
            newArr[index] = {...newArr[index], img: url};
            setSettings({...settings, articles: newArr});
        } catch (error) {
            console.error('Upload error:', error);
            alert('Gagal upload gambar. Pastikan bucket "content" tersedia di Supabase.');
        }
    };

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Manajemen Blog" 
                desc="Tulis inspirasi, tips, dan edukasi untuk klien Anda." 
                onSave={handleSave} 
                isSaving={isSaving} 
                message={message} 
            />
            
            <div className="space-y-8">
                <div className="flex justify-between items-center px-2">
                    <SectionHeader icon={<BookOpen className="text-teal-500" />} title="Daftar Artikel" />
                    <button onClick={addItem} className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
                        <Plus size={18} /> Tulis Artikel Baru
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {settings.articles.map((a, i) => (
                        <Card key={i} onDelete={() => removeItem(i)}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1">
                                    <ImageField label="Gambar Sampul" img={a.img} onUpload={e => handleImageChange(i, e.target.files[0])} className="h-56" />
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input label="Judul Artikel" value={a.title} onChange={v => {
                                            const newArr = [...settings.articles];
                                            newArr[i] = {...newArr[i], title: v};
                                            setSettings({...settings, articles: newArr});
                                        }} />
                                        <Input label="Tanggal Publish" value={a.date} onChange={v => {
                                            const newArr = [...settings.articles];
                                            newArr[i] = {...newArr[i], date: v};
                                            setSettings({...settings, articles: newArr});
                                        }} />
                                    </div>
                                    <Textarea label="Ringkasan (Muncul di Depan)" value={a.desc} onChange={v => {
                                        const newArr = [...settings.articles];
                                        newArr[i] = {...newArr[i], desc: v};
                                        setSettings({...settings, articles: newArr});
                                    }} rows={2} />
                                    <Textarea label="Konten Lengkap Artikel" value={a.content} onChange={v => {
                                        const newArr = [...settings.articles];
                                        newArr[i] = {...newArr[i], content: v};
                                        setSettings({...settings, articles: newArr});
                                    }} rows={8} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CMSBlog;
