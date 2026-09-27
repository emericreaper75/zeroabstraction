'use client'

import React, { useState, useTransition, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { uploadMediaAction, deleteMediaAction } from '@/app/(admin)/admin/collections/media/actions'

interface MediaItem {
  id: string | number
  url?: string
  alt_text?: string
  alt?: string
  filename?: string
  mimeType?: string
  filesize?: number
  createdAt?: string
}

interface MediaManagerProps {
  initialDocs: MediaItem[]
  totalDocs: number
}

export function MediaManager({ initialDocs, totalDocs }: MediaManagerProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [altText, setAltText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      if (!altText) {
        setAltText(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setFeedback({ type: 'error', message: 'Please select a file to upload.' })
      return
    }

    setFeedback(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('alt_text', altText || selectedFile.name)

      const res = await uploadMediaAction(formData)
      if (res.success) {
        setFeedback({ type: 'success', message: 'Asset uploaded successfully.' })
        setShowUploadModal(false)
        setSelectedFile(null)
        setAltText('')
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to upload media asset.' })
      }
    })
  }

  const handleDelete = async (id: string | number, filename?: string) => {
    if (!confirm(`Are you sure you want to delete ${filename || 'this asset'}?`)) return

    setDeletingId(id)
    const res = await deleteMediaAction(id)
    setDeletingId(null)

    if (res.success) {
      setFeedback({ type: 'success', message: 'Asset deleted successfully.' })
      router.refresh()
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete asset.' })
    }
  }

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      {/* Header */}
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <Link href="/admin" className="hover:text-primary transition-colors">OBSERVATORY</Link>
          <span>/</span><span>COLLECTIONS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">MEDIA &amp; PLATES ARCHIVE</span>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`px-4 py-3 border flex items-center justify-between text-body-sm transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {feedback.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-ink-muted hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Media &amp; Plates</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Astrophotography plates, diagrams, and editorial media assets.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-sm text-label-sm px-2 py-0.5 bg-amber-wash text-accent-ochre font-medium">
              {totalDocs} ASSETS INDEXED
            </span>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
              Upload Plate
            </button>
          </div>
        </div>
      </header>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-hairline-rule max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-hairline-rule pb-3">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">cloud_upload</span>
                Upload Asset Plate
              </h2>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-ink-muted hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Select File <span className="text-accent-ochre">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  onChange={handleFileChange}
                  className="w-full bg-surface-container-lowest border border-hairline-rule text-body-sm p-2 text-on-surface file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-label-sm file:bg-surface-container-high file:text-ink-secondary hover:file:bg-surface-container-highest cursor-pointer"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Alt Text / Description <span className="text-accent-ochre">*</span>
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Spectral emission plot of NGC 7000"
                  className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-3 py-2 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-hairline-rule">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-surface-container-low text-ink-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isPending ? 'sync' : 'upload'}
                  </span>
                  {isPending ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {initialDocs.map((media) => (
          <div
            key={media.id}
            className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden group hover:border-primary/40 transition-colors flex flex-col justify-between"
          >
            <div className="aspect-square bg-surface-container-high relative overflow-hidden">
              {media.url ? (
                <img
                  src={media.url}
                  alt={media.alt_text || media.alt || media.filename || 'Media asset'}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[48px] text-ink-muted/30">image</span>
                </div>
              )}
              <div className="absolute bottom-1 right-1.5 font-label-sm text-label-sm text-white bg-on-surface/80 px-1.5 py-0.5">
                {media.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(media.id, media.filename)}
                disabled={deletingId === media.id}
                className="absolute top-1.5 right-1.5 p-1 bg-white/90 hover:bg-rose-50 text-ink-muted hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                title="Delete asset"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
            <div className="p-3">
              <p className="font-body-sm text-body-sm text-on-surface font-medium truncate" title={media.filename || 'Untitled'}>
                {media.filename || 'Untitled'}
              </p>
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

        {initialDocs.length === 0 && (
          <div className="col-span-full py-20 text-center border border-hairline-rule bg-white shadow-xs rounded">
            <span className="material-symbols-outlined text-[64px] text-ink-muted/20 mb-4 block">perm_media</span>
            <p className="text-ink-muted font-body-md mb-3">No media assets found.</p>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
              Upload First Plate
            </button>
          </div>
        )}
      </div>

      {/* Storage Telemetry */}
      <div className="border border-hairline-rule bg-white p-4 shadow-xs rounded flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-primary">cloud_done</span>
          <div>
            <span className="font-label-sm text-label-sm text-on-surface font-medium">{totalDocs} assets indexed</span>
            <span className="font-label-sm text-label-sm text-ink-muted ml-2">· Substrate Synced</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 bg-hairline-rule h-1.5 rounded overflow-hidden">
            <div className="bg-primary h-full w-1/3 rounded" />
          </div>
          <span className="font-label-sm text-label-sm text-ink-muted">Storage Active</span>
        </div>
      </div>
    </div>
  )
}
