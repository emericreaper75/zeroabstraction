'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createTopicAction, deleteTopicAction } from '@/app/(admin)/admin/collections/topics/actions'

interface TopicItem {
  id: string | number
  name: string
  slug: string
  type?: string | null
  description?: string | null
  postCount?: number
}

interface TopicsManagerProps {
  initialTopics: TopicItem[]
  totalDocs: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function TopicsManager({ initialTopics, totalDocs: _totalDocs }: TopicsManagerProps) {
  const router = useRouter()
  const [topics, setTopics] = useState<TopicItem[]>(initialTopics)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [type, setType] = useState('astrophysics')
  const [description, setDescription] = useState('')

  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!slugManuallyEdited) {
      setSlug(slugify(val))
    }
  }

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Topic name is required.' })
      return
    }
    if (!slug.trim()) {
      setFeedback({ type: 'error', message: 'Topic slug is required.' })
      return
    }

    setFeedback(null)

    startTransition(async () => {
      const res = await createTopicAction({
        name,
        slug,
        type,
        description,
      })

      if (res.success && res.doc) {
        setFeedback({ type: 'success', message: `Topic "${name}" created successfully.` })
        setTopics((prev) => [...prev, { ...res.doc, postCount: 0 }])
        setName('')
        setSlug('')
        setDescription('')
        setSlugManuallyEdited(false)
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to create topic.' })
      }
    })
  }

  const handleDelete = async (topicId: string | number, topicName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete topic "${topicName}"?`)
    if (!confirmed) return

    setDeletingId(topicId)
    const res = await deleteTopicAction(topicId)
    setDeletingId(null)

    if (res.success) {
      setFeedback({ type: 'success', message: `Topic "${topicName}" deleted.` })
      setTopics((prev) => prev.filter((t) => t.id !== topicId))
      router.refresh()
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete topic.' })
    }
  }

  return (
    <div className="space-y-6">
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

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topic List (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest shadow-sm border border-hairline-rule overflow-hidden">
            <div className="bg-paper-surface px-4 py-3 border-b border-hairline-rule flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold">
                TOPIC INDEX
              </span>
              <span className="font-label-sm text-label-sm text-ink-muted">
                {topics.length} entries
              </span>
            </div>
            <div className="divide-y divide-hairline-rule">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="px-4 py-3.5 flex items-center justify-between hover:bg-paper-surface transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-ink-muted group-hover:text-primary transition-colors">
                      label
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-headline-sm text-headline-sm text-on-surface font-medium leading-snug">
                          {topic.name}
                        </p>
                        {topic.type && (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-surface-container text-ink-secondary">
                            {topic.type}
                          </span>
                        )}
                      </div>
                      {topic.slug && (
                        <span className="font-label-sm text-label-sm text-accent-ochre">
                          /topics/{topic.slug}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-label-sm text-label-sm text-ink-muted bg-surface-container-high px-2 py-0.5 rounded">
                      {topic.postCount || 0} {topic.postCount === 1 ? 'post' : 'posts'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(topic.id, topic.name)}
                      disabled={deletingId === topic.id}
                      title="Delete Topic"
                      className="text-ink-muted hover:text-rose-600 transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {deletingId === topic.id ? 'sync' : 'delete'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
              {topics.length === 0 && (
                <div className="px-4 py-12 text-center text-ink-muted font-body-sm">
                  No topics found. Create your first taxonomy entry on the right.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Create Form & Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Create Card */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              CREATE NEW TOPIC
            </h3>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Topic Name <span className="text-accent-ochre">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g., Gravitational Waves"
                  className="w-full bg-white border border-hairline-rule text-on-surface font-body-md text-body-md px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Slug <span className="text-accent-ochre">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value))
                    setSlugManuallyEdited(true)
                  }}
                  placeholder="gravitational-waves"
                  className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Discipline / Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
                >
                  <option value="astrophysics">Astrophysics</option>
                  <option value="physics">Physics</option>
                  <option value="ece">ECE</option>
                  <option value="programming">Programming</option>
                  <option value="photography">Photography</option>
                  <option value="books">Books</option>
                  <option value="experiments">Experiments</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this domain or field..."
                  rows={2}
                  className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider py-2.5 hover:bg-accent-ochre transition-colors shadow-sm disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    {isPending ? 'sync' : 'add'}
                  </span>
                  {isPending ? 'Creating Topic...' : 'Create Topic'}
                </span>
              </button>
            </form>
          </div>

          {/* Taxonomy Stats Card */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              TAXONOMY TELEMETRY
            </h3>
            <div className="space-y-3 text-label-sm font-label-sm text-ink-muted">
              <div className="flex justify-between">
                <span>Total Topics</span>
                <span className="text-on-surface font-medium">{topics.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Most Active</span>
                <span className="text-primary font-medium">{topics[0]?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span>Schema Health</span>
                <span className="text-emerald-700 font-medium">OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
