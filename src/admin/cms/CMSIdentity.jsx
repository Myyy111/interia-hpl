import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Globe, Search } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea } from './CMSComponents';

const CMSIdentity = () => {
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
                title="Identitas & SEO" 
                desc="Kelola nama situs, tagline, dan optimasi mesin pencari." 
                onSave={handleSave} 
                isSaving={isSaving} 
                message={message} 
            />
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                <section>
                    <SectionHeader icon={<Globe className="text-blue-500" />} title="Identitas Situs" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nama Bisnis / Brand" value={settings.site?.name || ''} onChange={v => setSettings({...settings, site: {...settings.site, name: v}})} />
                        <Input label="Tagline" value={settings.site?.tagline || ''} onChange={v => setSettings({...settings, site: {...settings.site, tagline: v}})} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Search className="text-slate-500" />} title="SEO (Optimasi Google)" />
                    <div className="grid gap-6">
                        <Input label="Meta Title" value={settings.seo?.title || ''} onChange={v => setSettings({...settings, seo: {...settings.seo, title: v}})} placeholder="Judul yang muncul di Google..." />
                        <Textarea label="Meta Description" value={settings.seo?.description || ''} onChange={v => setSettings({...settings, seo: {...settings.seo, description: v}})} placeholder="Penjelasan singkat toko Anda untuk hasil pencarian Google..." />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSIdentity;
