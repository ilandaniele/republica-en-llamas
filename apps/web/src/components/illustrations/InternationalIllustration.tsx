import React from 'react';

export function InternationalIllustration() {
  return (
    <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="200" height="120" fill="#0d1b2a" rx="8" />

      {/* Globe outline */}
      <circle cx="100" cy="60" r="45" fill="#0a1628" stroke="#1565c0" strokeWidth="1.5" opacity="0.7" />
      {/* Latitude lines */}
      <ellipse cx="100" cy="60" rx="45" ry="15" fill="none" stroke="#1976d2" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="100" cy="60" rx="45" ry="30" fill="none" stroke="#1976d2" strokeWidth="0.8" opacity="0.3" />
      {/* Longitude lines */}
      <line x1="100" y1="15" x2="100" y2="105" stroke="#1976d2" strokeWidth="0.8" opacity="0.4" />
      <line x1="70" y1="17" x2="130" y2="103" stroke="#1976d2" strokeWidth="0.8" opacity="0.3" />
      <line x1="130" y1="17" x2="70" y2="103" stroke="#1976d2" strokeWidth="0.8" opacity="0.3" />

      {/* Continents (simplified) */}
      {/* South America */}
      <path d="M85,50 Q82,60 84,75 Q90,82 95,78 Q100,72 98,60 Q95,50 85,50 Z" fill="#2e7d32" opacity="0.7" />
      {/* North America */}
      <path d="M75,30 Q65,35 68,48 Q74,52 80,46 Q85,38 80,30 Z" fill="#1565c0" opacity="0.7" />
      {/* Europe */}
      <path d="M108,38 Q104,42 106,50 Q112,54 118,48 Q120,40 115,36 Z" fill="#c62828" opacity="0.7" />
      {/* Africa */}
      <path d="M110,55 Q108,68 112,80 Q118,82 122,74 Q125,62 122,54 Z" fill="#e65100" opacity="0.7" />

      {/* Flags */}
      {/* Flag 1 top-left */}
      <rect x="15" y="10" width="20" height="12" rx="1" fill="#1565c0" />
      <rect x="15" y="10" width="20" height="4" fill="#1565c0" />
      <rect x="15" y="14" width="20" height="4" fill="#fdd835" />
      <rect x="15" y="18" width="20" height="4" fill="#1565c0" />
      <line x1="14" y1="10" x2="14" y2="25" stroke="#795548" strokeWidth="1.5" />

      {/* Flag 2 top-right */}
      <rect x="165" y="10" width="20" height="12" rx="1" fill="#c62828" />
      <rect x="172" y="10" width="6" height="12" fill="#fafafa" />
      <line x1="164" y1="10" x2="164" y2="25" stroke="#795548" strokeWidth="1.5" />

      {/* Storm clouds with drifting animation */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;8,0;0,0" dur="6s" repeatCount="indefinite" />
        <ellipse cx="30" cy="45" rx="18" ry="12" fill="#37474f" opacity="0.8" />
        <ellipse cx="42" cy="40" rx="14" ry="10" fill="#455a64" opacity="0.7" />
        {/* Lightning */}
        <polyline points="35,52 32,60 37,58 34,68" stroke="#ffd54f" strokeWidth="2" fill="none">
          <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
        </polyline>
      </g>

      {/* Arrows */}
      <line x1="95" y1="60" x2="70" y2="45" stroke="#ffd54f" strokeWidth="1.5" markerEnd="url(#arrow)" opacity="0.7" />
      <line x1="105" y1="58" x2="130" y2="45" stroke="#ef9a9a" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}
