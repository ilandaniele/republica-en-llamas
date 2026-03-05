import React from 'react';

export function EconomicIllustration() {
  return (
    <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="200" height="120" fill="#0d1b2a" rx="8" />

      {/* Bank building */}
      <rect x="10" y="40" width="90" height="65" fill="#1a237e" />
      <rect x="10" y="30" width="90" height="20" fill="#283593" />
      {/* Columns */}
      {[18, 32, 46, 60, 74, 88].map((x) => (
        <rect key={x} x={x} y="30" width="5" height="75" fill="#3949ab" opacity="0.6" />
      ))}
      {/* Bank sign */}
      <rect x="25" y="48" width="60" height="14" fill="#0d47a1" />
      <text x="55" y="59" fontSize="8" fill="#90caf9" textAnchor="middle">BANCO</text>
      {/* Closed window */}
      <rect x="35" y="68" width="40" height="25" fill="#37474f" />
      <line x1="35" y1="68" x2="75" y2="93" stroke="#b71c1c" strokeWidth="3" />
      <line x1="75" y1="68" x2="35" y2="93" stroke="#b71c1c" strokeWidth="3" />
      <text x="55" y="108" fontSize="7" fill="#ef9a9a" textAnchor="middle">CERRADO</text>

      {/* People queueing */}
      {[115, 128, 141, 154].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={75} r={6} fill="#ffb74d" />
          <rect x={x - 5} y={81} width={10} height={14} fill={['#e53935','#1565c0','#4caf50','#ff8f00'][i]} />
        </g>
      ))}
      {/* Queue line */}
      <line x1="108" y1="88" x2="165" y2="88" stroke="#455a64" strokeWidth="1" strokeDasharray="4,3" />

      {/* Dollar arrow going up */}
      <text x="165" y="50" fontSize="18" fill="#f57f17">$</text>
      <polyline
        points="175,90 175,45 185,55"
        stroke="#ef9a9a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="2s" repeatCount="indefinite" />
      </polyline>
      <polyline
        points="175,45 165,55"
        stroke="#ef9a9a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      >
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="2s" repeatCount="indefinite" />
      </polyline>
    </svg>
  );
}
