import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { apiFetch, buildQuery } from '@/lib/api'
import { product } from '@/config/product'
import { FilterBar } from '@/components/filters/FilterBar'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'

export const metadata = { title: 'All restaurants' }

const PAGE_SIZE = 18

export default async function RestaurantsPage({ searchParams }) {
    const sp = await searchParams
    const page = Number(sp.page) || 1

    const query = buildQuery({
        page,
        limit: PAGE_SIZE,
        q: sp.q,
        cuisine: sp.cuisine,
        veg: sp.veg,
        rating: sp.rating,
        maxDeliveryTime: sp.maxDeliveryTime,
        maxPrice: sp.maxPrice,
        offers: sp.offers,
        freeDelivery: sp.freeDelivery,
        sort: sp.sort,
    })

    const [result, cuisineResult] = await Promise.all([
        apiFetch(`/restaurants${query}`),
        apiFetch('/cuisines', { revalidate: 3600 }),
    ])

    const cuisines = cuisineResult.ok ? cuisineResult.data : []
    const activeCuisine = (sp.cuisine || '').split(',').filter(Boolean)
    const heading = activeCuisine.length === 1
        ? cuisines.find((c) => c.slug === activeCuisine[0])?.name ?? 'Restaurants'
        : sp.offers === '1' ? 'Restaurants with offers' : 'All restaurants'

    return (
        <div className="mx-auto max-w-(--container-page)">
            <div className="px-4 pt-6 sm:px-6 sm:pt-8">
                <h1 className="text-[1.6rem] font-extrabold tracking-tight sm:text-3xl">{heading}</h1>
                <p className="mt-1 text-sm text-ink-500">
                    {result.ok
                        ? `${result.meta.total} ${result.meta.total === 1 ? 'place' : 'places'} in ${product.city}`
                        : product.city}
                </p>
            </div>

            {/* Sticky so filters stay reachable while scrolling a long grid. */}
            <div className="sticky top-16 z-30 -mx-0 border-b border-sand-200 bg-paper/90 backdrop-blur-md">
                <FilterBar cuisines={cuisines} total={result.ok ? result.meta.total : undefined} />
            </div>

            <div className="px-4 py-6 sm:px-6">
                {!result.ok ? (
                    <ErrorState
                        title="We couldn't load restaurants"
                        message="Something went wrong on our side. Try again in a moment."
                        retryHref="/restaurants"
                    />
                ) : result.data.length === 0 ? (
                    <EmptyState
                        icon={SearchX}
                        title="Nothing matched those filters"
                        message="Try removing one or two — there's plenty open right now."
                        action={<Button as={Link} href="/restaurants" variant="secondary">Clear filters</Button>}
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
                            {result.data.map((restaurant, i) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                    priority={i < 4}
                                />
                            ))}
                        </div>

                        <Pagination meta={result.meta} searchParams={sp} />
                    </>
                )}
            </div>
        </div>
    )
}

function Pagination({ meta, searchParams }) {
    if (meta.pages <= 1) return null

    const linkFor = (page) => {
        const search = new URLSearchParams()
        for (const [key, value] of Object.entries(searchParams)) {
            if (value && key !== 'page') search.set(key, value)
        }
        search.set('page', String(page))
        return `/restaurants?${search.toString()}`
    }

    return (
        <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
            {meta.page > 1 && (
                <Button as={Link} href={linkFor(meta.page - 1)} variant="secondary" size="sm">
                    Previous
                </Button>
            )}
            <span className="text-sm font-medium text-ink-500">
                Page {meta.page} of {meta.pages}
            </span>
            {meta.page < meta.pages && (
                <Button as={Link} href={linkFor(meta.page + 1)} variant="secondary" size="sm">
                    Next
                </Button>
            )}
        </nav>
    )
}
