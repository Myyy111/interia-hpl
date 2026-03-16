import { CheckCircle2, Package, Ruler, DoorOpen, Layers, ShoppingBag, Camera, Share2, Save, Copy, Check, Info as InfoIcon } from 'lucide-react';
import { trackEvent, ANALYTICS_EVENTS } from '../../../lib/analytics';
import { api } from '../../../lib/api';

const WALL_LABELS = { Utara: 'Dinding A (Depan)', Selatan: 'Dinding B (Belakang)', Barat: 'Dinding C (Kiri)', Timur: 'Dinding D (Kanan)' };

export default function OrderReviewStep({ config, metadata, estimatedPrice }) {
    const { room, fixtures, photos, productSelection, design } = config;
    const { products, materials, accessories } = metadata;

    const [isSaving, setIsSaving] = React.useState(false);
    const [shareUrl, setShareUrl] = React.useState('');
    const [copied, setCopied] = React.useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const id = await api.saveDesign(config, estimatedPrice);
            const url = `${window.location.origin}/configurator?id=${id}`;
            setShareUrl(url);
            trackEvent('design_saved', { id });
        } catch (e) {
            console.error(e);
            alert('Gagal menyimpan desain. Coba lagi nanti.');
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const selectedProduct = products.find(p => p.id === productSelection.productId);
    const selectedMaterial = materials.find(m => m.id === design.materialId);
    const selectedAccessories = accessories.filter(a => design.accessories.includes(a.id));

    const SectionCard = ({ icon: Icon, title, color, children }) => (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className={`px-5 py-3 flex items-center gap-2 border-b border-slate-100 ${color}`}>
                <Icon size={16} />
                <span className="font-bold text-sm">{title}</span>
            </div>
            <div className="px-5 py-4 space-y-2">{children}</div>
        </div>
    );

    const Row = ({ label, value }) => (
        <div className="flex justify-between items-start gap-4">
            <span className="text-sm text-slate-500 shrink-0">{label}</span>
            <span className="text-sm font-semibold text-slate-800 text-right">{value || '-'}</span>
        </div>
    );

    return (
        <div className="space-y-4 pb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-amber-500 rounded-2xl p-5 text-white flex items-start gap-3 shadow-lg shadow-teal-900/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={22} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Review Konfigurasi Anda</h3>
                    <p className="text-sm text-white/70 mt-0.5">Periksa kembali semua detail sebelum mengirimkan permintaan</p>
                </div>
            </div>

            {/* Product */}
            <SectionCard icon={Package} title="Produk yang Dipilih" color="bg-indigo-50 text-indigo-700">
                <Row label="Jenis Produk" value={selectedProduct?.name || 'Belum dipilih'} />
                <Row label="Model / Shape" value={productSelection.shape} />
                <Row label="Gaya Desain" value={design.model} />
            </SectionCard>

            {/* Room Size */}
            <SectionCard icon={Ruler} title="Ukuran Ruangan" color="bg-slate-100 text-slate-700">
                <Row label="Bentuk Ruangan" value={room.shape} />
                <Row label="Panjang Utama" value={`${room.length} cm (${(room.length / 100).toFixed(2)} m)`} />
                <Row label="Lebar Utama" value={`${room.width} cm (${(room.width / 100).toFixed(2)} m)`} />
                <Row label="Tinggi Ruangan" value={`${room.height} cm`} />
                {room.shape === 'L-shape' && <Row label="Panjang Sisi L" value={`${room.LSide || 0} cm`} />}
                {room.shape === 'U-shape' && <>
                    <Row label="Sayap Kiri" value={`${room.USideL || 0} cm`} />
                    <Row label="Sayap Kanan" value={`${room.USideR || 0} cm`} />
                </>}
            </SectionCard>

            {/* Doors & Windows */}
            <SectionCard icon={DoorOpen} title={`Pintu & Jendela (${fixtures.length} item)`} color="bg-amber-50 text-amber-700">
                {fixtures.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">Tidak ada pintu/jendela ditambahkan</p>
                ) : fixtures.map((f, i) => (
                    <div key={f.id} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                        <span className="text-sm font-medium text-slate-700">
                            {f.type === 'door' ? '🚪' : '🪟'} {f.type === 'door' ? 'Pintu' : 'Jendela'} {i + 1}
                        </span>
                        <span className="text-xs text-slate-500">
                            {WALL_LABELS[f.position] || f.position} · {f.width}×{f.height}cm
                        </span>
                    </div>
                ))}
            </SectionCard>

            {/* Material */}
            <SectionCard icon={Layers} title="Material & Aksesori" color="bg-indigo-50 text-indigo-700">
                <Row label="Material Utama" value={selectedMaterial?.name || 'Belum dipilih'} />
                {selectedMaterial?.priceModifier > 1 && (
                    <Row label="Harga Material" value={`+${Math.round((selectedMaterial.priceModifier - 1) * 100)}% dari base`} />
                )}
                <div className="pt-1">
                    <span className="text-sm text-slate-500">Aksesori Tambahan:</span>
                    {selectedAccessories.length === 0 ? (
                        <span className="text-sm text-slate-400 italic ml-2">Tidak ada</span>
                    ) : (
                        <ul className="mt-1 space-y-1">
                            {selectedAccessories.map(a => (
                                <li key={a.id} className="flex justify-between text-sm">
                                    <span className="text-slate-700">• {a.name}</span>
                                    <span className="text-teal-700 font-semibold">+Rp {a.price.toLocaleString('id-ID')}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </SectionCard>

            {/* Photos */}
            {photos.length > 0 && (
                <SectionCard icon={Camera} title={`Foto Ruangan (${photos.length} foto)`} color="bg-teal-50 text-teal-700">
                    <div className="grid grid-cols-3 gap-2">
                        {photos.map((src, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                                <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* Price Summary */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={18} className="text-teal-400" />
                            <span className="text-slate-300 text-sm font-semibold uppercase tracking-wider">Total Estimasi</span>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">Real-time</span>
                    </div>
                    <div className="text-4xl font-extrabold tracking-tight text-white">
                        Rp {estimatedPrice > 0 ? estimatedPrice.toLocaleString('id-ID') : '0'}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        *Estimasi dapat berubah setelah survey langsung. Sudah termasuk ongkos kirim & instalasi standar Jabodetabek.
                    </p>
                </div>
            </div>

            {/* Download PDF Button */}
            <button
                onClick={() => {
                    trackEvent(ANALYTICS_EVENTS.PDF_DOWNLOAD, { type: 'draft' });
                    import('../../../lib/pdfGenerator').then(m => m.generateQuotationPDF({ 
                        config, 
                        metadata, 
                        estimatedPrice, 
                        customer: { name: 'Draft Pelanggan' } 
                    }));
                }}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 hover:border-teal-500 hover:text-teal-600 text-slate-600 rounded-2xl font-bold transition-all hover:bg-teal-50 active:scale-95 shadow-sm"
            >
                <div className="p-1 px-2 bg-rose-100 text-rose-600 rounded text-[10px] font-black uppercase tracking-tighter">PDF</div>
                Download Draft Penawaran
            </button>

            {/* Save & Share Section */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 space-y-4">
                <div className="flex items-center gap-2 text-slate-800">
                    <Share2 size={18} className="text-teal-500" />
                    <span className="font-bold text-sm">Simpan & Bagikan Desain</span>
                </div>
                
                {shareUrl ? (
                    <div className="space-y-3 animate-fade-in">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                            <span className="text-[10px] font-medium text-slate-500 truncate flex-1">{shareUrl}</span>
                            <button 
                                onClick={copyToClipboard}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold transition-all hover:bg-teal-700 active:scale-95"
                            >
                                {copied ? <><Check size={12} /> Tersalin</> : <><Copy size={12} /> Salin</>}
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <InfoIcon size={10} /> Kirim link ini ke rekan atau buka di perangkat lain untuk melanjutkan.
                        </p>
                    </div>
                ) : (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-all border border-slate-200 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <><span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /> Menyimpan...</>
                        ) : (
                            <><Save size={16} /> Dapatkan Link Berbagi</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
