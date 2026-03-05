import React from 'react';

export function PoliticalIllustration() {
  return (
    <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="200" height="120" fill="#0d1b2a" rx="8" />

      {/* Congress building */}
      <rect x="30" y="55" width="140" height="50" fill="#1a237e" />
      <rect x="40" y="45" width="120" height="20" fill="#283593" />
      {/* Columns */}
      {[50, 65, 80, 95, 110, 125, 140].map((x) => (
        <rect key={x} x={x} y="45" width="6" height="60" fill="#3949ab" opacity="0.7" />
      ))}
      {/* Dome */}
      <ellipse cx="100" cy="45" rx="35" ry="20" fill="#1565c0" />
      <ellipse cx="100" cy="38" rx="20" ry="12" fill="#1976d2" />
      {/* Flag */}
      <rect x="97" y="15" width="2" height="20" fill="#90caf9" />
      <rect x="99" y="16" width="12" height="8" fill="#1565c0" opacity="0.8" />

      {/* Deputies fighting */}
      {/* Deputy 1 - left */}
      <circle cx="70" cy="72" r="8" fill="#ffb74d" />
      <rect x="65" y="80" width="10" height="16" fill="#e53935" />
      {/* Arm waving */}
      <line x1="75" y1="83" x2="88" y2="73" stroke="#ffb74d" strokeWidth="3" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" values="0 75 83;-20 75 83;10 75 83;0 75 83" dur="1.5s" repeatCount="indefinite" />
      </line>

      {/* Deputy 2 - right */}
      <circle cx="130" cy="72" r="8" fill="#ffb74d" />
      <rect x="125" y="80" width="10" height="16" fill="#1565c0" />
      {/* Broken mic */}
      <line x1="125" y1="83" x2="112" y2="78" stroke="#ffb74d" strokeWidth="3" strokeLinecap="round" />
      <circle cx="110" cy="77" r="4" fill="#78909c" />
      <line x1="110" y1="81" x2="113" y2="90" stroke="#78909c" strokeWidth="2">
        <animateTransform attributeName="transform" type="rotate" values="0 110 81;10 110 81;-5 110 81;0 110 81" dur="2s" repeatCount="indefinite" />
      </line>

      {/* Deputy 3 - center */}
      <circle cx="100" cy="75" r="7" fill="#ffb74d" />
      <rect x="95" y="82" width="10" height="14" fill="#4caf50" />

      {/* Conflict sparks */}
      <text x="88" y="70" fontSize="10" fill="#ffd54f">⚡</text>
      <text x="93" y="68" fontSize="8" fill="#ff7043">!</text>
    </svg>
  );
}
