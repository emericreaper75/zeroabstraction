import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function MediaCollectionPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'media', limit: 50, sort: '-createdAt' })

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <span>OBSERVATORY</span><span>/</span><span>COLLECTIONS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">MEDIA &amp; PLATES ARCHIVE</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Media &amp; Plates</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Astrophotography plates, FITS stacks, and editorial media assets.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-sm text-label-sm px-2 py-0.5 bg-amber-wash text-accent-ochre font-medium">{result.totalDocs} ASSETS INDEXED</span>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-accent-amber hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
              Upload
            </button>
          </div>
        </div>
      </header>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {result.docs.map((media: any) => (
          <div key={media.id} className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden group hover:border-primary/40 transition-colors">
            <div className="aspect-square bg-surface-container-high relative overflow-hidden">
              {media.url ? (
                <img
                  src={media.url}
                  alt={media.alt || media.filename}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[48px] text-ink-muted/30">image</span>
                </div>
              )}
              <div className="absolute bottom-1 right-1.5 font-label-sm text-label-sm text-white bg-on-surface/80 px-1.5 py-0.5">
                {media.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
              </div>
            </div>
            <div className="p-3">
              <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">{media.filename || 'Untitled'}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-label-sm text-label-sm text-ink-muted">
                  {media.filesize ? `${(media.filesize / 1024).toFixed(0)} KB` : '—'}
                </span>
                <span className="font-label-sm text-label-sm text-ink-muted">
                  {media.createdAt ? new Date(media.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                </span>
              </div>
            </div>
          </div>
        ))}
        {result.docs.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <span className="material-symbols-outlined text-[64px] text-ink-muted/20 mb-4 block">perm_media</span>
            <p className="text-ink-muted font-body-md">No media assets found. Upload your first plate.</p>
          </div>
        )}
      </div>

      {/* Storage Telemetry */}
      <div className="border border-hairline-rule bg-white p-4 shadow-xs rounded flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-primary">cloud_done</span>
          <div>
            <span className="font-label-sm text-label-sm text-on-surface font-medium">{result.totalDocs} assets indexed</span>
            <span className="font-label-sm text-label-sm text-ink-muted ml-2">· S3 &amp; WAL Synced</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 bg-hairline-rule h-1.5 rounded overflow-hidden">
            <div className="bg-primary h-full w-1/3 rounded" />
          </div>
          <span className="font-label-sm text-label-sm text-ink-muted">Storage used</span>
        </div>
      </div>
    </div>
  )
}
