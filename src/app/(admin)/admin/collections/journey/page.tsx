import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function JourneyCollectionPage() {
  const payload = await getPayload({ config: configPromise })

  let journey: any = null
  try {
    journey = await payload.findGlobal({ slug: 'journey' })
  } catch { /* not yet configured */ }

  const milestones = journey?.milestones || []

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <span>OBSERVATORY</span><span>/</span><span>GLOBALS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">JOURNEY ARCHIVE</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Journey &amp; Timeline</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Monotonic sequence controller — ordered milestones and epoch markers.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm px-2 py-0.5 bg-amber-wash text-accent-ochre font-medium">{milestones.length} MILESTONES</span>
          </div>
        </div>
      </header>

      {/* Milestone Sequence */}
      <div className="space-y-4">
        {milestones.map((milestone: any, i: number) => (
          <div key={i} className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden hover:border-primary/40 transition-colors group">
            <div className="flex items-stretch">
              {/* Drag Handle */}
              <div className="w-12 bg-surface-container-low border-r border-hairline-rule flex items-center justify-center cursor-grab group-hover:bg-amber-wash transition-colors">
                <span className="material-symbols-outlined text-[20px] text-ink-muted group-hover:text-primary transition-colors">drag_indicator</span>
              </div>
              {/* Sequence Number */}
              <div className="w-16 bg-paper-surface border-r border-hairline-rule flex items-center justify-center">
                <span className="font-headline-md text-headline-md text-primary font-normal">{String(i + 1).padStart(2, '0')}</span>
              </div>
              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-1">
                  {milestone.period && (
                    <span className="font-label-sm text-label-sm text-primary bg-amber-wash px-2 py-0.5 border border-primary/20 rounded font-medium">{milestone.period}</span>
                  )}
                  {milestone.institution && (
                    <span className="font-label-sm text-label-sm text-ink-muted bg-surface-container-high px-2 py-0.5 rounded">{milestone.institution}</span>
                  )}
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-medium leading-snug">{milestone.title || `Milestone ${i + 1}`}</h3>
                {milestone.description && (
                  <p className="font-body-sm text-body-sm text-ink-secondary mt-1 line-clamp-2">{milestone.description}</p>
                )}
              </div>
              {/* Actions */}
              <div className="flex items-center px-3 gap-1">
                <button className="p-1.5 text-ink-muted hover:text-primary transition-colors" title="Edit">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button className="p-1.5 text-ink-muted hover:text-error transition-colors" title="Remove">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {milestones.length === 0 && (
          <div className="border border-hairline-rule bg-white shadow-xs rounded p-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-ink-muted/20 block mb-4">timeline</span>
            <p className="text-ink-muted font-body-md mb-4">No milestones configured yet.</p>
            <p className="text-ink-muted font-body-sm">Journey milestones are managed via the Payload CMS Journey global.</p>
          </div>
        )}
      </div>

      {/* Bottom Telemetry */}
      <footer className="bg-surface-container-lowest border border-hairline-rule px-4 py-2 flex items-center justify-between font-label-sm text-label-sm text-ink-muted shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="text-on-surface font-medium">Sequence Integrity: OK</span>
        </div>
        <span>{milestones.length} entries · Auto-saved</span>
      </footer>
    </div>
  )
}
