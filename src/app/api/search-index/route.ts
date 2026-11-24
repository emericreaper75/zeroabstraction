import { unstable_cache } from 'next/cache'
import { getSearchIndex } from '@/lib/content'

const getCachedSearchIndex = unstable_cache(
  () => getSearchIndex(),
  ['public-search-index'],
  { revalidate: 300, tags: ['public-search-index'] },
)

export async function GET() {
  return Response.json(await getCachedSearchIndex())
}
