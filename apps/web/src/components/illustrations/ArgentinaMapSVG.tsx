import React from 'react';

/**
 * Approximate SVG silhouette of Argentina — purely decorative background.
 */
export function ArgentinaMapSVG() {
  return (
    <svg
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.04 }}
      viewBox="0 0 400 800"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Main Argentina silhouette (approximate) */}
      <path
        d="
          M 220 20
          L 260 25
          L 280 40
          L 290 60
          L 300 80
          L 310 100
          L 320 130
          L 330 160
          L 340 190
          L 345 220
          L 350 250
          L 355 280
          L 350 310
          L 340 340
          L 330 360
          L 320 380
          L 310 400
          L 300 420
          L 295 450
          L 285 480
          L 270 510
          L 255 540
          L 240 560
          L 220 580
          L 200 600
          L 180 620
          L 165 640
          L 155 660
          L 145 680
          L 140 700
          L 142 720
          L 148 740
          L 155 760
          L 150 780
          L 145 790
          L 140 800
          L 135 790
          L 130 775
          L 125 755
          L 120 735
          L 115 715
          L 110 695
          L 105 675
          L 100 655
          L 95 635
          L 90 610
          L 88 585
          L 92 560
          L 100 535
          L 108 510
          L 112 485
          L 108 460
          L 100 435
          L 88 410
          L 80 385
          L 75 360
          L 72 335
          L 70 310
          L 68 285
          L 65 260
          L 62 235
          L 60 210
          L 58 185
          L 56 160
          L 55 135
          L 56 110
          L 60 85
          L 68 62
          L 80 42
          L 100 28
          L 130 18
          L 160 15
          L 190 16
          Z
        "
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="1"
      />
      {/* Patagonia eastern extension */}
      <path
        d="
          M 290 540
          L 310 530
          L 330 525
          L 345 530
          L 355 545
          L 360 565
          L 355 585
          L 340 600
          L 320 610
          L 300 615
          L 280 610
          L 265 595
          L 260 575
          L 265 555
          Z
        "
        fill="#ffffff"
        opacity="0.8"
      />
      {/* Provinces border hints */}
      <line x1="200" y1="200" x2="200" y2="500" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
      <line x1="120" y1="300" x2="310" y2="300" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
      <line x1="130" y1="400" x2="300" y2="400" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
      <line x1="140" y1="500" x2="280" y2="500" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}
