import React from 'react';

type CaricatureState = 'good' | 'regular' | 'bad' | 'crisis';

interface Props {
  state: CaricatureState;
  width?: number;
  height?: number;
}

export function MileiCaricature({ state, width = 280, height = 320 }: Props) {
  const isGood = state === 'good';
  const isBad = state === 'bad' || state === 'crisis';
  const isCrisis = state === 'crisis';

  const bgColor = isCrisis ? '#4a0000' : isBad ? '#1a0a00' : '#0d1b2a';
  const hairColor = '#1a0a00';
  const faceColor = isBad ? '#ffe0b2' : '#ffcc88';
  const suitColor = isBad ? '#4a0000' : '#0d1b2a';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Caricatura de Javier Milei"
    >
      {/* Background */}
      <rect width="280" height="320" fill={bgColor} rx="12" />

      {/* Crisis flames */}
      {isCrisis && (
        <>
          <ellipse cx="40" cy="300" rx="25" ry="40" fill="#ff6600" opacity="0.7">
            <animateTransform attributeName="transform" type="scale" values="1,1;1.1,0.9;1,1" dur="0.8s" repeatCount="indefinite" additive="sum" />
          </ellipse>
          <ellipse cx="80" cy="295" rx="20" ry="35" fill="#ff4400" opacity="0.6">
            <animateTransform attributeName="transform" type="scale" values="1,1;0.9,1.1;1,1" dur="1s" repeatCount="indefinite" additive="sum" />
          </ellipse>
          <ellipse cx="200" cy="300" rx="22" ry="38" fill="#ff6600" opacity="0.7">
            <animateTransform attributeName="transform" type="scale" values="1,1;1.05,0.95;1,1" dur="0.9s" repeatCount="indefinite" additive="sum" />
          </ellipse>
          <ellipse cx="240" cy="295" rx="18" ry="32" fill="#ff4400" opacity="0.6">
            <animateTransform attributeName="transform" type="scale" values="1,1;0.95,1.05;1,1" dur="1.1s" repeatCount="indefinite" additive="sum" />
          </ellipse>
        </>
      )}

      {/* Small lions (good state) */}
      {isGood && (
        <>
          <text x="20" y="90" fontSize="18" opacity="0.4">🦁</text>
          <text x="235" y="90" fontSize="18" opacity="0.4">🦁</text>
        </>
      )}

      {/* Body / suit */}
      <ellipse cx="140" cy="295" rx="70" ry="50" fill={suitColor} />
      {/* Shirt */}
      <rect x="122" y="240" width="36" height="42" fill="#f5f5f5" rx="3" />
      {/* Tie - loose when bad */}
      {isBad
        ? <path d="M140,245 Q148,265 143,285 Q138,275 137,265 Q139,255 140,245 Z" fill="#cc0000" opacity="0.8" />
        : <polygon points="140,244 135,270 140,276 145,270" fill="#cc0000" />
      }
      {/* Lapels */}
      <polygon points="122,242 108,265 122,255" fill={suitColor} opacity="0.9" />
      <polygon points="158,242 172,265 158,255" fill={suitColor} opacity="0.9" />
      {/* Neck */}
      <rect x="128" y="218" width="24" height="26" fill={faceColor} rx="4" />

      {/* Head - elongated for caricature effect */}
      <ellipse cx="140" cy="155" rx="52" ry="60" fill={faceColor} />

      {/* Ears */}
      <ellipse cx="88" cy="158" rx="10" ry="14" fill={faceColor} />
      <ellipse cx="192" cy="158" rx="10" ry="14" fill={faceColor} />

      {/* ICONIC WILD HAIR — Milei's signature */}
      {isGood ? (
        // Good: Wild but triumphant hair
        <>
          <path d="M88,110 Q70,70 85,45 Q95,75 88,110 Z" fill={hairColor} />
          <path d="M100,95 Q88,55 105,30 Q112,60 100,95 Z" fill={hairColor} />
          <path d="M118,88 Q112,45 130,20 Q135,55 118,88 Z" fill={hairColor} />
          <path d="M140,85 Q140,40 155,18 Q158,55 140,85 Z" fill={hairColor} />
          <path d="M162,88 Q168,45 183,28 Q178,60 162,88 Z" fill={hairColor} />
          <path d="M178,95 Q192,55 200,38 Q195,68 178,95 Z" fill={hairColor} />
          <path d="M192,110 Q210,72 215,52 Q205,78 192,110 Z" fill={hairColor} />
          <ellipse cx="140" cy="108" rx="52" ry="18" fill={hairColor} />
        </>
      ) : isBad ? (
        // Bad/Crisis: Even more chaotic hair, flying everywhere
        <>
          <path d="M88,110 Q60,60 75,25 Q92,68 88,110 Z" fill={hairColor} />
          <path d="M100,95 Q82,45 98,15 Q110,55 100,95 Z" fill={hairColor} />
          <path d="M118,88 Q105,38 122,10 Q130,48 118,88 Z" fill={hairColor} />
          <path d="M140,85 Q138,35 155,10 Q160,48 140,85 Z" fill={hairColor} />
          <path d="M162,88 Q172,38 188,22 Q182,56 162,88 Z" fill={hairColor} />
          <path d="M178,95 Q196,50 210,32 Q202,65 178,95 Z" fill={hairColor} />
          <path d="M192,110 Q215,65 222,42 Q210,75 192,110 Z" fill={hairColor} />
          <path d="M85,115 Q58,88 52,62" stroke={hairColor} strokeWidth="5" fill="none" />
          <path d="M195,115 Q222,88 228,62" stroke={hairColor} strokeWidth="5" fill="none" />
          <ellipse cx="140" cy="108" rx="52" ry="18" fill={hairColor} />
        </>
      ) : (
        // Regular: Slightly less chaotic
        <>
          <path d="M88,110 Q68,65 82,38 Q94,70 88,110 Z" fill={hairColor} />
          <path d="M100,95 Q85,50 102,22 Q110,58 100,95 Z" fill={hairColor} />
          <path d="M118,88 Q110,42 126,15 Q132,52 118,88 Z" fill={hairColor} />
          <path d="M140,85 Q140,38 155,15 Q158,52 140,85 Z" fill={hairColor} />
          <path d="M162,88 Q170,42 184,25 Q180,58 162,88 Z" fill={hairColor} />
          <path d="M178,95 Q194,52 205,35 Q198,65 178,95 Z" fill={hairColor} />
          <path d="M192,110 Q212,68 218,48 Q207,75 192,110 Z" fill={hairColor} />
          <ellipse cx="140" cy="108" rx="52" ry="18" fill={hairColor} />
        </>
      )}

      {/* Eyes — intense, wide */}
      <circle cx="118" cy="155" r="9" fill="white" />
      <circle cx="162" cy="155" r="9" fill="white" />
      <circle cx="119" cy="156" r="6" fill="#333" />
      <circle cx="163" cy="156" r="6" fill="#333" />
      <circle cx="121" cy="154" r="2" fill="white" />
      <circle cx="165" cy="154" r="2" fill="white" />
      {isBad && (
        // Panic / spinning eyes
        <>
          <circle cx="119" cy="156" r="3" fill="#cc0000" opacity="0.5" />
          <circle cx="163" cy="156" r="3" fill="#cc0000" opacity="0.5" />
        </>
      )}

      {/* Eyebrows — sharp, intense */}
      <path d="M108,143 Q118,138 128,142" stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M152,142 Q162,137 172,143" stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <path d="M140,162 Q136,175 130,180 Q138,182 140,180 Q142,182 150,180 Q144,175 140,162 Z" fill="#dda070" opacity="0.8" />

      {/* Mouth */}
      {isGood
        ? <path d="M122,195 Q140,208 158,195" stroke="#a0522d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        : isBad
          ? <path d="M122,200 Q140,192 158,200" stroke="#a0522d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          : <path d="M122,196 Q140,202 158,196" stroke="#a0522d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      }

      {/* Chainsaw (motosierra) — signature prop */}
      {isGood ? (
        // Triumphant: raised high
        <g transform="rotate(-30, 220, 220) translate(185, 155)">
          <rect x="0" y="0" width="45" height="16" rx="4" fill="#888" />
          <rect x="10" y="-5" width="30" height="8" rx="2" fill="#666" />
          <rect x="42" y="-2" width="22" height="22" rx="2" fill="#555" />
          <line x1="44" y1="0" x2="60" y2="18" stroke="#999" strokeWidth="2" />
          <line x1="44" y1="5" x2="60" y2="18" stroke="#999" strokeWidth="2" />
          <line x1="44" y1="10" x2="60" y2="18" stroke="#999" strokeWidth="2" />
        </g>
      ) : isBad ? (
        // Bad: broken chainsaw
        <g transform="rotate(15, 180, 250) translate(165, 240)">
          <rect x="0" y="0" width="40" height="14" rx="4" fill="#666" opacity="0.7" />
          <rect x="38" y="-2" width="18" height="18" rx="2" fill="#444" opacity="0.7" />
          <path d="M 38,8 L 60,2 M 38,8 L 58,14" stroke="#888" strokeWidth="1.5" opacity="0.7" />
          {/* crack */}
          <path d="M 18,0 L 22,14" stroke="#cc0000" strokeWidth="1.5" />
        </g>
      ) : (
        // Regular: held at side
        <g transform="rotate(5, 200, 240) translate(178, 240)">
          <rect x="0" y="0" width="42" height="15" rx="4" fill="#777" />
          <rect x="40" y="-2" width="20" height="20" rx="2" fill="#555" />
          <line x1="41" y1="0" x2="56" y2="17" stroke="#888" strokeWidth="1.5" />
          <line x1="41" y1="5" x2="56" y2="17" stroke="#888" strokeWidth="1.5" />
          <line x1="41" y1="10" x2="56" y2="17" stroke="#888" strokeWidth="1.5" />
        </g>
      )}

      {/* Sweat drops when bad */}
      {isBad && (
        <>
          <ellipse cx="95" cy="148" rx="4" ry="6" fill="#4fc3f7" opacity="0.7" />
          <ellipse cx="185" cy="148" rx="4" ry="6" fill="#4fc3f7" opacity="0.7" />
        </>
      )}

      {/* Name label */}
      <text x="140" y="310" textAnchor="middle" fontSize="12" fill="#ffe082" fontFamily="serif" fontWeight="bold">
        Javier Milei
      </text>
    </svg>
  );
}
