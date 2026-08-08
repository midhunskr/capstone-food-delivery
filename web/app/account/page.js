import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronRight, Heart, MapPin, ReceiptText } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { getCurrentUser } from '@/lib/session'
import { OrderCard } from '@/components/order/OrderCard'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { Button } from '@/components/ui/Button'
import { SignOutButton } from '@/components/layout/SignOutButton'

export const metadata = { title: 'Account' }

export default async function AccountPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/login?next=/account')

    // One fetch each, in parallel. Recent orders reuse the same orders endpoint
    // the history page uses — no second implementation to drift.
    const [ordersResult, addressResult, favouritesResult] = await Promise.all([
        apiFetch('/orders?limit=3', { auth: true }),
        apiFetch('/addresses', { auth: true }),
        apiFetch('/favourites', { auth: true }),
    ])

    const orders = ordersResult.ok
        ? [...ordersResult.data.active, ...ordersResult.data.past].slice(0, 3)
        : []
    const addressCount = addressResult.ok ? addressResult.data.length : 0
    const favourites = favouritesResult.ok ? favouritesResult.data : []

    // Never render "undefined" at someone. Name is required at registration,
    // but older accounts and any future import may not have one.
    const displayName = user.name?.trim() || 'there'
    const initial = (user.name?.trim() || user.email).charAt(0).toUpperCase()

    return (
        <div className="mx-auto max-w-(--container-page) px-4 pb-8 sm:px-6">
            <header className="flex items-center gap-4 pt-8">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-paprika-100 text-xl font-extrabold text-paprika-700">
                    {initial}
                </span>
                <div className="min-w-0">
                    <h1 className="truncate text-[1.5rem] font-extrabold tracking-tight">
                        Hi, {displayName}
                    </h1>
                    <p className="truncate text-[0.95rem] text-ink-500">{user.email}</p>
                    {user.phone && <p className="truncate text-sm text-ink-400">{user.phone}</p>}
                </div>
            </header>

            <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
                <div className="space-y-7">
                    <section>
                        <div className="mb-3 flex items-center justify-between gap-4">
                            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">
                                Recent orders
                            </h2>
                            {orders.length > 0 && (
                                <Link
                                    href="/orders"
                                    className="press flex h-8 items-center gap-0.5 rounded-pill px-2 text-sm font-bold text-paprika-600 hover:bg-paprika-50"
                                >
                                    See all <ChevronRight className="size-4" />
                                </Link>
                            )}
                        </div>

                        {orders.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-sand-300 bg-surface p-6 text-center">
                                <p className="font-bold">No orders yet</p>
                                <p className="mt-1 text-sm text-ink-500">
                                    Your first order will show up here.
                                </p>
                                <Button as={Link} href="/restaurants" size="sm" className="mt-4">
                                    Find food
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map((order) => (
                                    <OrderCard key={order.orderNumber} order={order} showReorder={false} />
                                ))}
                            </div>
                        )}
                    </section>

                    {favourites.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">
                                Your favourites
                            </h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3">
                                {favourites.slice(0, 6).map((restaurant) => (
                                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="space-y-2.5">
                    <AccountLink href="/orders" icon={ReceiptText} label="Your orders" />
                    <AccountLink
                        href="/account/addresses"
                        icon={MapPin}
                        label="Saved addresses"
                        hint={addressCount > 0 ? `${addressCount} saved` : 'Add one'}
                    />
                    <AccountLink
                        href="/account/favourites"
                        icon={Heart}
                        label="Favourites"
                        hint={favourites.length > 0 ? `${favourites.length} saved` : undefined}
                    />
                    <div className="pt-2">
                        <SignOutButton />
                    </div>
                </aside>
            </div>
        </div>
    )
}

function AccountLink({ href, icon: Icon, label, hint }) {
    return (
        <Link
            href={href}
            className="press flex items-center gap-3 rounded-2xl border border-sand-200 bg-surface p-4 hover:border-sand-300 hover:bg-sand-50/60"
        >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sand-100 text-ink-500">
                <Icon className="size-[1.05rem]" strokeWidth={2.1} />
            </span>
            <span className="min-w-0 flex-1 font-bold">{label}</span>
            {hint && <span className="shrink-0 text-sm text-ink-400">{hint}</span>}
            <ChevronRight className="size-4.5 shrink-0 text-ink-400" />
        </Link>
    )
}
