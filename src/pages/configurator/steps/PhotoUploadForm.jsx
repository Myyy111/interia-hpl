import React, { useState } from 'react';
import { UploadCloud, X, AlertTriangle, Camera } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function PhotoUploadForm({ config, setConfigDirect }) {
    const { photos } = config;
    const [errors, setErrors] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const processFiles = (files) => {
        const newErrors = [];
        const validFiles = [];

        if (photos.length + files.length > MAX_FILES) {
            newErrors.push(`Maksimal ${MAX_FILES} foto saja. Sekarang ada ${photos.length} foto.`);
            setErrors(newErrors);
            return;
        }

        for (const file of files) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                newErrors.push(`${file.name}: Format tidak didukung. Gunakan JPG, PNG, atau WebP.`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                newErrors.push(`${file.name}: Ukuran file melebihi 5MB (${(file.size / 1024 / 1024).toFixed(1)}MB).`);
                continue;
            }
            validFiles.push(URL.createObjectURL(file));
        }

        setErrors(newErrors);
        if (validFiles.length > 0) {
            setConfigDirect('photos', [...photos, ...validFiles]);
        }
    };

    const handleUpload = (e) => processFiles(Array.from(e.target.files));

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        processFiles(Array.from(e.dataTransfer.files));
    };

    const removePhoto = (index) => {
        setConfigDirect('photos', photos.filter((_, i) => i !== index));
        setErrors([]);
    };

    return (
        <div className="space-y-6 pb-6">
            {/* Optional label */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Camera size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-blue-700 font-semibold">Langkah Opsional</p>
                    <p className="text-sm text-blue-600 leading-relaxed mt-0.5">
                        Upload foto ruangan Anda untuk membantu tim desainer kami memahami kondisi aktual. Bisa dilewati jika belum tersedia.
                    </p>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center relative flex flex-col items-center group transition-all duration-200 cursor-pointer
                    ${isDragOver ? 'border-teal-400 bg-teal-50 scale-[1.01]' : 'border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-slate-100'}
                    ${photos.length >= MAX_FILES ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={photos.length >= MAX_FILES}
                />
                <div className={`p-4 rounded-full mb-4 transition-transform ${isDragOver ? 'bg-teal-100 scale-110' : 'bg-white shadow-sm group-hover:scale-110'}`}>
                    <UploadCloud size={32} className={isDragOver ? 'text-teal-500' : 'text-teal-600'} />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">
                    {isDragOver ? 'Lepas untuk Upload' : 'Upload Foto Ruangan'}
                </h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
                    Drag & drop atau klik untuk memilih. Maks <strong>5 foto</strong>, ukuran maks <strong>5MB</strong> per foto. Format JPG, PNG, WebP.
                </p>
                <span className={`font-semibold py-2 px-6 rounded-lg shadow-sm transition-colors ${photos.length >= MAX_FILES ? 'bg-slate-400' : 'bg-teal-600 hover:bg-teal-700'} text-white`}>
                    {photos.length >= MAX_FILES ? `Batas ${MAX_FILES} Foto` : 'Pilih File...'}
                </span>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-1">
                    {errors.map((err, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-rose-700">
                            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-rose-500" />
                            {err}
                        </div>
                    ))}
                </div>
            )}

            {/* Photo Grid */}
            {photos.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-600">{photos.length} foto dipilih</span>
                        <button
                            type="button"
                            onClick={() => { setConfigDirect('photos', []); setErrors([]); }}
                            className="text-xs text-rose-500 hover:text-rose-700 font-semibold transition-colors"
                        >
                            Hapus semua
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {photos.map((src, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 aspect-video">
                                <img src={src} alt={`Uploaded ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(i)}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 text-xs text-white font-bold bg-black/40 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Foto {i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
