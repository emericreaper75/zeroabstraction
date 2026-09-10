import Image, { ImageProps } from 'next/image';
import React from 'react';

type ProjectImageProps = ImageProps & {
  wrapperClassName?: string;
  transitionName?: string;
};

export function ProjectImage({
  wrapperClassName = '',
  className = '',
  transitionName,
  ...props
}: ProjectImageProps) {
  return (
    <div 
      className={`overflow-hidden ${wrapperClassName}`}
      style={transitionName ? { viewTransitionName: transitionName } as React.CSSProperties : undefined}
    >
      <Image
        className={`
          object-cover
          transition-all duration-300 ease-out
          active:opacity-80
          [@media(hover:hover)]:hover:scale-[1.03]
          motion-reduce:transform-none motion-reduce:transition-none
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
