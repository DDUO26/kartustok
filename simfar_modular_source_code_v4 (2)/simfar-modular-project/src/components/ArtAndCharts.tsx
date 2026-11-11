import React, { useState } from 'react';

// 2. PIXEL-PERFECT KOREAN ANIME / WEBTOON SVG & AI ART COMPONENTS
// ==========================================

export const SakuraBranchCornerTop = ({ className = "" }) => (
  <svg viewBox="0 0 320 200" fill="none" className={className}>
    <defs>
      <radialGradient id="sakuraGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFB7E0" stopOpacity="0.95" />
        <stop offset="70%" stopColor="#FF85C8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FF85C8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="flowerPink" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF0F7" />
        <stop offset="60%" stopColor="#FFB8DE" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
    </defs>
    {/* Soft ambient pink glow */}
    <circle cx="90" cy="60" r="85" fill="url(#sakuraGlow)" />
    <circle cx="210" cy="40" r="65" fill="url(#sakuraGlow)" />
    {/* Organic tree branches */}
    <path
      d="M-10 35 Q65 48 135 28 T265 45 M55 38 Q95 75 150 92 M125 32 Q165 55 215 62"
      stroke="#582C6B"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    {/* Sakura Blossoms Cluster */}
    {[
      { cx: 38, cy: 36, r: 22 },
      { cx: 78, cy: 26, r: 26 },
      { cx: 118, cy: 42, r: 24 },
      { cx: 158, cy: 24, r: 25 },
      { cx: 196, cy: 46, r: 22 },
      { cx: 238, cy: 30, r: 20 },
      { cx: 92, cy: 68, r: 19 },
      { cx: 142, cy: 82, r: 18 },
      { cx: 210, cy: 68, r: 16 },
      { cx: 52, cy: 76, r: 15 },
    ].map((f, i) => (
      <g key={i} transform={`translate(${f.cx}, ${f.cy})`}>
        <circle r={f.r} fill="url(#flowerPink)" />
        <circle r={f.r * 0.62} fill="#FFD6EC" />
        <circle r={f.r * 0.22} fill="#E11D48" fillOpacity="0.65" />
      </g>
    ))}
    {/* Floating petals */}
    <ellipse cx="275" cy="68" rx="7" ry="4" transform="rotate(25 275 68)" fill="#F9A8D4" />
    <ellipse cx="180" cy="110" rx="6" ry="3.5" transform="rotate(-20 180 110)" fill="#FBCFE8" />
    <ellipse cx="245" cy="95" rx="5" ry="3" transform="rotate(40 245 95)" fill="#F472B6" />
  </svg>
);

export const GlowingPillLogo = () => (
  <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
    <div className="absolute inset-0 rounded-full bg-pink-400/35 blur-md" />
    <svg viewBox="0 0 54 54" className="w-12 h-12 drop-shadow-[0_0_10px_rgba(244,114,182,0.85)]">
      <g transform="rotate(-38 27 27)">
        <rect x="16" y="6" width="22" height="42" rx="11" fill="#FFF7FB" stroke="#4A2574" strokeWidth="3" />
        <path d="M16 27H38V37C38 43.0751 33.0751 48 27 48C20.9249 48 16 43.0751 16 37V27Z" fill="url(#pillSideGrad)" />
        <line x1="16" y1="27" x2="38" y2="27" stroke="#4A2574" strokeWidth="3" />
        <path d="M21 13V21" stroke="#F9A8D4" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M21 33V39" stroke="#FFF" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <defs>
        <linearGradient id="pillSideGrad" x1="16" y1="27" x2="38" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E879F9" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const PuskesmasClinicIllustration = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12 shrink-0">
    <rect x="6" y="24" width="52" height="34" rx="6" fill="#F3E8FF" stroke="#C084FC" strokeWidth="2" />
    <path d="M4 26L32 10L60 26H4Z" fill="#F472B6" stroke="#9333EA" strokeWidth="2" strokeLinejoin="round" />
    <rect x="25" y="40" width="14" height="18" rx="3" fill="#C084FC" />
    <rect x="12" y="31" width="9" height="9" rx="2" fill="#BAE6FD" stroke="#7DD3FC" strokeWidth="1.5" />
    <rect x="43" y="31" width="9" height="9" rx="2" fill="#BAE6FD" stroke="#7DD3FC" strokeWidth="1.5" />
    <circle cx="32" cy="21" r="6" fill="#FFFFFF" />
    <path d="M32 18V24M29 21H35" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Native Interactive Spline Area Chart matching the reference image 100%

// ==========================================

export // Dynamic Interactive Spline Area Chart with Auto-Scaling Y-Axis
const StockMovementSplineChart = ({ data }: { data: { day: string; masuk: number; keluar: number }[] }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 660;
  const height = 225;
  const padLeft = 52;
  const padRight = 22;
  const padTop = 16;
  const padBottom = 32;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const rawMax = Math.max(
    100,
    ...data.map((d) => Math.max(Number(d.masuk || 0), Number(d.keluar || 0)))
  );
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const normalized = rawMax / magnitude;
  const niceFactor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const maxVal = Math.max(100, niceFactor * magnitude);

  const getX = (index: number) =>
    padLeft + (index / Math.max(1, data.length - 1)) * plotW;
  const getY = (val: number) =>
    padTop + plotH - (Math.min(maxVal, Math.max(0, val)) / maxVal) * plotH;

  const buildSmoothPath = (points: { x: number; y: number }[]) => {
    if (!points.length) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const safeData = data.length > 0 ? data : [{ day: 'Hari Ini', masuk: 0, keluar: 0 }];
  const masukPts = safeData.map((d, i) => ({ x: getX(i), y: getY(d.masuk), val: d.masuk, day: d.day }));
  const keluarPts = safeData.map((d, i) => ({ x: getX(i), y: getY(d.keluar), val: d.keluar, day: d.day }));

  const masukLine = buildSmoothPath(masukPts);
  const keluarLine = buildSmoothPath(keluarPts);

  const baselineY = padTop + plotH;
  const masukArea = `${masukLine} L ${masukPts[masukPts.length - 1].x} ${baselineY} L ${masukPts[0].x} ${baselineY} Z`;
  const keluarArea = `${keluarLine} L ${keluarPts[keluarPts.length - 1].x} ${baselineY} L ${keluarPts[0].x} ${baselineY} Z`;

  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1].map((f) => Math.round(f * maxVal));

  return (
    <div className="relative w-full h-56 select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="gradMasukSvg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="gradKeluarSvg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {yTicks.map((t) => {
          const y = getY(t);
          return (
            <g key={t}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#F1E9FF"
                strokeWidth="1.5"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="#3B245B"
                fontSize="11"
                fontWeight="700"
              >
                {t.toLocaleString('id-ID')}
              </text>
            </g>
          );
        })}

        {safeData.map((d, i) => {
          const x = getX(i);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={padTop}
                x2={x}
                y2={baselineY}
                stroke="#F5F0FF"
                strokeWidth="1"
              />
              <text
                x={x}
                y={height - 6}
                textAnchor="middle"
                fill="#3B245B"
                fontSize="11"
                fontWeight="800"
              >
                {d.day}
              </text>
            </g>
          );
        })}

        <path d={masukArea} fill="url(#gradMasukSvg)" />
        <path d={keluarArea} fill="url(#gradKeluarSvg)" />

        <path d={masukLine} fill="none" stroke="#5B21B6" strokeWidth="3.2" strokeLinecap="round" />
        <path d={keluarLine} fill="none" stroke="#EC4899" strokeWidth="3.2" strokeLinecap="round" />

        {safeData.map((d, i) => {
          const mx = masukPts[i].x;
          const my = masukPts[i].y;
          const kx = keluarPts[i].x;
          const ky = keluarPts[i].y;
          const isHovered = hoverIdx === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className="cursor-pointer"
            >
              {isHovered && (
                <line
                  x1={mx}
                  y1={padTop}
                  x2={mx}
                  y2={baselineY}
                  stroke="#C084FC"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
              )}
              <circle
                cx={mx}
                cy={my}
                r={isHovered ? 6.5 : 4.8}
                fill="#DDD6FE"
                stroke="#5B21B6"
                strokeWidth="2.6"
              />
              <circle
                cx={kx}
                cy={ky}
                r={isHovered ? 6.5 : 4.8}
                fill="#FBCFE8"
                stroke="#EC4899"
                strokeWidth="2.6"
              />
              <rect x={mx - 18} y={padTop} width="36" height={plotH} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {hoverIdx !== null && safeData[hoverIdx] && (
        <div
          className="absolute top-2 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-purple-200 shadow-lg text-xs pointer-events-none"
        >
          <p className="font-extrabold text-[#23153C] mb-1">
            Periode: {safeData[hoverIdx].day.trim()}
          </p>
          <p className="font-bold text-[#5B21B6]">
            ● Obat Masuk: +{safeData[hoverIdx].masuk.toLocaleString('id-ID')}
          </p>
          <p className="font-bold text-[#EC4899]">
            ● Obat Keluar: -{safeData[hoverIdx].keluar.toLocaleString('id-ID')}
          </p>
        </div>
      )}
    </div>
  );
};


// ==========================================
