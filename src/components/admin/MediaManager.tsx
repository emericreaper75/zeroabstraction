'use client'

import React, { useMemo, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  uploadMediaAction,
  renameMediaAction,
  deleteMediaAction,
} from '@/app/(admin)/admin/collections/media/actions'
import { AdminDialog } from './AdminDialog'
import { useAdminToast } from './AdminToastProvider'

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
  const toast = useAdminToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [customFilename, setCustomFilename] = useState('')
  const [altText, setAltText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [inspectItem, setInspectItem] = useState<MediaItem | null>(null)
  const [renameTarget, setRenameTarget] = useState<MediaItem | null>(null)
  const [renameFilename, setRenameFilename] = useState('')
  const [renameAlt, setRenameAlt] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<{ id: string | number; filename?: string } | null>(null)

  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return initialDocs
    return initialDocs.filter(
      (m) =>
        (m.filename || '').toLowerCase().includes(q) ||
        (m.alt_text || m.alt || '').toLowerCase().includes(q) ||
        (m.mimeType || '').toLowerCase().includes(q)
    )
  }, [initialDocs, search])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setCustomFilename(file.name)
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
      formData.append('custom_filename', customFilename.trim() || selectedFile.name)
      formData.append('alt_text', altText || customFilename.trim() || selectedFile.name)

      const res = await uploadMediaAction(formData)
      if (res.success) {
        toast.success('Plate uploaded successfully.')
        setFeedback({ type: 'success', message: 'Asset uploaded successfully.' })
        setShowUploadModal(false)
        setSelectedFile(null)
        setCustomFilename('')
        setAltText('')
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to upload media asset.' })
      }
    })
  }

  const openRenameDialog = (media: MediaItem) => {
    setRenameTarget(media)
    setRenameFilename(media.filename || '')
    setRenameAlt(media.alt_text || media.alt || '')
  }

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!renameTarget || !renameFilename.trim()) return

    startTransition(async () => {
      const res = await renameMediaAction(
        renameTarget.id,
        renameFilename.trim(),
        renameAlt.trim()
      )
      if (res.success) {
        toast.success(`Renamed to ${res.doc?.filename || renameFilename}`)
        setRenameTarget(null)
        if (inspectItem?.id === renameTarget.id && res.doc) {
          setInspectItem(res.doc as any)
        }
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to rename file.')
      }
    })
  }

  const executeDelete = async () => {
    if (!confirmDelete) return
    const { id } = confirmDelete
    setConfirmDelete(null)

    setDeletingId(id)
    const res = await deleteMediaAction(id)
    setDeletingId(null)

    if (res.success) {
      toast.success('Asset deleted.')
      setFeedback({ type: 'success', message: 'Asset deleted successfully.' })
      if (inspectItem?.id === id) setInspectItem(null)
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to delete asset.')
      setFeedback({ type: 'error', message: res.error || 'Failed to delete asset.' })
    }
  }

  const copyUrl = async (url?: string) => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Media URL copied to clipboard.')
    } catch {
      toast.error('Clipboard unavailable.')
    }
  }

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      {/* Header */}
      <header className="flex flex-col space-y-3 pt-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-label-sm text-xs text-ink-muted">
            <Link href="/admin" className="hover:text-primary transition-colors flex items-center" title="Dashboard">
              <span className="material-symbols-outlined text-[16px]">home</span>
            </Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Media</span>
          </div>
          <span className="font-label-sm text-[11px] px-2 py-0.5 bg-amber-wash text-primary font-medium rounded">
            {totalDocs} plates
          </span>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`px-4 py-3 border rounded flex items-center justify-between text-body-sm transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
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
              aria-label="Dismiss banner"
              className="text-ink-muted hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="font-studio-display text-[28px] font-semibold text-on-surface tracking-[-0.02em] leading-none">
            Media &amp; Plates
          </h1>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] transition-opacity hover:opacity-90 rounded-full font-medium self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[17px]">cloud_upload</span>
            Upload Plate
          </button>
        </div>
      </header>

      {/* Search & View Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper-surface p-4 rounded-[20px]">
        <div className="relative flex-1 min-w-[200px] max-w-md flex items-center bg-[#F8FAFC] dark:bg-zinc-900 rounded-full px-3.5 py-2">
          <span className="material-symbols-outlined text-ink-muted text-[18px] mr-2">search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter plates by filename, alt text, or MIME..."
            aria-label="Filter media plates"
            className="w-full bg-transparent text-[13px] text-on-surface placeholder:text-ink-muted focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-zinc-900 p-1 rounded-full">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1 transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-ink-muted hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">grid_view</span>
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1 transition-colors ${
              viewMode === 'list'
                ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-ink-muted hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">view_list</span>
            List
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      <AdminDialog
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        labelledBy="upload-plate-title"
        className="w-[min(520px,94vw)]"
      >
        <div className="p-6 bg-paper-surface space-y-5">
          <div className="flex items-center justify-between border-b border-hairline-rule pb-3">
            <h1 id="upload-plate-title" className="font-headline-sm text-headline-sm text-on-surface font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">cloud_upload</span>
              Upload Asset Plate
            </h1>
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              aria-label="Close upload dialog"
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
                className="w-full bg-surface-container-lowest border border-hairline-rule rounded text-body-sm p-2 text-on-surface file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-label-sm file:bg-surface-container-high file:text-ink-secondary cursor-pointer"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                File Name
              </label>
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder="e.g. ngc-7000-emission.png"
                className="w-full bg-surface-container-lowest border border-hairline-rule rounded text-on-surface font-body-md text-body-md px-3 py-2 focus:border-primary focus:outline-none"
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
                className="w-full bg-surface-container-lowest border border-hairline-rule rounded text-on-surface font-body-md text-body-md px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-hairline-rule">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded bg-surface-container-low text-ink-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-1.5 px-5 py-2 rounded bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isPending ? 'sync' : 'upload'}
                </span>
                {isPending ? 'Uploading...' : 'Confirm Upload'}
              </button>
            </div>
          </form>
        </div>
      </AdminDialog>

      {/* Grid or List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocs.map((media) => (
            <div
              key={media.id}
              className="border border-hairline-rule bg-paper-surface shadow-xs rounded overflow-hidden group hover:border-primary/40 transition-colors flex flex-col justify-between"
            >
              <div className="aspect-square bg-surface-container-high relative overflow-hidden">
                <button
                  type="button"
                  onClick={() => setInspectItem(media)}
                  className="w-full h-full block text-left"
                  aria-label={`Inspect ${media.filename || 'media plate'}`}
                >
                  {media.url ? (
                    <img
                      src={media.url}
                      alt={media.alt_text || media.alt || media.filename || 'Media asset'}
                      className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[48px] text-ink-muted/30">image</span>
                    </div>
                  )}
                </button>
                <div className="absolute bottom-1.5 right-1.5 font-label-sm text-[10px] text-white bg-black/75 px-1.5 py-0.5 rounded">
                  {media.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
                </div>
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => openRenameDialog(media)}
                    className="p-1 bg-paper-surface/90 hover:text-primary text-ink-secondary rounded shadow-xs"
                    title="Rename file"
                    aria-label={`Rename ${media.filename}`}
                  >
                    <span className="material-symbols-outlined text-[15px]">drive_file_rename_outline</span>
                  </button>
                  {media.url && (
                    <button
                      type="button"
                      onClick={() => copyUrl(media.url)}
                      className="p-1 bg-paper-surface/90 hover:text-primary text-ink-secondary rounded shadow-xs"
                      title="Copy URL"
                      aria-label={`Copy URL for ${media.filename}`}
                    >
                      <span className="material-symbols-outlined text-[15px]">content_copy</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setConfirmDelete({ id: media.id, filename: media.filename })}
                    disabled={deletingId === media.id}
                    className="p-1 bg-paper-surface/90 hover:text-rose-500 text-ink-secondary rounded shadow-xs"
                    title="Delete asset"
                    aria-label={`Delete ${media.filename}`}
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                  </button>
                </div>
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
                    {media.createdAt
                      ? new Date(media.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-hairline-rule bg-paper-surface rounded overflow-hidden">
          <div className="admin-table-region">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-hairline-rule font-label-sm text-xs text-ink-muted uppercase">
                  <th className="px-4 py-2.5">Asset</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Size</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-subtle text-xs">
                {filteredDocs.map((media) => (
                  <tr key={media.id} className="hover:bg-surface-container-low">
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => setInspectItem(media)}
                        className="font-medium text-on-surface hover:text-primary text-left"
                      >
                        {media.filename || 'Untitled'}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 font-label-sm text-ink-muted">{media.mimeType || '—'}</td>
                    <td className="px-4 py-2.5 font-label-sm text-ink-muted">
                      {media.filesize ? `${(media.filesize / 1024).toFixed(0)} KB` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openRenameDialog(media)}
                        className="text-ink-muted hover:text-primary"
                      >
                        Rename
                      </button>
                      {media.url && (
                        <button
                          type="button"
                          onClick={() => copyUrl(media.url)}
                          className="text-ink-muted hover:text-primary"
                        >
                          Copy URL
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setConfirmDelete({ id: media.id, filename: media.filename })}
                        className="text-ink-muted hover:text-rose-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDocs.length === 0 && (
        <div className="py-16 text-center border border-hairline-rule bg-paper-surface shadow-xs rounded">
          <span className="material-symbols-outlined text-[56px] text-ink-muted/25 mb-3 block">perm_media</span>
          <p className="text-ink-muted font-body-md mb-3">No matching media plates found.</p>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
            Upload Plate
          </button>
        </div>
      )}

      {/* Lightbox Plate Inspector */}
      <AdminDialog
        open={Boolean(inspectItem)}
        onClose={() => setInspectItem(null)}
        labelledBy="inspect-plate-title"
        className="w-[min(680px,94vw)]"
      >
        {inspectItem && (
          <div className="p-5 bg-paper-surface space-y-4">
            <div className="flex items-center justify-between border-b border-hairline-rule pb-3">
              <h1 id="inspect-plate-title" className="font-headline-sm text-base text-on-surface truncate pr-4">
                {inspectItem.filename || 'Media Plate'}
              </h1>
              <button
                type="button"
                autoFocus
                onClick={() => setInspectItem(null)}
                aria-label="Close plate inspector"
                className="p-1 text-ink-muted hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            {inspectItem.url && inspectItem.mimeType?.startsWith('image/') && (
              <div className="bg-surface-container-low border border-hairline-rule rounded overflow-hidden max-h-[55vh] flex items-center justify-center">
                <img
                  src={inspectItem.url}
                  alt={inspectItem.alt_text || inspectItem.alt || inspectItem.filename || ''}
                  className="max-h-[55vh] w-auto object-contain"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-xs font-label-sm bg-surface-container-low p-3 rounded border border-hairline-rule">
              <div>
                <span className="text-ink-muted block">ALT TEXT</span>
                <span className="text-on-surface">{inspectItem.alt_text || inspectItem.alt || '—'}</span>
              </div>
              <div>
                <span className="text-ink-muted block">MIME / SIZE</span>
                <span className="text-on-surface">
                  {inspectItem.mimeType || '—'} ·{' '}
                  {inspectItem.filesize ? `${(inspectItem.filesize / 1024).toFixed(1)} KB` : '—'}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => openRenameDialog(inspectItem)}
                className="px-3.5 py-1.5 rounded border border-hairline-rule text-xs font-label-sm text-on-surface hover:border-primary"
              >
                Rename File
              </button>
              {inspectItem.url && (
                <button
                  type="button"
                  onClick={() => copyUrl(inspectItem.url)}
                  className="px-3.5 py-1.5 rounded border border-hairline-rule text-xs font-label-sm text-on-surface hover:border-primary"
                >
                  Copy Asset URL
                </button>
              )}
              <button
                type="button"
                onClick={() => setConfirmDelete({ id: inspectItem.id, filename: inspectItem.filename })}
                className="px-3.5 py-1.5 rounded bg-rose-600 text-white text-xs font-label-sm hover:bg-rose-700"
              >
                Delete Plate
              </button>
            </div>
          </div>
        )}
      </AdminDialog>

      {/* Rename Media Dialog */}
      <AdminDialog
        open={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        labelledBy="rename-plate-title"
        className="w-[min(460px,92vw)]"
      >
        <form onSubmit={handleRenameSubmit} className="p-5 bg-paper-surface space-y-4">
          <div className="flex items-center justify-between border-b border-hairline-subtle pb-3">
            <h1 id="rename-plate-title" className="font-studio-display text-base font-semibold text-on-surface">
              Rename Media File
            </h1>
            <button
              type="button"
              onClick={() => setRenameTarget(null)}
              aria-label="Close rename dialog"
              className="p-1 text-ink-muted hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-ink-secondary">
              Filename
            </label>
            <input
              type="text"
              autoFocus
              required
              value={renameFilename}
              onChange={(e) => setRenameFilename(e.target.value)}
              className="w-full bg-surface-container-low border border-hairline-rule rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-ink-secondary">
              Alt Text
            </label>
            <input
              type="text"
              value={renameAlt}
              onChange={(e) => setRenameAlt(e.target.value)}
              className="w-full bg-surface-container-low border border-hairline-rule rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRenameTarget(null)}
              className="px-4 py-1.5 rounded-full border border-hairline-rule text-xs font-medium text-on-surface hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-1.5 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-medium disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Name'}
            </button>
          </div>
        </form>
      </AdminDialog>

      {/* Delete Confirmation Dialog */}
      <AdminDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        labelledBy="delete-plate-title"
        className="w-[min(420px,92vw)]"
      >
        <div className="p-5 bg-paper-surface space-y-4">
          <h1 id="delete-plate-title" className="font-headline-sm text-lg text-on-surface">
            Delete Media Plate?
          </h1>
          <p className="text-xs text-ink-secondary">
            Permanently remove <strong className="text-on-surface">{confirmDelete?.filename || 'this asset'}</strong> from storage?
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              autoFocus
              onClick={() => setConfirmDelete(null)}
              className="px-3.5 py-1.5 rounded border border-hairline-rule text-xs font-label-sm text-on-surface hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeDelete}
              className="px-3.5 py-1.5 rounded bg-rose-600 text-white text-xs font-label-sm hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </div>
      </AdminDialog>
    </div>
  )
}
