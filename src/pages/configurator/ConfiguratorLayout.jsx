import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import WelcomeScreen from './steps/WelcomeScreen';
import PriceEstimator from '../../components/PriceEstimator';
import { trackEvent, ANALYTICS_EVENTS } from '../../lib/analytics';
import { ChevronRight, ChevronLeft, CheckCircle, Layers, Ruler, DoorOpen, Palette, ClipboardList, Camera, Send, Eye, LayoutList } from 'lucide-react';

import ProductSelectionForm from './steps/ProductSelectionForm';
import RoomSizeForm from './steps/RoomSizeForm';
import DoorsWindowsForm from './steps/DoorsWindowsForm';
import DesignConfigForm from './steps/DesignConfigForm';
import OrderReviewStep from './steps/OrderReviewStep';
import PhotoUploadForm from './steps/PhotoUploadForm';
import OrderForm from './steps/OrderForm';
import RoomPreview2D from '../../components/RoomPreview2D';


// New step order per requirements
const STEPS = [
    { id: 'product',  label: 'Pilih Produk',    short: 'Produk',    icon: Layers },
    { id: 'room',     label: 'Ukuran Ruangan',  short: 'Ukuran',    icon: Ruler },
    { id: 'fixtures', label: 'Pintu & Jendela', short: 'Pintu',     icon: DoorOpen },
    { id: 'design',   label: 'Gaya & Material', short: 'Material',  icon: Palette },
    { id: 'review',   label: 'Review Pesanan',  short: 'Review',    icon: ClipboardList },
    { id: 'photos',   label: 'Upload Foto',     short: 'Foto',      icon: Camera },
    { id: 'order',    label: 'Form Kontak',     short: 'Kontak',    icon: Send },
];

// Validation rules per step
function validateStep(stepId, config) {
    switch (stepId) {
        case 'product':
            if (!config.productSelection.productId) return 'Pilih jenis produk terlebih dahulu.';
            break;
        case 'room':
            if (!config.room.length || config.room.length < 50) return 'Masukkan panjang ruangan minimal 50 cm.';
            if (!config.room.width || config.room.width < 50) return 'Masukkan lebar ruangan minimal 50 cm.';
            if (!config.room.height || config.room.height < 200) return 'Tinggi ruangan minimal 200 cm.';
            if (config.room.shape === 'L-shape' && (!config.room.LSide || config.room.LSide < 50)) return 'Masukkan panjang sisi L minimal 50 cm.';
            if (config.room.shape === 'U-shape' && (!config.room.USideL || config.room.USideL < 50)) return 'Masukkan panjang sayap kiri minimal 50 cm.';
            if (config.room.shape === 'U-shape' && (!config.room.USideR || config.room.USideR < 50)) return 'Masukkan panjang sayap kanan minimal 50 cm.';
            break;
        case 'design':
            if (!config.design.materialId) return 'Pilih material utama terlebih dahulu.';
            break;
        default:
            break;
    }
    return null; // no error
}

export default function ConfiguratorLayout() {
    const [showWelcome, setShowWelcome] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'preview'
    const [validationError, setValidationError] = useState(null);
    const [touchStart, setTouchStart] = useState(null);

    const [config, setConfig] = useState({
        room: { length: 300, width: 300, height: 280, shape: 'Persegi panjang', LSide: 0, USideL: 0, USideR: 0 },
        fixtures: [],
        photos: [],
        productSelection: { productId: '', shape: '', name: '' },
        design: { model: 'Minimalis', materialId: '', color: '', accessories: [] }
    });

    const [metadata, setMetadata] = useState({ products: [], materials: [], accessories: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [submittedCustomer, setSubmittedCustomer] = useState(null);

    useEffect(() => {
        Promise.all([api.getProducts(), api.getMaterials(), api.getAccessories()]).then(
            ([products, materials, accessories]) => {
                setMetadata({ products, materials, accessories });
            }
        ).catch(err => {
            console.error('Failed to load metadata:', err);
        });

        const params = new URLSearchParams(window.location.search);
        const savedId = params.get('id');
        if (savedId) {
            api.getDesign(savedId).then(data => {
                if (data && data.config) {
                    setConfig(data.config);
                    setShowWelcome(false); // Jump straight to configurator
                }
            }).catch(err => console.error('Error loading saved design:', err));
        }
    }, []);

    const updateConfig = useCallback((section, data) => {
        setConfig(prev => {
            const current = prev[section];
            if (Array.isArray(current)) {
                return { ...prev, [section]: data };
            }
            return { ...prev, [section]: { ...current, ...data } };
        });
    }, []);

    const setConfigDirect = useCallback((section, data) => {
        setConfig(prev => ({ ...prev, [section]: data }));
    }, []);

    const estimatePrice = useCallback(() => {
        if (!config.productSelection.productId) return 0;
        const product = metadata.products.find(p => p.id === config.productSelection.productId);
        if (!product) return 0;

        let lengthMeters = 0;
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
        const material = metadata.materials.find(m => m.id === config.design.materialId);
        if (material) basePrice *= material.priceModifier;

        const accPrice = config.design.accessories.reduce((total, accId) => {
            const acc = metadata.accessories.find(a => a.id === accId);
            return total + (acc ? acc.price : 0);
        }, 0);

        return Math.round(basePrice + accPrice);
    }, [config, metadata]);

    const handleNext = () => {
        const error = validateStep(STEPS[currentStep].id, config);
        if (error) {
            setValidationError(error);
            trackEvent(ANALYTICS_EVENTS.FORM_VALIDATION_ERROR, { step: STEPS[currentStep].id, error });
            return;
        }
        setValidationError(null);
        trackEvent(ANALYTICS_EVENTS.STEP_COMPLETE, { step: STEPS[currentStep].id, step_index: currentStep });
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
        setMobileTab('form');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrev = () => {
        setValidationError(null);
        trackEvent(ANALYTICS_EVENTS.STEP_BACK, { step: STEPS[currentStep].id, step_index: currentStep });
        setCurrentStep(prev => Math.max(prev - 1, 0));
        setMobileTab('form');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToStep = (idx) => {
        if (idx < currentStep) { // allow going back
            setCurrentStep(idx);
            setValidationError(null);
        }
    };

    const submitOrder = async (customerData) => {
        setIsSubmitting(true);
        setOrderError(null);
        const totalPrice = estimatePrice();
        const orderData = {
            config,
            totalPrice,
            customer: customerData,
            product: metadata.products.find(p => p.id === config.productSelection.productId)
        };
        try {
            await api.submitOrder(orderData);
            setSubmittedCustomer(customerData);
            setOrderComplete(true);
            trackEvent(ANALYTICS_EVENTS.ORDER_SUBMIT_SUCCESS, { product: config.productSelection.name, price: totalPrice });
        } catch (e) {
            console.error(e);
            setOrderError('Gagal menyimpan pesanan. Coba lagi atau hubungi kami via WhatsApp.');
            trackEvent(ANALYTICS_EVENTS.ORDER_SUBMIT_ERROR, { error: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Swipe gesture support
    const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
    const handleTouchEnd = (e) => {
        if (touchStart === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 80) {
            if (diff > 0 && currentStep < STEPS.length - 1) handleNext();
            else if (diff < 0 && currentStep > 0) handlePrev();
        }
        setTouchStart(null);
    };

    // ── Welcome Screen ──
    if (showWelcome) {
        return <WelcomeScreen onStart={() => {
            setShowWelcome(false);
            trackEvent(ANALYTICS_EVENTS.CONFIGURATOR_START);
        }} />;
    }

    // ── Success Screen ──
    if (orderComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-teal-950 flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-6 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100 rounded-full opacity-50" />
                    <div className="relative">
                        <div className="mx-auto w-24 h-24 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
                            <CheckCircle size={52} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Pesanan Terkirim! 🎉</h1>
                        <p className="text-slate-500 mt-3 leading-relaxed">
                            Tim Workshop Afandi Interior akan menghubungi Anda via <strong>WhatsApp</strong> untuk jadwal survey & konfirmasi desain dalam 1×24 jam.
                        </p>
                        {estimatePrice() > 0 && (
                            <div className="mt-5 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                                <div className="text-xs text-teal-600 font-bold uppercase tracking-wider mb-1">Estimasi Total</div>
                                <div className="text-2xl font-extrabold text-teal-700">Rp {estimatePrice().toLocaleString('id-ID')}</div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                            <button
                                onClick={() => {
                                    trackEvent(ANALYTICS_EVENTS.PDF_DOWNLOAD, { type: 'final' });
                                    import('../../lib/pdfGenerator').then(m => m.generateQuotationPDF({ 
                                        config, 
                                        metadata, 
                                        estimatedPrice: estimatePrice(), 
                                        customer: submittedCustomer 
                                    }));
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 hover:border-teal-500 hover:text-teal-600 text-slate-600 rounded-xl font-bold font-sans transition-all active:scale-95 shadow-sm"
                            >
                                <div className="p-1 px-2 bg-rose-100 text-rose-600 rounded text-[10px] font-black uppercase tracking-tighter">PDF</div>
                                Unduh Penawaran
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 px-6 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-teal-500/30"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const StepComponents = [ProductSelectionForm, RoomSizeForm, DoorsWindowsForm, DesignConfigForm, OrderReviewStep, PhotoUploadForm, OrderForm];
    const StepComponent = StepComponents[currentStep];
    const isLastStep = currentStep === STEPS.length - 1;
    const price = estimatePrice();
    const currentStepId = STEPS[currentStep].id;

    // Extra props for some steps
    const stepExtraProps = currentStepId === 'review'
        ? { estimatedPrice: price }
        : currentStepId === 'order'
        ? { config, metadata, estimatedPrice: price }
        : {};

    return (
        <div
            className="min-h-screen bg-slate-100 flex flex-col font-sans"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* ── HEADER ── */}
            <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <img src="/brand/logo-icon-dark.png" alt="Icon" className="w-[48px] h-[48px] object-contain drop-shadow-sm" />
                        <div className="hidden sm:flex flex-col items-start ml-0 mt-1">
                            <span className="font-playfair text-[22px] font-bold leading-[0.85] text-[#b08d57] uppercase">Afandi</span>
                            <span className="font-cinzel text-[8.5px] mt-1.5 tracking-[0.34em] font-bold pl-0.5 text-[#4a423e]">INTERIOR</span>
                        </div>
                    </div>

                    {/* Step Indicator (Desktop only) */}
                    <div className="hidden lg:flex items-center flex-1 max-w-3xl mx-6 gap-1">
                        {STEPS.map((step, idx) => {
                            const Icon = step.icon;
                            const done = idx < currentStep;
                            const active = idx === currentStep;
                            return (
                                <React.Fragment key={step.id}>
                                    <button
                                        onClick={() => goToStep(idx)}
                                        disabled={idx > currentStep}
                                        title={step.label}
                                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                                            active ? 'bg-teal-500 text-white shadow-md shadow-teal-200' :
                                            done ? 'bg-teal-100 text-teal-700 hover:bg-teal-200 cursor-pointer' :
                                            'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {done ? <CheckCircle size={13} /> : <Icon size={13} />}
                                        <span className="hidden xl:inline">{step.short}</span>
                                    </button>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${idx < currentStep ? 'bg-teal-400' : 'bg-slate-200'}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Step Badge */}
                    <div className="shrink-0 text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        <span className="text-teal-600">{currentStep + 1}</span>
                        <span className="text-slate-400">/{STEPS.length}</span>
                        <span className="hidden sm:inline ml-1 text-slate-400 font-normal">— {STEPS[currentStep].short}</span>
                    </div>
                </div>

                {/* Mobile Simple Step Progress Bar */}
                <div className="lg:hidden h-1 bg-slate-100 relative">
                    <div
                        className="h-full bg-gradient-to-r from-teal-600 to-amber-500 transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    />
                </div>
            </header>

            {/* ── MAIN ── */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 pb-36 lg:pb-8">

                {/* ── LEFT FORM ── */}
                <div className="flex-1 max-w-2xl relative">
                    {/* Mobile Tab Toggle */}
                    <div className="lg:hidden flex bg-white rounded-2xl p-1 mb-4 shadow-sm border border-slate-100 gap-1">
                        <button
                            onClick={() => setMobileTab('form')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${mobileTab === 'form' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-500'}`}
                        >
                            <LayoutList size={15} /> Form
                        </button>
                        <button
                            onClick={() => setMobileTab('preview')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${mobileTab === 'preview' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-500'}`}
                        >
                            <Eye size={15} /> Preview 2D
                        </button>
                    </div>

                    {/* Form Panel */}
                    <div className={`lg:block ${mobileTab === 'form' ? 'block' : 'hidden'}`}>
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            {/* Step Title */}
                            <div className="p-6 pb-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {(() => {
                                        const Icon = STEPS[currentStep].icon;
                                        return <Icon size={18} className="text-teal-500" />;
                                    })()}
                                    <span className="text-xs font-bold text-teal-500 uppercase tracking-widest">
                                        Langkah {currentStep + 1} dari {STEPS.length}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
                                    {STEPS[currentStep].label}
                                </h2>
                            </div>

                            {/* Validation Error */}
                            {validationError && (
                                <div className="mx-6 mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2">
                                    <span className="text-rose-500 text-sm">⚠️</span>
                                    <span className="text-rose-700 text-sm font-medium">{validationError}</span>
                                </div>
                            )}

                            {/* Order Error */}
                            {orderError && (
                                <div className="mx-6 mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2">
                                    <span className="text-rose-500 text-sm">❌</span>
                                    <span className="text-rose-700 text-sm font-medium">{orderError}</span>
                                </div>
                            )}

                            {/* Step Content */}
                            <div className="px-6 pb-0 animate-fade-in-up" key={currentStep}>
                                    <StepComponent
                                        config={config}
                                        updateConfig={updateConfig}
                                        setConfigDirect={setConfigDirect}
                                        metadata={metadata}
                                        onSubmit={isLastStep ? submitOrder : handleNext}
                                        isSubmitting={isSubmitting}
                                        {...stepExtraProps}
                                    />
                            </div>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex p-6 pt-4 bg-slate-50/80 border-t border-slate-100 items-center justify-between mt-2">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-slate-200 active:scale-95'}`}
                                >
                                    <ChevronLeft size={18} /> Kembali
                                </button>

                                {!isLastStep ? (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Lanjutkan <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    // Last step — OrderForm handles its own submit button
                                    <div /> 
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Preview Panel */}
                    {mobileTab === 'preview' && (
                        <div className="lg:hidden">
                                <RoomPreview2D config={config} />
                            <div className="mt-4">
                                <PriceEstimator price={price} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT PREVIEW (Desktop) ── */}
                <div className="hidden lg:flex flex-col gap-6 w-[400px] xl:w-[460px] lg:sticky lg:top-24 lg:self-start">
                    <PriceEstimator price={price} />
                    <RoomPreview2D config={config} />
                </div>
            </main>

            {/* ── MOBILE BOTTOM NAV ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 pb-safe z-50 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between gap-3">
                    {/* Price */}
                    <div className="min-w-0 flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimasi</span>
                        <span className="text-lg font-extrabold text-teal-700 leading-none truncate">
                            Rp {price > 0 ? price.toLocaleString('id-ID') : '–'}
                        </span>
                    </div>

                    {/* Nav Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 active:scale-90 transition-all ${currentStep === 0 ? 'opacity-40' : 'hover:bg-slate-200'}`}
                        >
                            <ChevronLeft size={22} />
                        </button>

                        {!isLastStep ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center justify-center gap-1.5 px-6 h-12 min-w-[120px] bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-600/30 active:scale-95 transition-all"
                            >
                                Lanjut <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                form="order-form"
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-1.5 px-6 h-12 min-w-[120px] bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-600/25 active:scale-95 transition-all disabled:opacity-70"
                            >
                                {isSubmitting ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Kirim</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
