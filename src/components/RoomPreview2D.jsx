import React, { useMemo } from 'react';

export default function RoomPreview2D({ config }) {
    const { room, fixtures, productSelection } = config;

    // Calculate SVG ViewBox dynamically to fit room and keep it proportional
    const bounds = useMemo(() => {
        const w = (room.width || 300);
        const l = (room.length || 300);
        
        let maxWidth = w;
        let maxLength = l;

        if (room.shape === 'L-shape') {
            maxWidth = Math.max(w, room.LSide || 0);
            maxLength = l * 1.5;
        } else if (room.shape === 'U-shape') {
            maxWidth = (room.USideL || 150) + w + (room.USideR || 150);
            maxLength = l + 150;
        }

        const margin = 60;
        return `-${margin} -${margin} ${maxWidth + margin * 2} ${maxLength + margin * 2}`;
    }, [room]);

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col h-[400px]">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> Preview 2D
            </h3>

            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative flex items-center justify-center">
                {/* Simple top-down abstracted SVG preview based on parameters */}
                <svg viewBox={bounds} className="w-full h-full max-w-full max-h-full p-4" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <rect width="20" height="20" fill="none" className="stroke-slate-200" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="10000" height="10000" x="-5000" y="-5000" fill="url(#grid)" />

                    {/* Draw Room Basic Shape (Abstracted) */}
                    {room.shape === 'Persegi panjang' && (
                        <rect x="0" y="0" width={room.width || 300} height={room.length || 300} className="fill-teal-50 stroke-teal-300" strokeWidth="4" />
                    )}

                    {room.shape === 'L-shape' && (
                        <path
                            d={`M0,0 H${room.width || 300} V${room.length || 300} H${room.LSide || 150} V${(room.length || 300) * 1.5} H0 Z`}
                            className="fill-teal-50 stroke-teal-300" strokeWidth="4"
                        />
                    )}

                    {room.shape === 'U-shape' && (
                        <path
                            d={`M 0,0 H ${room.USideL || 150} V ${room.length || 300} H ${(room.USideL || 150) + (room.width || 300)} V 0 H ${(room.USideL || 150) + (room.width || 300) + (room.USideR || 150)} V ${(room.length || 300) + 150} H 0 Z`}
                            className="fill-teal-50 stroke-teal-300" strokeWidth="4"
                        />
                    )}

                    {/* Draw Furniture placement roughly */}
                    {productSelection?.shape && (
                        <rect x="10" y="10" width={(room.width || 300) - 20} height="60" className="fill-indigo-100 stroke-indigo-400 opacity-80 stroke-2 stroke-dashed" />
                    )}

                    {/* Draw Fixtures roughly (Doors and windows) */}
                    {fixtures.map((f, i) => {
                        // Simplify position
                        let x = 0, y = 0, w = f.width, h = 10;
                        if (f.position === 'Utara') { x = f.offset || 0; y = -5; }
                        if (f.position === 'Selatan') { x = f.offset || 0; y = (room.length || 300) - 5; }
                        if (f.position === 'Timur') { x = (room.width || 300) - 5; y = f.offset || 0; w = 10; h = f.width; }
                        if (f.position === 'Barat') { x = -5; y = f.offset || 0; w = 10; h = f.width; }

                        return (
                            <rect key={f.id} x={x} y={y} width={w} height={h} className={f.type === 'door' ? 'fill-amber-400 stroke-amber-600' : 'fill-sky-300 stroke-sky-500'} strokeWidth="1" />
                        )
                    })}
                </svg>

                {/* Legend Overlay */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-[10px] font-medium text-slate-600 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-1.5 mb-1"><div className="w-3 h-1 bg-amber-400 border border-amber-600"></div> Pintu</div>
                    <div className="flex items-center gap-1.5 mb-1"><div className="w-3 h-1 bg-sky-300 border border-sky-500"></div> Jendela</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-2 border border-indigo-400 bg-indigo-100/50 border-dashed"></div> Area Furniture</div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Panjang</div>
                    <div className="font-bold text-slate-700 text-xs sm:text-sm">{room.length || 0} cm</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Lebar</div>
                    <div className="font-bold text-slate-700 text-xs sm:text-sm">{room.width || 0} cm</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Volume</div>
                    <div className="font-bold text-teal-600 text-xs sm:text-sm">{((room.length || 0) * (room.width || 0) * (room.height || 0) / 1000000).toFixed(2)} m³</div>
                </div>
            </div>
        </div>
    );
}
