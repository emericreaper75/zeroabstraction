import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  let project: any = null
  if (id !== 'new') {
    try {
      project = await payload.findByID({ collection: 'projects', id })
    } catch {
      notFound()
    }
  }

  const isNew = !project

  return (
    <div className="flex flex-col w-full pb-12 space-y-6">
      <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted pt-2">
        <Link href="/admin" className="hover:text-primary transition-colors">OBSERVATORY</Link>
        <span>/</span>
        <Link href="/admin/collections/projects" className="hover:text-primary transition-colors">PROJECTS</Link>
        <span>/</span>
        <span className="text-on-surface font-medium">{isNew ? 'NEW' : 'EDIT'}</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-hairline-rule pb-6">
        <h1 className="font-headline-xl text-headline-lg text-on-surface tracking-tight">{isNew ? 'New Project' : project.title}</h1>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors">
          <span className="material-symbols-outlined text-[16px]">save</span>
          {isNew ? 'Create' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Title</label>
            <input className="w-full bg-white border border-hairline-rule text-on-surface font-headline-md text-headline-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none italic" defaultValue={project?.title || ''} placeholder="Project name..." />
          </div>
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Slug</label>
            <input className="w-full bg-white border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-2.5 focus:border-primary focus:outline-none rounded-none" defaultValue={project?.slug || ''} placeholder="project-slug" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Summary</label>
            <textarea className="w-full bg-white border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-3 focus:border-primary focus:outline-none rounded-none resize-y min-h-[120px]" defaultValue={project?.summary || ''} rows={4} placeholder="Brief project description..." />
          </div>
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Description</label>
            <div className="bg-white border border-hairline-rule min-h-[300px] p-4">
              <p className="text-ink-muted font-body-sm italic">Rich text editor — managed via Payload CMS.</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">Project Metadata</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Year</label>
                <input type="number" className="w-full bg-white border border-hairline-rule text-on-surface font-label-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none" defaultValue={project?.year || ''} placeholder="2025" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Category</label>
                <input className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none" defaultValue={project?.category || ''} placeholder="e.g., Astrophotography" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Repository URL</label>
                <input className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none" defaultValue={project?.repository_url || ''} placeholder="https://github.com/..." />
              </div>
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Live URL</label>
                <input className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none" defaultValue={project?.live_url || ''} placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
