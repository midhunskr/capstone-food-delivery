import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { getCurrentUser } from '@/lib/session'
import { product } from '@/config/product'
import { Section, Rail } from '@/components/discovery/Section'
import { CuisineRail } from '@/components/discovery/CuisineRail'
import { OfferRail } from '@/components/discovery/OfferRail'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { DishCard } from '@/components/dish/DishCard'
import { SearchLauncher } from '@/components/search/SearchLauncher'
import { ErrorState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'

const greeting = () => {
    const hour = Number(new Intl.DateTimeFormat('en-IN', {
        hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata',
    }).format(new Date()))

    if (hour < 5) return 'Still up?'
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
}

export default async function HomePage() {
    const [home, user] = await Promise.all([apiFetch('/home', { revalidate: 60 }), getCurrentUser()])

    if (!home.ok) {
        return (
            <div className="mx-auto max-w-(--container-page) px-4 py-20 sm:px-6">
                <ErrorState
                    title="We couldn't load restaurants"
                    message="This one's on us. Give it another go in a moment."
                    retryHref="/"
                />
            </div>
        )
    }

    const {
        cuisines, offers, popularRestaurants, topRatedRestaurants, nearbyRestaurants, popularDishes,
    } = home.data

    const firstName = user?.name?.split(' ')[0]

    return (
        <div className="mx-auto max-w-(--container-page)">
            {/* Intent first: greeting, then search. No marketing hero — the point
                of this screen is to get someone to food quickly. */}
            <section className="px-4 pb-2 pt-6 sm:px-6 sm:pt-10">
                <p className="text-sm font-semibold text-paprika-600">
                    {greeting()}{firstName ? `, ${firstName}` : ''}
                </p>
                <h1 className="mt-1 text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-[2.1rem]">
                    What are you craving?
                </h1>

                <div className="mt-5 max-w-2xl">
                    <SearchLauncher />
                </div>
            </section>

            <Section title="Browse by cuisine" className="pt-4">
                <CuisineRail cuisines={cuisines} />
            </Section>

            {offers.length > 0 && (
                <Section title="Deals for you" href="/restaurants?offers=1" linkLabel="All offers">
                    <OfferRail offers={offers} />
                </Section>
            )}

            <Section
                title="Fastest near you"
                subtitle={`Quickest delivery in ${product.city} right now`}
                href="/restaurants?sort=deliveryTime"
            >
                <Rail>
                    {nearbyRestaurants.slice(0, 8).map((r) => (
                        <RestaurantCard key={r.id} restaurant={r} />
                    ))}
                </Rail>
            </Section>

            <Section title="Popular right now" href="/restaurants?sort=popular">
                <Rail>
                    {popularRestaurants.slice(0, 8).map((r) => (
                        <RestaurantCard key={r.id} restaurant={r} />
                    ))}
                </Rail>
            </Section>

            {popularDishes.length > 0 && (
                <Section title="Dishes people keep ordering">
                    <Rail itemClassName="w-[170px] max-w-[45vw] sm:w-[196px]">
                        {popularDishes.slice(0, 10).map((dish) => (
                            <DishCard key={dish.id} dish={dish} />
                        ))}
                    </Rail>
                </Section>
            )}

            {/* Top rated closes the page as a grid — a different rhythm from the
                rails above, and it signals the end of the scroll. */}
            <Section title="Top rated" subtitle="Consistently good, according to everyone else">
                <div className="grid grid-cols-2 gap-x-4 gap-y-7 px-4 sm:gap-x-5 sm:px-6 lg:grid-cols-4">
                    {topRatedRestaurants.slice(0, 8).map((r) => (
                        <RestaurantCard key={r.id} restaurant={r} />
                    ))}
                </div>
            </Section>

            <div className="px-4 py-10 sm:px-6">
                <div className="flex flex-col items-center gap-4 rounded-3xl bg-sand-100 px-6 py-10 text-center">
                    <span className="grid size-12 place-items-center rounded-2xl bg-surface text-paprika-500 shadow-card">
                        <UtensilsCrossed className="size-6" />
                    </span>
                    <div>
                        <h2 className="text-xl font-extrabold">Still deciding?</h2>
                        <p className="mt-1 text-[0.95rem] text-ink-500">
                            Browse everything open in {product.city} right now.
                        </p>
                    </div>
                    <Button as={Link} href="/restaurants">See all restaurants</Button>
                </div>
            </div>
        </div>
    )
}
