import React from 'react';

export type ShapeType = 'circle' | 'slash' | 'ring' | 'wedge' | 'dots';
export type ShapeColor = 'primary' | 'secondary' | 'emerald' | 'vermillion' | 'muted';

export interface CollageShapeProps {
  type: ShapeType;
  color?: ShapeColor;
  className?: string;
  size?: number; // width/height in px
  opacity?: number;
  style?: React.CSSProperties;
}

export function CollageShape({
  type,
  color = 'emerald',
  className = '',
  size = 200,
  opacity = 0.15,
  style = {},
}: CollageShapeProps) {
  const colorHex =
    color === 'primary' || color === 'emerald'
      ? 'var(--accent)'
      : color === 'secondary' || color === 'vermillion'
      ? 'var(--secondary)'
      : 'var(--text-muted)';

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    userSelect: 'none',
    opacity,
    zIndex: 0,
    ...style,
  };

  switch (type) {
    case 'circle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          style={baseStyle}
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="48" fill={colorHex} />
        </svg>
      );

    case 'ring':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          style={baseStyle}
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={colorHex}
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        </svg>
      );

    case 'slash':
      return (
        <svg
          width={size}
          height={size / 2}
          viewBox="0 0 120 40"
          className={className}
          style={baseStyle}
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="38"
            x2="120"
            y2="2"
            stroke={colorHex}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'wedge':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          style={baseStyle}
          aria-hidden="true"
        >
          <path d="M50 50 L10 10 A50 50 0 0 1 90 10 Z" fill={colorHex} />
        </svg>
      );

    case 'dots':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 60 60"
          className={className}
          style={baseStyle}
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={row * 16 + 6}
                cy={col * 16 + 6}
                r="1.75"
                fill={colorHex}
              />
            ))
          )}
        </svg>
      );

    default:
      return null;
  }
}
