import React from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function PhotoUploadForm({ config, setConfigDirect }) {
    const { photos } = config;

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        // simulated upload to local URL
        const newPhotos = files.map(file => URL.createObjectURL(file));
        setConfigDirect('photos', [...photos, ...newPhotos]);
    };

    const removePhoto = (index) => {
        setConfigDirect('photos', photos.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-8 hover:bg-slate-100 transition-colors cursor-pointer text-center relative flex flex-col items-center group">
                <input type="file" multiple accept="image/jpeg, image/png" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud size={32} className="text-teal-600" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">Upload Foto Ruangan</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">Maksimal 5MB per foto. Format JPG atau PNG. Bisa pilih lebih dari satu.</p>
                <span className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm group-hover:bg-teal-700">Pilih File...</span>
            </div>

            {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {photos.map((src, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 aspect-square">
                            <img src={src} alt="Uploaded" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <button
                                onClick={() => removePhoto(i)}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg shadow-sm transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
