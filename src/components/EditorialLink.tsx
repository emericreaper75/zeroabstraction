import { Link } from 'next-view-transitions';
import React, { type AnchorHTMLAttributes } from 'react';

type EditorialLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'muted';
  className?: string;
};

export function EditorialLink({
  href,
  children,
  variant = 'default',
  className = '',
  ...props
}: EditorialLinkProps) {
  const isMuted = variant === 'muted';

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 uppercase tracking-wider transition-colors duration-200 min-h-[44px] py-2 ${
        isMuted
          ? 'text-[color:var(--muted)] hover:text-[color:var(--text)]'
          : 'text-[color:var(--text)] hover:text-[color:var(--accent)]'
      } ${className}`}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-label)',
      }}
      {...props}
    >
      <span>{children}</span>
      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
    </Link>
  );
}
