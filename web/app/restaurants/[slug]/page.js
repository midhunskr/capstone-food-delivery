import { notFound } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { getCurrentUser } from '@/lib/session'
import { RestaurantHero } from '@/components/restaurant/RestaurantHero'
import { Menu } from '@/components/restaurant/Menu'
import { ErrorState } from '@/components/ui/States'

export async function generateMetadata({ params }) {
    const { slug } = await params
    const result = await apiFetch(`/restaurants/${slug}`, { revalidate: 300 })
    if (!result.ok) return { title: 'Restaurant' }
    return {
        title: result.data.name,
        description: result.data.shortDescription || result.data.description,
    }
}

export default async function RestaurantPage({ params }) {
    const { slug } = await params

    const [detail, menu, user] = await Promise.all([
        apiFetch(`/restaurants/${slug}`, { revalidate: 60 }),
        apiFetch(`/restaurants/${slug}/menu`, { revalidate: 60 }),
        getCurrentUser(),
    ])

    // Only signed-in visitors have favourites; browsing stays open to everyone.
    const favourites = user ? await apiFetch('/favourites', { auth: true }) : null
    const isFavourite = Boolean(
        favourites?.ok && detail.ok
        && favourites.data.some((r) => r.id === detail.data.id))

    // A genuinely missing restaurant is a 404; anything else is our problem and
    // gets a retry, not a "not found" that blames the user's link.
    if (!detail.ok) {
        if (detail.status === 404) notFound()
        return (
            <div className="mx-auto max-w-(--container-page) px-4 py-20 sm:px-6">
                <ErrorState
                    title="We couldn't load this restaurant"
                    message="Something went wrong on our side. Try again in a moment."
                    retryHref={`/restaurants/${slug}`}
                />
            </div>
        )
    }

    return (
        <div>
            <RestaurantHero restaurant={detail.data} isFavourite={isFavourite} isSignedIn={Boolean(user)} />

            {menu.ok && menu.data.totalItems > 0 ? (
                <Menu
                    sections={menu.data.sections}
                    categories={menu.data.categories}
                    restaurant={menu.data.restaurant}
                />
            ) : (
                <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
                    <ErrorState
                        title="The menu isn't loading"
                        message="We couldn't fetch this menu just now. Try again in a moment."
                        retryHref={`/restaurants/${slug}`}
                    />
                </div>
            )}
        </div>
    )
}
