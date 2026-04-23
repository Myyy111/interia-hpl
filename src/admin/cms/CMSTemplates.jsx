import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { CMSHeader, SectionHeader, Input, Textarea } from './CMSComponents';

const CMSTemplates = () => {
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
                title="Template Dokumen" 
                desc="Kelola informasi pembayaran dan syarat ketentuan RAB/Invoice." 
                onSave={handleSave} 
                isSaving={isSaving} 
                message={message} 
            />
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                <section>
                    <SectionHeader icon={<CreditCard className="text-blue-500" />} title="Informasi Pembayaran" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Nama Bank" value={settings.payment?.bankName || ''} onChange={v => setSettings({...settings, payment: {...settings.payment, bankName: v}})} />
                        <Input label="Nomor Rekening" value={settings.payment?.bankAccount || ''} onChange={v => setSettings({...settings, payment: {...settings.payment, bankAccount: v}})} />
                        <Input label="Atas Nama (A/N)" value={settings.payment?.bankHolder || ''} onChange={v => setSettings({...settings, payment: {...settings.payment, bankHolder: v}})} />
                    </div>
                </section>

                <section>
                    <SectionHeader icon={<ShieldCheck className="text-emerald-500" />} title="Syarat & Ketentuan" />
                    <div className="space-y-6">
                        <Textarea 
                            label="Syarat & Ketentuan RAB" 
                            value={settings.templates?.rabTerms || ''} 
                            onChange={v => setSettings({...settings, templates: {...settings.templates, rabTerms: v}})} 
                            rows={6}
                        />
                        <Textarea 
                            label="Syarat & Ketentuan Invoice" 
                            value={settings.templates?.invoiceTerms || ''} 
                            onChange={v => setSettings({...settings, templates: {...settings.templates, invoiceTerms: v}})} 
                            rows={4}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CMSTemplates;
