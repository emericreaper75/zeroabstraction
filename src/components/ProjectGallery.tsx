'use client';

import React, { useRef, useState } from 'react';
import { ProjectImage } from './ProjectImage';

interface GalleryItem {
  url: string;
  alt: string;
}

export function ProjectGallery({ items }: { items: GalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<GalleryItem | null>(null);

  const openLightbox = (item: GalleryItem) => {
    setActive(item);
    dialogRef.current?.showModal();
  };

  const closeLightbox = () => {
    dialogRef.current?.close();
    setActive(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--space-5)' }}>
        {items.map((item, i) => (
          <figure
            key={i}
            className="group relative overflow-hidden rounded-[var(--radius-s)] border border-[color:var(--border)] shadow-sm hover:border-[color:var(--accent-border)] transition-colors"
          >
            <button
              type="button"
              onClick={() => openLightbox(item)}
              aria-label={`Inspect ${item.alt}`}
              className="w-full block text-left cursor-zoom-in"
            >
              <ProjectImage
                src={item.url}
                alt={item.alt}
                width={800}
                height={600}
                className="w-full h-auto aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-[var(--radius-s)] bg-black/70 text-white font-mono text-[10px] tracking-wider uppercase opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                INSPECT
              </span>
            </button>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active?.alt || 'Image preview'}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox();
        }}
        className="backdrop:bg-black/80 backdrop:backdrop-blur-sm bg-transparent p-4 max-w-5xl w-full m-auto rounded-[var(--radius-s)]"
      >
        {active && (
          <div className="relative flex flex-col gap-3 bg-[color:var(--bg)] border border-[color:var(--border)] p-3 sm:p-4 rounded-[var(--radius-s)] shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs text-[color:var(--text-muted)] truncate">{active.alt}</span>
              <button
                type="button"
                onClick={closeLightbox}
                className="px-2.5 py-1 border border-[color:var(--border)] rounded-[var(--radius-s)] font-mono text-xs text-[color:var(--text)] hover:border-[color:var(--accent)]"
              >
                ESC / CLOSE
              </button>
            </div>
            <div className="overflow-hidden rounded-[var(--radius-s)] bg-black">
              <ProjectImage
                src={active.url}
                alt={active.alt}
                width={1400}
                height={900}
                className="w-full h-auto max-h-[78vh] object-contain"
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
