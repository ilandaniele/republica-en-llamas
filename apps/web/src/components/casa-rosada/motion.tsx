import type React from 'react';

interface MotionProps {
  dur: string;
  begin?: string;
  children: React.ReactNode;
}

function Translate({ values, dur, begin, children }: MotionProps & { values: string }) {
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values={values}
        dur={dur}
        begin={begin}
        repeatCount="indefinite"
      />
      {children}
    </g>
  );
}

export function Bob(props: MotionProps) {
  return <Translate values="0 0;0 -1;0 0" {...props} />;
}

export function Hover(props: MotionProps) {
  return <Translate values="0 0;0 -0.5;0 0" {...props} />;
}

export function Shake(props: MotionProps) {
  return <Translate values="0 0;-1 0;1 0;0 1;0 0" {...props} />;
}

export function FlyAway({ dur, children }: MotionProps) {
  return (
    <g data-flight="departure">
      {children}
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0;8 -4;65 -55"
        keyTimes="0;0.35;1"
        calcMode="spline"
        keySplines="0.42 0 1 1;0.42 0 1 1"
        dur={dur}
        fill="freeze"
      />
    </g>
  );
}

export function Drift(props: MotionProps) {
  return <Translate values="-170 0;170 0" {...props} />;
}

export function Flicker({ dur, begin, children }: MotionProps) {
  return (
    <g>
      <animate attributeName="opacity" values="1;0.55;1" dur={dur} begin={begin} repeatCount="indefinite" />
      {children}
    </g>
  );
}

export function Pulse({ dur, begin, children }: MotionProps) {
  return (
    <g>
      <animate
        attributeName="opacity"
        values="0.85;1;0.85"
        dur={dur}
        begin={begin}
        repeatCount="indefinite"
      />
      {children}
    </g>
  );
}
