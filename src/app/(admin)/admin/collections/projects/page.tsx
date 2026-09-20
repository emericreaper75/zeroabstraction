import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function ProjectsCollectionPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'projects', limit: 50, sort: '-updatedAt' })

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <span>OBSERVATORY</span><span>/</span><span>COLLECTIONS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">ENGINEERING RIGS</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Projects &amp; Rigs</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Engineering rigs, instrumentation experiments, and software platforms.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/collections/projects/new" className="flex items-center gap-1.5 px-4 py-2 bg-accent-amber hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Project
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-paper-surface font-label-sm text-label-sm text-ink-muted uppercase tracking-wider">
                <th className="w-10 px-4 py-3 text-center"><input type="checkbox" className="table-checkbox" /></th>
                <th className="px-4 py-3 font-medium">Title &amp; Slug</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-rule text-body-sm font-body-sm">
              {result.docs.map((project: any) => (
                <tr key={project.id} className="hover:bg-paper-surface transition-colors group">
                  <td className="px-4 py-3 text-center"><input type="checkbox" className="table-checkbox" /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-0.5">
                      <Link href={`/admin/collections/projects/${project.id}`} className="font-headline-sm text-headline-sm text-on-surface font-medium hover:text-accent-ochre transition-colors leading-snug">
                        {project.title}
                      </Link>
                      <span className="font-label-sm text-label-sm text-accent-ochre">/projects/{project.slug}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {project.category && <span className="px-2 py-0.5 bg-paper-surface font-label-sm text-label-sm text-ink-secondary">{project.category}</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-label-sm text-label-sm text-on-surface">
                    {project.year || '—'}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1">
                      <Link href={`/projects/${project.slug}`} className="p-1 text-ink-muted hover:text-accent-ochre transition-colors" title="Preview">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Link>
                      <Link href={`/admin/collections/projects/${project.id}`} className="p-1 text-ink-muted hover:text-on-surface transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit_document</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {result.docs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-ink-muted font-body-sm">No projects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
