import React from 'react';

export function SocialIllustration() {
  return (
    <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="200" height="120" fill="#0d1b2a" rx="8" />

      {/* Street / ground */}
      <rect x="0" y="95" width="200" height="25" fill="#1c2833" />
      {/* Buildings bg */}
      <rect x="0" y="15" width="40" height="80" fill="#1a237e" opacity="0.4" />
      <rect x="155" y="25" width="45" height="70" fill="#1a237e" opacity="0.4" />

      {/* Smoke clouds */}
      <ellipse cx="80" cy="30" rx="20" ry="14" fill="#455a64" opacity="0.6">
        <animateTransform attributeName="transform" type="translate" values="0,0;5,-5;0,0" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="110" cy="22" rx="16" ry="10" fill="#546e7a" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0,0;-4,-4;0,0" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Protesters */}
      {/* Person 1 */}
      <circle cx="55" cy="74" r="7" fill="#ffb74d" />
      <rect x="50" y="81" width="10" height="14" fill="#e53935" />
      {/* Sign - rotating */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-8 55 81;8 55 81;-8 55 81" dur="2s" repeatCount="indefinite" />
        <rect x="47" y="52" width="22" height="13" fill="#fdd835" rx="1" />
        <text x="58" y="62" fontSize="6" fill="#1a237e" textAnchor="middle">FUERA!</text>
        <line x1="58" y1="65" x2="58" y2="81" stroke="#795548" strokeWidth="2" />
      </g>

      {/* Person 2 */}
      <circle cx="90" cy="72" r="7" fill="#ffccbc" />
      <rect x="85" y="79" width="10" height="14" fill="#1565c0" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="5 90 79;-10 90 79;5 90 79" dur="1.8s" repeatCount="indefinite" />
        <rect x="84" y="50" width="20" height="12" fill="#ef9a9a" rx="1" />
        <text x="94" y="59" fontSize="5" fill="#b71c1c" textAnchor="middle">BASTA!</text>
        <line x1="94" y1="62" x2="94" y2="79" stroke="#795548" strokeWidth="2" />
      </g>

      {/* Person 3 */}
      <circle cx="130" cy="73" r="7" fill="#ffb74d" />
      <rect x="125" y="80" width="10" height="14" fill="#4caf50" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 130 80;12 130 80;0 130 80" dur="2.2s" repeatCount="indefinite" />
        <rect x="122" y="53" width="24" height="12" fill="#80cbc4" rx="1" />
        <text x="134" y="62" fontSize="5" fill="#004d40" textAnchor="middle">JUSTICIA</text>
        <line x1="134" y1="65" x2="134" y2="80" stroke="#795548" strokeWidth="2" />
      </g>

      {/* Person 4 */}
      <circle cx="160" cy="74" r="6" fill="#ffccbc" />
      <rect x="155" y="80" width="10" height="14" fill="#ff8f00" />

      {/* Fire */}
      <ellipse cx="170" cy="88" rx="8" ry="5" fill="#ff8f00" opacity="0.9">
        <animate attributeName="ry" values="5;7;5" dur="1s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="170" cy="84" rx="5" ry="4" fill="#ffd54f">
        <animate attributeName="ry" values="4;6;4" dur="0.8s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  );
}
