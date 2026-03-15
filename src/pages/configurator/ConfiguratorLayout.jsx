import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import RoomSizeForm from './steps/RoomSizeForm';
import DoorsWindowsForm from './steps/DoorsWindowsForm';
import PhotoUploadForm from './steps/PhotoUploadForm';
import ProductSelectionForm from './steps/ProductSelectionForm';
import DesignConfigForm from './steps/DesignConfigForm';
import OrderForm from './steps/OrderForm';
import RoomPreview2D from '../../components/RoomPreview2D';
import PriceEstimator from '../../components/PriceEstimator';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

const STEPS = [
    { id: 'room-size', label: 'Ukuran Ruangan' },
    { id: 'doors-windows', label: 'Pintu & Jendela' },
    { id: 'photos', label: 'Foto Ruangan' },
    { id: 'product', label: 'Pilih Produk' },
    { id: 'design', label: 'Desain & Material' },
    { id: 'order', label: 'Pemesanan' }
];

export default function ConfiguratorLayout() {
    const [currentStep, setCurrentStep] = useState(0);
    const [config, setConfig] = useState({
        room: { length: 300, width: 300, height: 280, shape: 'Persegi panjang', LSide: 0, USideL: 0, USideR: 0 },
        fixtures: [], // doors and windows
        photos: [],
        productSelection: { productId: '', shape: '', name: '' },
        design: { model: 'Minimalis', materialId: '', color: '', accessories: [] }
    });

    const [metadata, setMetadata] = useState({ products: [], materials: [], accessories: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    useEffect(() => {
        Promise.all([api.getProducts(), api.getMaterials(), api.getAccessories()]).then(
            ([products, materials, accessories]) => {
                setMetadata({ products, materials, accessories });
            }
        );
    }, []);

    const updateConfig = (section, data) => {
        setConfig(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
    };

    const setConfigDirect = (section, data) => {
        setConfig(prev => ({ ...prev, [section]: data }));
    };

    const handleNext = () => setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
    const handlePrev = () => setCurrentStep(Math.max(currentStep - 1, 0));

    const estimatePrice = () => {
        if (!config.productSelection.productId) return 0;

        const product = metadata.products.find(p => p.id === config.productSelection.productId);
        if (!product) return 0;

        let lengthMeters = 0;
        // Calculate length based on product shape
        if (config.productSelection.shape === 'Lurus') {
            lengthMeters = config.room.length / 100;
        } else if (config.productSelection.shape === 'L-shape') {
            lengthMeters = (config.room.length + config.room.width) / 100;
        } else if (config.productSelection.shape === 'U-shape') {
            lengthMeters = (config.room.length + config.room.width * 2) / 100;
        } else {
            lengthMeters = config.room.length / 100;
        }

        let basePrice = product.basePrice * lengthMeters;

        // Add material multiplier
        const material = metadata.materials.find(m => m.id === config.design.materialId);
        if (material) {
            basePrice *= material.priceModifier;
        }

        // Add accessories
        const accessoriesPrice = config.design.accessories.reduce((total, accId) => {
            const acc = metadata.accessories.find(a => a.id === accId);
            return total + (acc ? acc.price : 0);
        }, 0);

        return basePrice + accessoriesPrice;
    };

    const submitOrder = async (customerData) => {
        setIsSubmitting(true);
        const totalPrice = estimatePrice();
        const orderData = {
            config,
            totalPrice,
            customer: customerData,
            product: metadata.products.find(p => p.id === config.productSelection.productId)
        };
        try {
            await api.submitOrder(orderData);
            setOrderComplete(true);
        } catch (e) {
            console.error(e);
            alert('Terjadi kesalahan saat menyimpan pesanan');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center space-y-6">
                    <div className="mx-auto w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">Pesanan Berhasil!</h1>
                    <p className="text-slate-600 text-lg">
                        Terima kasih! Permintaan produksi custom furniture Anda telah kami terima. Tim workshop Afandi Interior akan segera menghubungi Anda via WhatsApp untuk jadwal survey & konfirmasi desain.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-md shadow-teal-500/30 transition-all hover:-translate-y-1"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    const StepComponent = [
        RoomSizeForm,
        DoorsWindowsForm,
        PhotoUploadForm,
        ProductSelectionForm,
        DesignConfigForm,
        OrderForm
    ][currentStep];

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/brand/logo-icon.jpg" alt="Icon" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
                        <img src="/brand/logo-text.jpg" alt="Afandi Interior Text" className="h-[36px] object-contain hidden sm:block rounded-md p-1 bg-white" />
                    </div>
                    <div className="hidden md:flex items-center space-x-1 flex-1 justify-center max-w-2xl mx-8">
                        {STEPS.map((step, idx) => (
                            <React.Fragment key={step.id}>
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-500 ${idx === currentStep ? 'bg-indigo-600 text-white shadow-md ring-4 ring-indigo-50 flex-shrink-0' : idx < currentStep ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {idx < currentStep ? <CheckCircle size={16} /> : idx + 1}
                                </div>
                                {idx < STEPS.length - 1 && <div className={`flex-1 h-1 rounded-full mx-1 transition-all duration-500 ${idx < currentStep ? 'bg-teal-500' : 'bg-slate-100'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        <span className="md:hidden text-teal-600 font-bold">{currentStep + 1}</span>
                        <span className="md:hidden">/ {STEPS.length}</span>
                        <span className="hidden md:inline">Langkah {currentStep + 1} dari {STEPS.length}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 pb-32 lg:pb-8">
                {/* Left Form Area */}
                <div className="flex-1 max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col relative z-10 transition-all duration-300">
                    <div className="p-6 md:p-8 flex-1 overflow-visible">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <span className="bg-indigo-50 text-indigo-600 w-10 h-10 flex items-center justify-center rounded-xl md:hidden font-black text-lg shadow-inner">{currentStep + 1}</span>
                            {STEPS[currentStep].label}
                        </h2>
                        <div className="animate-fade-in-up">
                            <StepComponent
                                config={config}
                                updateConfig={updateConfig}
                                setConfigDirect={setConfigDirect}
                                metadata={metadata}
                                onSubmit={currentStep === STEPS.length - 1 ? submitOrder : handleNext}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Form Navigation Controls - Desktop Only */}
                    <div className="hidden md:flex p-6 bg-slate-50 border-t border-slate-100 items-center justify-between mt-auto">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-200'}`}
                        >
                            <ChevronLeft size={20} /> Kembali
                        </button>
                        {currentStep < STEPS.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                            >
                                Lanjutkan <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={() => submitOrder({ name: 'Test', phone: '08123', address: 'Test' })} // The actual submit runs inside the OrderForm, so this desktop btn can just be an event trigger mostly, handled by form submit.
                                className="hidden" // Handled by OrderForm submit button itself
                            >Submit</button>
                        )}
                    </div>
                </div>

                {/* Right Preview & Estimate Area (Sticky on Desktop, Top on Mobile sometimes, but better sticked at bottom UI) */}
                <div className="w-full lg:w-[400px] xl:w-[480px] flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start z-0 order-first lg:order-last">
                    <div className="hidden lg:block">
                        <PriceEstimator price={estimatePrice()} />
                    </div>
                    <RoomPreview2D config={config} />
                </div>
            </main>

            {/* Mobile Sticky Bottom Bar Navigation & Price */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Estimasi Harga</span>
                    <span className="text-xl font-black text-indigo-700 leading-none mt-1">
                        Rp {estimatePrice() > 0 ? (estimatePrice() / 1000000).toFixed(1) + ' Jt' : '0'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-all ${currentStep === 0 ? 'opacity-50' : 'hover:bg-slate-200'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {currentStep < STEPS.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 flex items-center justify-center gap-2 px-6 h-12 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all w-32"
                        >
                            Lanjut <ChevronRight size={20} />
                        </button>
                    ) : (
                        // On the last step, let the form handle Submit natively or trigger form by ID.
                        <button
                            form="order-form" // This Requires OrderForm to have id="order-form"
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 px-6 h-12 bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 active:scale-95 transition-all w-32"
                        >
                            Kirim
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
