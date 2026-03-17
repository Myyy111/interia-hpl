import React, { useMemo } from 'react';

import { MATERIAL_COLORS } from '../lib/constants';
const FurnitureBlocks = ({ productSelection, room, matColor }) => {
    if (!productSelection?.shape) return null;
    const w = room.width || 300;
    const l = room.length || 300;
    const depth = 65; // kitchen counter depth ~65cm

    const style = { fill: matColor.fill, stroke: matColor.stroke, strokeWidth: 2 };

    if (productSelection.shape === 'Lurus') {
        return <rect x={10} y={10} width={w - 20} height={depth} rx="4" {...style} opacity="0.9" />;
    }
    if (productSelection.shape === 'L-shape') {
        return (
            <>
                <rect x={10} y={10} width={w - 20} height={depth} rx="4" {...style} opacity="0.9" />
                <rect x={10} y={10} width={depth} height={l - 20} rx="4" {...style} opacity="0.9" />
            </>
        );
    }
    if (productSelection.shape === 'U-shape') {
        return (
            <>
                <rect x={10} y={10} width={w - 20} height={depth} rx="4" {...style} opacity="0.9" />
                <rect x={10} y={10} width={depth} height={l - 20} rx="4" {...style} opacity="0.9" />
                <rect x={w - 10 - depth} y={10} width={depth} height={l - 20} rx="4" {...style} opacity="0.9" />
            </>
        );
    }
    return <rect x={10} y={10} width={w - 20} height={depth} rx="4" {...style} opacity="0.9" />;
};

const FixtureElements = ({ fixtures, room }) => {
    const w = room.width || 300;
    const l = room.length || 300;

    return fixtures.map((f) => {
        let x, y, fw, fh;
        const isHoriz = f.position === 'Utara' || f.position === 'Selatan';
        const wallThick = 8;
        const offset = f.offset || 0;

        if (f.position === 'Utara') { x = offset; y = -wallThick / 2; fw = f.width; fh = wallThick; }
        else if (f.position === 'Selatan') { x = offset; y = l - wallThick / 2; fw = f.width; fh = wallThick; }
        else if (f.position === 'Barat') { x = -wallThick / 2; y = offset; fw = wallThick; fh = f.width; }
        else { x = w - wallThick / 2; y = offset; fw = wallThick; fh = f.width; }

        const color = f.type === 'door' ? '#f59e0b' : '#38bdf8';
        const strokeCol = f.type === 'door' ? '#d97706' : '#0284c7';

        return (
            <g key={f.id}>
                <rect x={x} y={y} width={fw} height={fh} fill={color} stroke={strokeCol} strokeWidth={1.5} rx={2} opacity={0.9} />
                <text
                    x={x + fw / 2}
                    y={isHoriz ? y - 6 : y + fh / 2}
                    fontSize={12}
                    textAnchor="middle"
                    dominantBaseline={isHoriz ? 'auto' : 'middle'}
                    fill="#64748b"
                    fontWeight="bold"
                    fontFamily="system-ui"
                >
                    {f.type === 'door' ? '🚪' : '🪟'}
                </text>
            </g>
        );
    });
};

export default function RoomPreview2D({ config }) {
    const { room, fixtures, productSelection, design } = config;

    const matColor = MATERIAL_COLORS[design?.materialId] || { fill: '#e2e8f0', stroke: '#94a3b8', label: 'Default' };

    const bounds = useMemo(() => {
        const w = room.width || 300;
        const l = room.length || 300;

        let maxWidth = w;
        let maxLength = l;

        if (room.shape === 'L-shape') {
            maxWidth = Math.max(w, room.LSide || 0);
            maxLength = l + 100;
        } else if (room.shape === 'U-shape') {
            maxWidth = (room.USideL || 150) + w + (room.USideR || 150);
            maxLength = l + 150;
        }

        const margin = 80; // extra space for labels
        return { vb: `-${margin} -${margin} ${maxWidth + margin * 2} ${maxLength + margin * 2}`, w: maxWidth, l: maxLength };
    }, [room]);

    const w = room.width || 300;
    const l = room.length || 300;
    const fontSz = Math.max(14, Math.min(22, l / 18));

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 flex flex-col" style={{ minHeight: 380 }}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    Preview 2D
                </h3>
                {design?.materialId && (
                    <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full border"
                        style={{ backgroundColor: matColor.fill, borderColor: matColor.stroke, color: matColor.stroke }}
                    >
                        {matColor.label}
                    </span>
                )}
            </div>

            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative flex items-center justify-center" style={{ minHeight: 260 }}>
                <svg viewBox={bounds.vb} className="w-full h-full max-w-full max-h-full p-2" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <pattern id="grid-p" width="20" height="20" patternUnits="userSpaceOnUse">
                            <rect width="20" height="20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                        </pattern>
                        <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                            <rect width="100" height="100" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                        </pattern>
                    </defs>
                    
                    {/* Grid background */}
                    <rect width="10000" height="10000" x="-5000" y="-5000" fill="url(#grid-p)" />
                    <rect width="10000" height="10000" x="-5000" y="-5000" fill="url(#grid-major)" />

                    {/* ── ROOM SHAPES ── */}
                    {room.shape === 'Persegi panjang' && (
                        <rect x={0} y={0} width={w} height={l} fill="#fdf8f0" stroke="#d4a362" strokeWidth={5} rx={4} />
                    )}
                    {room.shape === 'L-shape' && (
                        <path
                            d={`M0,0 H${w} V${l} H${room.LSide || 150} V${l + 100} H0 Z`}
                            fill="#fdf8f0" stroke="#d4a362" strokeWidth={5}
                        />
                    )}
                    {room.shape === 'U-shape' && (() => {
                        const sl = room.USideL || 150;
                        const sr = room.USideR || 150;
                        return (
                            <path
                                d={`M0,0 H${sl} V${l} H${sl + w} V0 H${sl + w + sr} V${l + 150} H0 Z`}
                                fill="#fdf8f0" stroke="#d4a362" strokeWidth={5}
                            />
                        );
                    })()}

                    {/* ── FURNITURE (dynamic color) ── */}
                    <FurnitureBlocks productSelection={productSelection} room={room} matColor={matColor} />

                    {/* ── FIXTURES ── */}
                    <FixtureElements fixtures={fixtures} room={room} />

                    {/* ── DIMENSION LABELS ── */}
                    {/* Width label (top) */}
                    <text x={w / 2} y={-fontSz * 1.8} fontSize={fontSz} textAnchor="middle" fill="#a4723c" fontWeight="bold" fontFamily="system-ui">
                        P: {(w / 100).toFixed(2)}m
                    </text>
                    
                    {/* ↕ length label (left side) */}
                    <text x={-fontSz * 1.5} y={l / 2} fontSize={fontSz} textAnchor="middle" fill="#a4723c" fontWeight="bold" fontFamily="system-ui" transform={`rotate(-90, ${-fontSz * 1.5}, ${l / 2})`}>
                        L: {(l / 100).toFixed(2)}m
                    </text>

                    {/* Wall labels A/B/C/D */}
                    {[
                        { label: 'A', x: w / 2, y: -fontSz * 0.6 },
                        { label: 'B', x: w / 2, y: l + fontSz * 0.8 },
                        { label: 'C', x: -fontSz * 0.6, y: l / 2 },
                        { label: 'D', x: w + fontSz * 0.6, y: l / 2 },
                    ].map(({ label, x, y }) => (
                        <text key={label} x={x} y={y} fontSize={fontSz * 0.85} textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">
                            {label}
                        </text>
                    ))}
                </svg>

                {/* Legend */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-[10px] font-semibold text-slate-600 shadow-sm border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-amber-400 rounded-sm border border-amber-600" /> Pintu</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-2 bg-sky-300 rounded-sm border border-sky-500" /> Jendela</div>
                    {productSelection?.shape && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-2 rounded-sm border" style={{ backgroundColor: matColor.fill, borderColor: matColor.stroke }} />
                            Furniture
                        </div>
                    )}
                </div>
            </div>

            {/* Dimension Cards */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Panjang</div>
                    <div className="font-bold text-slate-800 text-sm">{w} cm</div>
                </div>
                <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Lebar</div>
                    <div className="font-bold text-slate-800 text-sm">{l} cm</div>
                </div>
                <div className="bg-teal-50 p-2 rounded-lg border border-teal-100">
                    <div className="text-[10px] text-teal-600 font-bold uppercase tracking-tighter">Luas</div>
                    <div className="font-bold text-teal-700 text-sm">{((w * l) / 10000).toFixed(1)} m²</div>
                </div>
            </div>
        </div>
    );
}
