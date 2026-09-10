import React, { ElementType } from 'react';

type TypographyProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className' | 'style'>;

export function Display<T extends ElementType = 'h1'>({
  as,
  className = '',
  style,
  ...props
}: TypographyProps<T>) {
  const Component = as || 'h1';
  return (
    <Component
      className={className}
      style={{ fontSize: 'var(--text-hero)', fontFamily: 'var(--font-display)', ...style }}
      {...props}
    />
  );
}

export function Heading<T extends ElementType = 'h2'>({
  as,
  className = '',
  style,
  ...props
}: TypographyProps<T>) {
  const Component = as || 'h2';
  return (
    <Component
      className={className}
      style={{ fontSize: 'var(--text-heading)', fontFamily: 'var(--font-display)', ...style }}
      {...props}
    />
  );
}

export function Title<T extends ElementType = 'h3'>({
  as,
  className = '',
  style,
  ...props
}: TypographyProps<T>) {
  const Component = as || 'h3';
  return (
    <Component
      className={className}
      style={{ fontSize: 'var(--text-title)', fontFamily: 'var(--font-display)', ...style }}
      {...props}
    />
  );
}

export function Body<T extends ElementType = 'p'>({
  as,
  className = '',
  style,
  ...props
}: TypographyProps<T>) {
  const Component = as || 'p';
  return (
    <Component
      className={className}
      style={{ fontSize: 'var(--text-body)', fontFamily: 'var(--font-body)', ...style }}
      {...props}
    />
  );
}

export function Label<T extends ElementType = 'span'>({
  as,
  className = '',
  style,
  ...props
}: TypographyProps<T>) {
  const Component = as || 'span';
  return (
    <Component
      className={className}
      style={{ fontSize: 'var(--text-label)', fontFamily: 'var(--font-mono)', ...style }}
      {...props}
    />
  );
}
