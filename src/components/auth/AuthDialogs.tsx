'use client'

import React, { useEffect, useRef } from 'react'

export type AuthDialogKind = 'forgot' | 'biometrics' | 'hardware' | 'cli' | 'shortcuts' | null

interface AuthDialogsProps {
  openDialog: AuthDialogKind
  onClose: () => void
  onCopy: (value: string, label: string) => void
  diagnosticsText: string
}

export function AuthDialogs({ openDialog, onClose, onCopy, diagnosticsText }: AuthDialogsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (openDialog) {
      if (!dialog.open) {
        dialog.showModal()
      }
    } else if (dialog.open) {
      dialog.close()
    }
  }, [openDialog])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  const cliSnippet = `curl -X POST "${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/users/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"observer@zeroabstraction.com","password":"YOUR_KEY"}'`

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="auth-dialog-title"
      className="w-[calc(100%-2rem)] max-w-md rounded-[20px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)] text-[var(--admin-ink-primary)] p-0 shadow-2xl m-auto"
    >
      {openDialog && (
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--admin-hairline-rule)]">
            <div>
              <span className="typo-pill text-[10px] text-[var(--admin-primary)]">
                {openDialog === 'forgot' && 'Credential Recovery'}
                {openDialog === 'biometrics' && 'WebAuthn / Passkey'}
                {openDialog === 'hardware' && 'FIDO2 Hardware Key'}
                {openDialog === 'cli' && 'Terminal CLI Auth'}
                {openDialog === 'shortcuts' && 'Keyboard & Diagnostics'}
              </span>
              <h3
                id="auth-dialog-title"
                className="text-[17px] font-semibold text-[var(--admin-ink-primary)] mt-1"
                style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
              >
                {openDialog === 'forgot' && 'Recover Observatory Access'}
                {openDialog === 'biometrics' && 'Biometric Passkey Authorization'}
                {openDialog === 'hardware' && 'Hardware Security Key'}
                {openDialog === 'cli' && 'Authenticate via Terminal'}
                {openDialog === 'shortcuts' && 'Login Shortcuts & Node Info'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-[10px] border border-[var(--admin-hairline-rule)] flex items-center justify-center text-[var(--admin-ink-muted)] hover:text-[var(--admin-ink-primary)] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="py-4 space-y-3 text-[13px] text-[var(--admin-ink-secondary)] leading-relaxed">
            {openDialog === 'forgot' && (
              <>
                <p>
                  Observer accounts are managed directly by Payload CMS. To reset a lost access key, run the Payload user update script on the host or contact the node administrator.
                </p>
                <div className="rounded-[12px] bg-[var(--admin-paper-container)] border border-[var(--admin-hairline-rule)] p-3 flex items-center justify-between gap-2">
                  <code className="typo-mono-data text-[11.5px] !text-[var(--admin-ink-primary)] truncate">
                    npx payload users:reset-password
                  </code>
                  <button
                    type="button"
                    onClick={() => onCopy('npx payload users:reset-password', 'Reset command')}
                    className="typo-btn px-2.5 py-1 rounded-[8px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)] hover:border-[var(--admin-primary)] text-[11px] shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </>
            )}

            {openDialog === 'biometrics' && (
              <>
                <p>
                  Platform passkey (Touch ID / Windows Hello) enrollment is configured per-observer inside the Atelier security settings once signed in.
                </p>
                <p className="text-[12px] text-[var(--admin-ink-muted)]">
                  Use your primary Observer Identity and Access Key to enter the console, or configure WebAuthn in Payload Users.
                </p>
              </>
            )}

            {openDialog === 'hardware' && (
              <>
                <p>
                  FIDO2 / YubiKey hardware keys require an active WebAuthn challenge endpoint. Standard email + key authentication remains active for this node.
                </p>
              </>
            )}

            {openDialog === 'cli' && (
              <>
                <p>
                  Obtain a Payload JWT session token directly from your terminal against <code className="typo-mono-data">/api/users/login</code>:
                </p>
                <pre className="rounded-[12px] bg-[var(--admin-paper-container)] border border-[var(--admin-hairline-rule)] p-3 overflow-x-auto text-[11px] leading-relaxed font-mono text-[var(--admin-ink-primary)]">
                  {cliSnippet}
                </pre>
                <button
                  type="button"
                  onClick={() => onCopy(cliSnippet, 'cURL login snippet')}
                  className="typo-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-container)] hover:border-[var(--admin-primary)] text-[12px]"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  Copy cURL Command
                </button>
              </>
            )}

            {openDialog === 'shortcuts' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b border-[var(--admin-hairline-subtle)]">
                    <span>Submit credentials</span>
                    <kbd className="typo-mono-data px-2 py-0.5 rounded bg-[var(--admin-paper-container)] border border-[var(--admin-hairline-rule)]">Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-[var(--admin-hairline-subtle)]">
                    <span>Clear error / close dialog</span>
                    <kbd className="typo-mono-data px-2 py-0.5 rounded bg-[var(--admin-paper-container)] border border-[var(--admin-hairline-rule)]">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span>Open shortcuts &amp; diagnostics</span>
                    <kbd className="typo-mono-data px-2 py-0.5 rounded bg-[var(--admin-paper-container)] border border-[var(--admin-hairline-rule)]">?</kbd>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onCopy(diagnosticsText, 'Node diagnostics')}
                    className="typo-btn w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[10px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-container)] hover:border-[var(--admin-primary)] text-[12px]"
                  >
                    <span className="material-symbols-outlined text-[15px]">monitoring</span>
                    Copy Node Diagnostics
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[var(--admin-hairline-rule)] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="typo-btn px-4 py-2 rounded-[10px] bg-[var(--admin-primary)] text-[var(--admin-on-primary)] hover:opacity-90 transition-opacity text-[12.5px]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
