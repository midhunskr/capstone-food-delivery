import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { getCurrentUser } from '@/lib/session'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'

export const metadata = { title: 'Favourites' }

export default async function FavouritesPage() {
    if (!(await getCurrentUser())) redirect('/login?next=/account/favourites')

    const result = await apiFetch('/favourites', { auth: true })

    return (
        <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
            <h1 className="pt-8 text-[1.6rem] font-extrabold tracking-tight sm:text-3xl">Favourites</h1>

            {!result.ok ? (
                <ErrorState
                    title="We couldn't load your favourites"
                    message="Something went wrong on our side. Try again in a moment."
                    retryHref="/account/favourites"
                />
            ) : result.data.length === 0 ? (
                <EmptyState
                    icon={Heart}
                    title="Nothing saved yet"
                    message="Tap the heart on a restaurant to keep it here."
                    action={<Button as={Link} href="/restaurants">Browse restaurants</Button>}
                />
            ) : (
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
                    {result.data.map((restaurant) => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                </div>
            )}
        </div>
    )
}
