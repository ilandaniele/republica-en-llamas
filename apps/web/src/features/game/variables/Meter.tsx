import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';

export type FlashDir = 'up' | 'down' | null;

interface MeterProps {
  label: string;
  value: number;
  prevValue?: number | undefined;
  max?: number | undefined;
  color: string;
  icon: string;
  inverse?: boolean | undefined;
  flashDir?: FlashDir | undefined;
}

function TrendArrow({
  current,
  prev,
  inverse = false,
}: {
  current: number;
  prev?: number | undefined;
  inverse?: boolean | undefined;
}) {
  if (prev === undefined) return null;
  const delta = current - prev;
  if (Math.abs(delta) < 1) return <span className="text-xs text-smoke-600">→</span>;
  const goingUp = delta > 0;
  // For higher-is-better vars: up = green. For lower-is-better (inverse): down = green.
  const isGood = inverse ? !goingUp : goingUp;
  const isVeryBig = Math.abs(delta) > 10;
  if (isVeryBig) {
    return (
      <span className={isGood ? 'text-sm text-green-400' : 'text-sm text-crimson-400'}>
        {goingUp ? '↑↑' : '↓↓'}
      </span>
    );
  }
  return (
    <span className={isGood ? 'text-xs text-green-400' : 'text-xs text-crimson-400'}>
      {goingUp ? '↑' : '↓'}
    </span>
  );
}

function AnimatedNumber({ value, inverse = false }: { value: number; inverse?: boolean }) {
  const [displayed, setDisplayed] = useState(value);
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      const delta = value - prev.current;
      const goingUp = delta > 0;
      // For inverse vars (inflation, deficit): going up = bad; for normal vars: going up = good
      const isGood = inverse ? !goingUp : goingUp;
      setFlash(isGood ? 'good' : 'bad');
      const timer = setTimeout(() => {
        setDisplayed(value);
        setFlash(null);
        prev.current = value;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [value, inverse]);

  return (
    <m.span
      animate={flash ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
      className={
        flash === 'good' ? 'text-green-400' : flash === 'bad' ? 'text-crimson-400' : 'text-smoke-100'
      }
    >
      {Math.round(displayed)}
    </m.span>
  );
}

export function Meter({ label, value, prevValue, max = 100, icon, inverse = false, flashDir }: MeterProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const isWarning = inverse ? pct > 70 : pct < 30;
  const isCritical = inverse ? pct > 85 : pct < 15;
  const isDanger = inverse ? pct > 75 : pct < 25;

  // Pixel bar color class
  const barFillClass = isCritical ? 'bar-critical' : isWarning ? 'bar-warning' : 'bar-good';
  const flashClass =
    flashDir === 'up' ? 'animate-bar-flash-up' : flashDir === 'down' ? 'animate-bar-flash-down' : '';

  return (
    <div className="variable-meter">
      <div className="mb-1 flex items-center justify-between">
        <span
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
          className={`flex items-center gap-1 ${isCritical ? 'text-crimson-400' : isDanger ? 'text-gold-400' : 'text-smoke-400'}`}
        >
          {icon} {label}
          {isDanger && <span className="text-crimson-400"> !</span>}
        </span>
        <span
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
          className="flex items-center gap-1 font-bold"
        >
          <TrendArrow current={value} prev={prevValue} inverse={inverse} />
          <AnimatedNumber value={Math.round(value)} inverse={inverse} />
        </span>
      </div>
      <div className={`pixel-bar-container ${flashClass}`}>
        <div className={`pixel-bar-fill ${barFillClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
