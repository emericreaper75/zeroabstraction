/**
 * Independent Phase 1 backend verification.
 * Uses Payload Local API in-process, then REST over HTTP.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const RICH_TEXT = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Phase 1 verification body', version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

async function main() {
  const payload = await getPayload({ config })
  const failures: string[] = []

  const log = (ok: boolean, label: string, detail = '') => {
    const mark = ok ? 'PASS' : 'FAIL'
    console.log(`[${mark}] ${label}${detail ? ` — ${detail}` : ''}`)
    if (!ok) failures.push(label)
  }

  try {
    const posts = await payload.find({ collection: 'posts', limit: 1, overrideAccess: true })
    const projects = await payload.find({ collection: 'projects', limit: 1, overrideAccess: true })
    const topics = await payload.find({ collection: 'topics', limit: 1, overrideAccess: true })
    const media = await payload.find({ collection: 'media', limit: 1, overrideAccess: true })
    const users = await payload.find({ collection: 'users', limit: 5, overrideAccess: true })

    log(true, 'Local API posts.find', `total=${posts.totalDocs}`)
    log(true, 'Local API projects.find', `total=${projects.totalDocs}`)
    log(true, 'Local API topics.find', `total=${topics.totalDocs}`)
    log(true, 'Local API media.find', `total=${media.totalDocs}`)
    log(users.totalDocs === 1, 'Single admin user seeded', `total=${users.totalDocs}`)

    const currentState = await payload.findGlobal({ slug: 'current-state', overrideAccess: true })
    const profile = await payload.findGlobal({ slug: 'profile', overrideAccess: true })
    const journey = await payload.findGlobal({ slug: 'journey', overrideAccess: true })
    const siteSettings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })

    log(Boolean(currentState), 'Local API global current-state')
    log(Boolean(profile), 'Local API global profile')
    log(Boolean(journey), 'Local API global journey')
    log(Boolean(siteSettings), 'Local API global site-settings')

    const stamp = Date.now()
    const topic = await payload.create({
      collection: 'topics',
      overrideAccess: true,
      data: {
        name: `Verify Topic ${stamp}`,
        slug: `verify-topic-${stamp}`,
        type: 'physics',
        description: 'Temporary Phase 1 verification topic',
      },
    })

    const post = await payload.create({
      collection: 'posts',
      overrideAccess: true,
      data: {
        title: `Verify Post ${stamp}`,
        slug: `verify-post-${stamp}`,
        excerpt: 'Temporary verification post',
        content: RICH_TEXT,
        status: 'draft',
        topics: [topic.id],
      },
    })

    const published = await payload.update({
      collection: 'posts',
      id: post.id,
      overrideAccess: true,
      data: { status: 'published', published_at: new Date().toISOString() },
    })
    log(published.status === 'published', 'Post draft → published')

    const archived = await payload.update({
      collection: 'posts',
      id: post.id,
      overrideAccess: true,
      data: { status: 'archived' },
    })
    log(archived.status === 'archived', 'Post published → archived')

    const project = await payload.create({
      collection: 'projects',
      overrideAccess: true,
      data: {
        title: `Verify Project ${stamp}`,
        slug: `verify-project-${stamp}`,
        summary: 'Temporary verification project',
        status: 'in_progress',
        topics: [topic.id],
        related_posts: [post.id],
      },
    })

    await payload.update({
      collection: 'posts',
      id: post.id,
      overrideAccess: true,
      data: { related_projects: [project.id] },
    })

    const linkedPost = await payload.findByID({
      collection: 'posts',
      id: post.id,
      depth: 1,
      overrideAccess: true,
    })
    const relatedProjectId =
      Array.isArray(linkedPost.related_projects) && linkedPost.related_projects[0]
        ? typeof linkedPost.related_projects[0] === 'object'
          ? linkedPost.related_projects[0].id
          : linkedPost.related_projects[0]
        : null
    log(relatedProjectId === project.id, 'Post ↔ project relationship')

    await payload.updateGlobal({
      slug: 'current-state',
      overrideAccess: true,
      data: { studying: 'Phase 1 verification', visibility: false },
    })
    const updatedState = await payload.findGlobal({ slug: 'current-state', overrideAccess: true })
    log(
      updatedState.studying === 'Phase 1 verification' && Boolean(updatedState.updatedAt),
      'Current State global persist + updated_at',
    )

    await payload.delete({ collection: 'posts', id: post.id, overrideAccess: true })
    await payload.delete({ collection: 'projects', id: project.id, overrideAccess: true })
    await payload.delete({ collection: 'topics', id: topic.id, overrideAccess: true })
    log(true, 'Local API create/update/delete teardown')

    await payload.updateGlobal({
      slug: 'current-state',
      overrideAccess: true,
      data: { studying: '', visibility: true },
    })

    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    assert(email && password, 'ADMIN_EMAIL and ADMIN_PASSWORD must be set for REST auth check')

    const loginRes = await fetch(`${base}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const loginJson = (await loginRes.json()) as { token?: string; user?: { email?: string } }
    log(loginRes.ok && Boolean(loginJson.token), 'REST POST /api/users/login', `status=${loginRes.status}`)

    const token = loginJson.token
    const postsRes = await fetch(`${base}/api/posts?limit=1`)
    log(postsRes.ok, 'REST GET /api/posts', `status=${postsRes.status}`)

    const globalsRes = await fetch(`${base}/api/globals/current-state`)
    log(globalsRes.ok, 'REST GET /api/globals/current-state', `status=${globalsRes.status}`)

    const meRes = await fetch(`${base}/api/users/me`, {
      headers: token ? { Authorization: `JWT ${token}` } : {},
    })
    log(meRes.ok, 'REST GET /api/users/me', `status=${meRes.status}`)

    const adminUiRes = await fetch(`${base}/admin`, { redirect: 'manual' })
    log(
      adminUiRes.status !== 200,
      'Payload admin UI is not mounted at /admin',
      `status=${adminUiRes.status}`,
    )
  } catch (error) {
    console.error(error)
    failures.push(error instanceof Error ? error.message : String(error))
  } finally {
    await payload.db.destroy?.()
  }

  if (failures.length > 0) {
    console.error(`\nPhase 1 verification failed (${failures.length}):`)
    for (const failure of failures) console.error(` - ${failure}`)
    process.exit(1)
  }

  console.log('\nPhase 1 verification passed.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
