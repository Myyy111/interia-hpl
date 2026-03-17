import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { LayoutTemplate, Info, Phone, Zap } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea, ImageField } from './CMSComponents';

const CMSGeneral = () => {
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

    return (
        <div className="animate-fade-in">
            <CMSHeader 
                title="Pengaturan Umum" 
                desc="Kelola Hero, Tentang Kami, dan Kontak." 
                onSave={handleSave} 
                isSaving={isSaving} 
                message={message} 
            />
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                <section>
                    <SectionHeader icon={<LayoutTemplate className="text-indigo-500" />} title="Hero Section" />
                    <div className="grid gap-6">
                        <Input label="Judul Utama" value={settings.hero.title} onChange={v => setSettings({...settings, hero: {...settings.hero, title: v}})} />
                        <Textarea label="Sub-judul" value={settings.hero.subtitle} onChange={v => setSettings({...settings, hero: {...settings.hero, subtitle: v}})} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Info className="text-teal-500" />} title="Tentang Kami" />
                    <div className="space-y-6">
                        <Textarea label="Deskripsi" value={settings.about.description} onChange={v => setSettings({...settings, about: {...settings.about, description: v}})} rows={4} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Badge Angka" value={settings.about.badgeValue} onChange={v => setSettings({...settings, about: {...settings.about, badgeValue: v}})} />
                            <Input label="Badge Judul" value={settings.about.badgeTitle} onChange={v => setSettings({...settings, about: {...settings.about, badgeTitle: v}})} />
                            <Input label="Badge Sub" value={settings.about.badgeSub} onChange={v => setSettings({...settings, about: {...settings.about, badgeSub: v}})} />
                        </div>
                        <ImageField label="Foto Utama" img={settings.about.img} onUpload={e => {
                            const reader = new FileReader();
                            reader.onload = () => setSettings({...settings, about: {...settings.about, img: reader.result}});
                            reader.readAsDataURL(e.target.files[0]);
                        }} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Phone className="text-rose-500" />} title="Kontak" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="WhatsApp" value={settings.contact.phone} onChange={v => setSettings({...settings, contact: {...settings.contact, phone: v}})} />
                        <Input label="Email" value={settings.contact.email} onChange={v => setSettings({...settings, contact: {...settings.contact, email: v}})} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSGeneral;
