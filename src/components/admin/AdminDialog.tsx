'use client'

import React, { useEffect, useRef } from 'react'

interface AdminDialogProps {
  open: boolean
  onClose: () => void
  labelledBy?: string
  ariaLabel?: string
  className?: string
  children: React.ReactNode
}

/**
 * Accessible native <dialog> wrapper using showModal() with closedby="any"
 * and a pointerdown/pointerup fallback for browsers without closedBy support.
 */
export function AdminDialog({
  open,
  onClose,
  labelledBy,
  ariaLabel,
  className = '',
  children,
}: AdminDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => {
      if (open) onClose()
    }
    dialog.addEventListener('close', handleClose)

    // Fallback light-dismiss for browsers without native closedBy support
    let pressedOutside = false
    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect()
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
    }
    const handlePointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e)
    }
    const handlePointerUp = (e: PointerEvent) => {
      if (!('closedBy' in HTMLDialogElement.prototype) && pressedOutside && isOutside(e)) {
        dialog.close()
      }
      pressedOutside = false
    }

    dialog.addEventListener('pointerdown', handlePointerDown)
    dialog.addEventListener('pointerup', handlePointerUp)

    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('pointerdown', handlePointerDown)
      dialog.removeEventListener('pointerup', handlePointerUp)
    }
  }, [open, onClose])

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby={labelledBy}
      aria-label={!labelledBy ? ariaLabel : undefined}
      className={`p-0 border border-hairline-rule rounded-lg shadow-2xl bg-paper-surface text-on-surface max-w-full ${className}`}
    >
      {children}
    </dialog>
  )
}
