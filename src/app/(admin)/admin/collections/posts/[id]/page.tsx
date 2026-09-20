import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'

export default async function PostEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  if (id === 'new') {
    return <PostForm post={null} topics={await getTopics(payload)} />
  }

  let post: any
  try {
    post = await payload.findByID({ collection: 'posts', id })
  } catch {
    notFound()
  }

  const topics = await getTopics(payload)
  return <PostForm post={post} topics={topics} />
}

async function getTopics(payload: any) {
  const result = await payload.find({ collection: 'topics', limit: 100, sort: 'name' })
  return result.docs
}

function PostForm({ post, topics }: { post: any; topics: any[] }) {
  const isNew = !post
  const updatedDateStr = post?.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : ''
  const createdDateStr = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <div className="flex flex-col w-full pb-12 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted pt-2">
        <Link href="/admin" className="hover:text-primary transition-colors">OBSERVATORY</Link>
        <span>/</span>
        <Link href="/admin/collections/posts" className="hover:text-primary transition-colors">POSTS</Link>
        <span>/</span>
        <span className="text-on-surface font-medium tracking-wide">{isNew ? 'NEW ENTRY' : 'EDIT'}</span>
      </div>

      {/* Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-hairline-rule pb-6">
        <div className="space-y-1">
          <h1 className="font-headline-xl text-headline-lg text-on-surface tracking-tight leading-none">
            {isNew ? 'New Post' : post.title}
          </h1>
          {!isNew && (
            <div className="flex items-center gap-3 font-label-sm text-label-sm text-ink-muted mt-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 ${post._status === 'published' || post.published_at ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-container-high text-ink-secondary'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${post._status === 'published' || post.published_at ? 'bg-emerald-600' : 'bg-tertiary'}`} />
                {post._status === 'published' || post.published_at ? 'Published' : 'Draft'}
              </span>
              <span>Last saved: {updatedDateStr}</span>
              <span>ID: {post.id}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isNew && post.slug && (
            <Link href={`/writing/${post.slug}`} className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low text-ink-secondary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-high transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              Preview
            </Link>
          )}
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors">
            <span className="material-symbols-outlined text-[16px]">save</span>
            {isNew ? 'Create' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Title</label>
            <input
              className="w-full bg-white border border-hairline-rule text-on-surface font-headline-md text-headline-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors rounded-none italic"
              defaultValue={post?.title || ''}
              placeholder="Enter manuscript title..."
            />
          </div>
          {/* Slug */}
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Canonical Slug</label>
            <div className="flex items-center bg-white border border-hairline-rule">
              <span className="px-3 py-2.5 text-ink-muted font-label-sm text-label-sm bg-surface-container-low border-r border-hairline-rule">/posts/</span>
              <input
                className="flex-1 bg-transparent text-on-surface font-body-md text-body-md px-3 py-2.5 focus:outline-none"
                defaultValue={post?.slug || ''}
                placeholder="your-post-slug"
              />
            </div>
          </div>
          {/* Excerpt */}
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Abstract / Excerpt</label>
            <textarea
              className="w-full bg-white border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors rounded-none resize-y min-h-[100px]"
              defaultValue={post?.excerpt || ''}
              placeholder="A brief abstract of the manuscript..."
              rows={3}
            />
          </div>
          {/* Body Content */}
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Body Content</label>
            <div className="bg-white border border-hairline-rule min-h-[400px] p-4">
              <p className="text-ink-muted font-body-sm italic">Rich text editor will be integrated here. Content is managed via Payload CMS rich text field.</p>
              {post?.content && (
                <div className="mt-4 pt-4 border-t border-hairline-rule text-on-surface font-body-md">
                  <p className="text-ink-secondary font-label-sm text-label-sm mb-2">Current content preview:</p>
                  <p className="text-on-surface">{typeof post.content === 'string' ? post.content.slice(0, 500) : 'Rich text content loaded'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Publishing */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">Publication Control</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Status</label>
                <select className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none" defaultValue={post?._status || 'draft'}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Publish Date</label>
                <input
                  type="datetime-local"
                  className="w-full bg-white border border-hairline-rule text-on-surface font-label-sm text-label-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
                  defaultValue={post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : ''}
                />
              </div>
            </div>
          </div>

          {/* Topic Assignment */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">Topic Classification</h3>
            <select className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none" defaultValue={typeof post?.topic === 'object' ? post.topic.id : post?.topic || ''}>
              <option value="">— Select Topic —</option>
              {topics.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Metadata */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">Telemetry</h3>
            <div className="space-y-2 text-label-sm font-label-sm text-ink-muted">
              {post && (
                <>
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span className="text-on-surface">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Modified</span>
                    <span className="text-on-surface">{updatedDateStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Document ID</span>
                    <span className="text-on-surface font-mono">{post.id}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
