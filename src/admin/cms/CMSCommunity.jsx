import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Users, Star, Plus } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea, ImageField, Card } from './CMSComponents';

const CMSCommunity = () => {
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

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Tim & Testimoni" 
                desc="Kelola anggota tim dan ulasan dari klien kami." 
                onSave={handleSave} 
                isSaving={isSaving} 
                message={message} 
            />
            
            <div className="space-y-12">
                <section>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <SectionHeader icon={<Users className="text-indigo-500" />} title="Tim Profesional" />
                        <button 
                            onClick={() => addItem('team', {name: '', role: '', img: ''})} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            <Plus size={14} /> Tambah Anggota
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {settings.team.map((t, i) => (
                            <Card key={i} onDelete={() => removeItem('team', i)}>
                                <div className="flex justify-center mb-4">
                                    <ImageField img={t.img} onUpload={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        try {
                                            const url = await api.uploadImage(file);
                                            const newArr = [...settings.team];
                                            newArr[i] = {...newArr[i], img: url};
                                            setSettings({...settings, team: newArr});
                                        } catch (error) {
                                            console.error('Upload error:', error);
                                            alert('Gagal upload gambar. Pastikan bucket "content" tersedia di Supabase.');
                                        }
                                    }} className="w-24 h-24 rounded-full" />
                                </div>
                                <Input label="Nama" value={t.name} onChange={v => {
                                    const newArr = [...settings.team];
                                    newArr[i] = {...newArr[i], name: v};
                                    setSettings({...settings, team: newArr});
                                }} />
                                <Input label="Jabatan" value={t.role} onChange={v => {
                                    const newArr = [...settings.team];
                                    newArr[i] = {...newArr[i], role: v};
                                    setSettings({...settings, team: newArr});
                                }} />
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <SectionHeader icon={<Star className="text-amber-500" />} title="Ulasan Klien" />
                        <button 
                            onClick={() => addItem('testimonials', {name: '', loc: '', text: ''})} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            <Plus size={14} /> Tambah Ulasan
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {settings.testimonials.map((testi, i) => (
                            <Card key={i} onDelete={() => removeItem('testimonials', i)}>
                                <Textarea label="Isi Ulasan" value={testi.text} onChange={v => {
                                    const newArr = [...settings.testimonials];
                                    newArr[i] = {...newArr[i], text: v};
                                    setSettings({...settings, testimonials: newArr});
                                }} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Nama" value={testi.name} onChange={v => {
                                        const newArr = [...settings.testimonials];
                                        newArr[i] = {...newArr[i], name: v};
                                        setSettings({...settings, testimonials: newArr});
                                    }} />
                                    <Input label="Lokasi" value={testi.loc} onChange={v => {
                                        const newArr = [...settings.testimonials];
                                        newArr[i] = {...newArr[i], loc: v};
                                        setSettings({...settings, testimonials: newArr});
                                    }} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSCommunity;
