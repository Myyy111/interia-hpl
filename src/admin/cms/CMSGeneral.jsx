import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { LayoutTemplate, Info, Phone, Zap, CreditCard, ShieldCheck, Share2, Globe, Search } from 'lucide-react';
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
                    <SectionHeader icon={<Globe className="text-blue-500" />} title="Identitas Situs" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nama Bisnis / Brand" value={settings.site?.name || 'Afandi Interior'} onChange={v => setSettings({...settings, site: {...settings.site, name: v}})} />
                        <Input label="Tagline" value={settings.site?.tagline || 'Spesialis Desain & Produksi'} onChange={v => setSettings({...settings, site: {...settings.site, tagline: v}})} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Search className="text-slate-500" />} title="SEO (Optimasi Google)" />
                    <div className="grid gap-6">
                        <Input label="Meta Title" value={settings.seo?.title || ''} onChange={v => setSettings({...settings, seo: {...settings.seo, title: v}})} placeholder="Judul yang muncul di Google..." />
                        <Textarea label="Meta Description" value={settings.seo?.description || ''} onChange={v => setSettings({...settings, seo: {...settings.seo, description: v}})} placeholder="Penjelasan singkat toko Anda untuk hasil pencarian Google..." />
                    </div>
                </section>

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
                        <ImageField label="Foto Utama" img={settings.about.img} onUpload={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            try {
                                const url = await api.uploadImage(file);
                                setSettings({...settings, about: {...settings.about, img: url}});
                            } catch (error) {
                                console.error('Upload error:', error);
                                alert('Gagal upload gambar. Pastikan bucket "content" tersedia di Supabase.');
                            }
                        }} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<Phone className="text-rose-500" />} title="Kontak & Sosial Media" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="WhatsApp" value={settings.contact.phone} onChange={v => setSettings({...settings, contact: {...settings.contact, phone: v}})} />
                        <Input label="Email Official" value={settings.contact.email} onChange={v => setSettings({...settings, contact: {...settings.contact, email: v}})} />
                        <Input label="Instagram (URL)" value={settings.contact.instagram} onChange={v => setSettings({...settings, contact: {...settings.contact, instagram: v}})} />
                        <Input label="Facebook (URL)" value={settings.contact.facebook} onChange={v => setSettings({...settings, contact: {...settings.contact, facebook: v}})} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<CreditCard className="text-blue-500" />} title="Informasi Pembayaran (Invoice)" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Nama Bank" value={settings.payment?.bankName || ''} onChange={v => setSettings({...settings, payment: {...settings.payment, bankName: v}})} />
                        <Input label="Nomor Rekening" value={settings.payment?.bankAccount || ''} onChange={v => setSettings({...settings, payment: {...settings.payment, bankAccount: v}})} />
                        <Input label="Atas Nama (A/N)" value={settings.payment?.bankHolder || ''} onChange={v => setSettings({...settings, payment: {...settings.payment, bankHolder: v}})} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<ShieldCheck className="text-emerald-500" />} title="Syarat & Ketentuan (Templates)" />
                    <div className="space-y-6">
                        <Textarea 
                            label="Syarat & Ketentuan RAB (Penawaran)" 
                            value={settings.templates?.rabTerms || ''} 
                            onChange={v => setSettings({...settings, templates: {...settings.templates, rabTerms: v}})} 
                            rows={6}
                            placeholder="Tuliskan poin-poin S&K untuk penawaran harga..."
                        />
                        <Textarea 
                            label="Syarat & Ketentuan Invoice (Nota)" 
                            value={settings.templates?.invoiceTerms || ''} 
                            onChange={v => setSettings({...settings, templates: {...settings.templates, invoiceTerms: v}})} 
                            rows={4}
                            placeholder="Tuliskan poin-poin S&K untuk penagihan/nota..."
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSGeneral;
