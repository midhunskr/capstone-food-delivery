import { Bike, Clock, MapPin, Star } from 'lucide-react'
import { SmartImage } from '@/components/ui/SmartImage'
import { Badge } from '@/components/ui/Bits'
import { FavouriteButton } from './FavouriteButton'
import { restaurantImage } from '@/lib/foodImages'
import { currency } from '@/config/product'

const cuisineLabel = (slugs = []) =>
    slugs.map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())).join(', ')

/**
 * Restaurant identity in one compact block: who they are, how good, how fast,
 * how much, and what's on offer. Deliberately not a big outlined info panel —
 * the facts are read as a single line of stats.
 */
export function RestaurantHero({ restaurant, isFavourite = false, isSignedIn = false }) {
    const {
        name, slug, cuisines, area, city, rating, priceForTwo,
        deliveryTimeMinutes, deliveryFee, freeDeliveryAbove, description, offers, isVegOnly,
    } = restaurant

    // Same master as the restaurant card, cropped wide — one visual identity
    // across every surface.
    const photo = restaurantImage(slug)

    return (
        // Bottom padding reserves room for the card's drop shadow. Whatever
        // follows starts immediately after the hero, and the menu's sticky bar
        // is full-bleed, opaque and above this card — with no clearance it
        // paints straight over the shadow and cuts it off in a hard line.
        <header className="pb-7">
            <div className="relative h-44 w-full overflow-hidden bg-sand-200 sm:h-60 lg:h-72">
                <SmartImage
                    src={photo.src}
                    alt={photo.alt || name}
                    focus={photo.focus}
                    sizes="100vw"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
            </div>

            <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
                {/* The cover above is position:relative, so it paints over any
                    non-positioned sibling. Without its own position + z-index this
                    card's overlapping strip — the name, the favourite button and
                    the top of its shadow — is drawn behind the photograph. */}
                <div className="relative z-10 -mt-10 rounded-3xl bg-surface p-5 shadow-lift sm:-mt-14 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-[1.5rem] font-extrabold leading-tight tracking-tight sm:text-3xl">
                                {name}
                            </h1>
                            <p className="mt-1 text-[0.95rem] text-ink-500">{cuisineLabel(cuisines)}</p>
                            <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-400">
                                <MapPin className="size-3.5" /> {area}, {city}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            {isVegOnly && (
                                <span className="rounded-lg border border-veg/30 bg-veg/5 px-2 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-veg">
                                    Pure veg
                                </span>
                            )}
                            <FavouriteButton
                                restaurantId={restaurant.id}
                                slug={restaurant.slug}
                                initialIsFavourite={isFavourite}
                                isSignedIn={isSignedIn}
                            />
                        </div>
                    </div>

                    {/* Stat strip — the three things people check before ordering. */}
                    <dl className="mt-5 flex items-stretch gap-0 rounded-2xl bg-sand-50 p-1">
                        <Stat
                            icon={Star}
                            value={rating.count >= 5 ? rating.average.toFixed(1) : 'New'}
                            label={rating.count >= 5 ? `${rating.count.toLocaleString('en-IN')} ratings` : 'No ratings yet'}
                            accent
                        />
                        <Divider />
                        <Stat icon={Clock} value={`${deliveryTimeMinutes} min`} label="Delivery" />
                        <Divider />
                        <Stat
                            icon={Bike}
                            value={deliveryFee === 0 ? 'Free' : currency.format(deliveryFee)}
                            label={freeDeliveryAbove ? `Free above ${currency.format(freeDeliveryAbove)}` : 'Delivery fee'}
                        />
                    </dl>

                    {description && (
                        <p className="mt-4 max-w-prose text-[0.95rem] leading-relaxed text-ink-500">
                            {description}
                        </p>
                    )}

                    <p className="mt-3 text-sm font-medium text-ink-400">
                        {currency.format(priceForTwo)} for two, roughly
                    </p>

                    {offers?.length > 0 && (
                        <div className="mt-5 border-t border-dashed border-sand-200 pt-4">
                            <div className="rail gap-2.5">
                                {offers.map((offer) => (
                                    <div
                                        key={offer.id}
                                        className="flex items-center gap-2.5 rounded-xl border border-paprika-100 bg-paprika-50/60 px-3 py-2.5"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-extrabold text-paprika-700">
                                                {offer.title}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-ink-500">
                                                {offer.minimumOrder > 0
                                                    ? `On orders above ${currency.format(offer.minimumOrder)}`
                                                    : 'No minimum order'}
                                            </p>
                                        </div>
                                        {offer.code && <Badge tone="brand">{offer.code}</Badge>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

function Stat({ icon: Icon, value, label, accent }) {
    return (
        <div className="flex-1 px-2 py-2.5 text-center sm:px-4">
            <dt className="sr-only">{label}</dt>
            <dd>
                <span className={`flex items-center justify-center gap-1 font-extrabold tabular-nums ${accent ? 'text-veg' : 'text-ink-900'}`}>
                    <Icon className={`size-4 ${accent ? 'fill-current' : ''}`} strokeWidth={accent ? 0 : 2.4} />
                    {value}
                </span>
                <span className="mt-0.5 block truncate text-[0.7rem] font-medium text-ink-400">{label}</span>
            </dd>
        </div>
    )
}

function Divider() {
    return <span className="my-2 w-px bg-sand-200" aria-hidden />
}
