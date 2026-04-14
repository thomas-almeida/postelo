import React from 'react';

interface StampOverlayProps {
  width?: number;
  height?: number;
  step?: number;
  className?: string;
}

export default function StampOverlay({
  width = 300,
  height = 300,
  step = 20,
  className = ''
}: StampOverlayProps) {
  const r = step / 2;

  // Gerar o path do carimbo com perfurações
  let pathData = `M 0 0`;

  // Borda superior
  for (let p = step; p < width - step / 2; p += step) {
    pathData += `L ${p - r} 0 A ${r} ${r} 0 0 1 ${p + r} 0 `;
  }

  // Borda direita
  for (let p = step; p < height - step / 2; p += step) {
    pathData += `L ${width} ${p - r} A ${r} ${r} 0 0 1 ${width} ${p + r} `;
  }

  // Borda inferior
  for (let p = width - step; p > step / 2; p -= step) {
    pathData += `L ${p + r} ${height} A ${r} ${r} 0 0 1 ${p - r} ${height} `;
  }

  // Borda esquerda
  for (let p = height - step; p > step / 2; p -= step) {
    pathData += `L 0 ${p + r} A ${r} ${r} 0 0 1 0 ${p - r} `;
  }

  pathData += 'Z';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`border-2 border-white rounded-lg ${className}`}
    >
      <defs>
        <mask id="stamp-mask">
          <rect width="100%" height="100%" fill="white"/>
          <path
            d={pathData}
            fill="black"
          />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="rgba(255, 255, 255, 0.3)"
        mask="url(#stamp-mask)"
      />
    </svg>
  );
}