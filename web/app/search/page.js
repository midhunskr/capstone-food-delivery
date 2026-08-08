import { Suspense } from 'react'
import { apiFetch } from '@/lib/api'
import { SearchExperience } from '@/components/search/SearchExperience'
import { GridSkeleton } from '@/components/ui/States'

export const metadata = { title: 'Search' }

export default async function SearchPage({ searchParams }) {
    const sp = await searchParams
    const query = (sp.q || '').trim()

    const [results, cuisineResult] = await Promise.all([
        query ? apiFetch(`/search?q=${encodeURIComponent(query)}&limit=12`) : Promise.resolve(null),
        apiFetch('/cuisines', { revalidate: 3600 }),
    ])

    // A failed search degrades to empty buckets — the screen still works and the
    // empty state reads as "nothing found" rather than a broken page.
    const data = results?.ok
        ? results.data
        : query ? { restaurants: [], dishes: [], cuisines: [] } : null

    return (
        <Suspense fallback={<div className="p-6"><GridSkeleton count={6} /></div>}>
            <SearchExperience
                key={query}
                initialQuery={query}
                initialResults={data}
                cuisines={cuisineResult.ok ? cuisineResult.data : []}
            />
        </Suspense>
    )
}
