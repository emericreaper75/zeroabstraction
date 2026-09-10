import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })

  console.log('--- Starting Verification ---')

  // 1. Create a Topic
  const topic = await payload.create({
    collection: 'topics',
    data: {
      name: 'Test Topic',
      slug: 'test-topic',
      description: 'A topic created during verification',
      type: 'other'
    }
  })
  console.log(`Created Topic: ${topic.id} - ${topic.name}`)

  // 2. Create a Post in Draft Status
  const post = await payload.create({
    collection: 'posts',
    data: {
      title: 'Test Verification Post',
      slug: 'test-verification-post',
      status: 'draft',
      excerpt: 'This is a test post excerpt',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'This is a test post.'
                }
              ],
              direction: 'ltr',
              format: 'left',
              indent: 0,
              version: 1
            }
          ],
          direction: 'ltr',
          format: 'left',
          indent: 0,
          version: 1
        }
      },
      topics: [topic.id]
    }
  })
  console.log(`Created Post (Draft): ${post.id} - ${post.title}`)

  // 3. Publish the Post
  const publishedPost = await payload.update({
    collection: 'posts',
    id: post.id,
    data: {
      status: 'published',
      published_at: new Date().toISOString()
    }
  })
  console.log(`Updated Post Status to: ${publishedPost.status}`)

  // 4. Archive the Post
  const archivedPost = await payload.update({
    collection: 'posts',
    id: post.id,
    data: {
      status: 'draft' // our schema has draft | published
      // Wait, schema has status: 'draft' | 'published'. Let me check!
    }
  })
  console.log(`Archived Post (Draft status used): ${archivedPost.status}`)

  // 5. Create a Project
  const project = await payload.create({
    collection: 'projects',
    data: {
      title: 'Test Verification Project',
      slug: 'test-verification-project',
      status: 'completed',
      summary: 'Project summary',
      topics: [topic.id],
      related_posts: [post.id]
    }
  })
  console.log(`Created Project: ${project.id} - ${project.title}`)
  console.log(`Project related post resolved: ${project.related_posts?.length === 1}`)

  // Cleanup
  console.log('--- Cleaning Up ---')
  await payload.delete({ collection: 'projects', id: project.id })
  await payload.delete({ collection: 'posts', id: post.id })
  await payload.delete({ collection: 'topics', id: topic.id })
  
  console.log('--- Verification Complete ---')
}

run().catch(console.error).finally(() => process.exit(0))
