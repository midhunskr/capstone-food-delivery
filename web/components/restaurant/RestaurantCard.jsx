import Link from 'next/link'
import { Clock } from 'lucide-react'
import { SmartImage } from '@/components/ui/SmartImage'
import { restaurantImage } from '@/lib/foodImages'
import { Rating, Dot } from '@/components/ui/Bits'
import { currency } from '@/config/product'
import { cn } from '@/lib/cn'

const cuisineLabel = (slugs = []) =>
    slugs.slice(0, 3).map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())).join(', ')

/**
 * The most-repeated component in the product. Same shape everywhere (home rails,
 * listing grid, search) because the backend returns one restaurant-card DTO.
 *
 * The whole card is one link, so keyboard focus lands once and the entire
 * surface is tappable.
 */
export function RestaurantCard({ restaurant, className, priority }) {
    const { name, slug, cuisines, area, rating, priceForTwo,
        deliveryTimeMinutes, offerLabel, isVegOnly } = restaurant

    const photo = restaurantImage(slug)

    return (
        <Link
            href={`/restaurants/${slug}`}
            className={cn('press group block focus-visible:outline-none', className)}
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-sand-100 shadow-card transition-shadow duration-300 group-hover:shadow-lift group-focus-visible:ring-2 group-focus-visible:ring-paprika-500 group-focus-visible:ring-offset-2">
                <SmartImage
                    src={photo.src}
                    alt={photo.alt || name}
                    focus={photo.focus}
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 45vw, 320px"
                    priority={priority}
                    className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />

                {offerLabel && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/85 via-ink-900/45 to-transparent px-3 pb-2.5 pt-8">
                        <p className="truncate text-[0.95rem] font-extrabold uppercase tracking-tight text-white">
                            {offerLabel}
                        </p>
                    </div>
                )}

                {isVegOnly && (
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-white/95 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-veg shadow-sm">
                        Pure veg
                    </span>
                )}
            </div>

            <div className="mt-3 px-0.5">
                <h3 className="truncate text-[1.02rem] font-bold leading-snug text-ink-900">{name}</h3>

                <div className="mt-1.5 flex items-center gap-1.5">
                    <Rating average={rating.average} count={rating.count} />
                    <Dot />
                    <span className="flex items-center gap-1 text-sm font-medium text-ink-500">
                        <Clock className="size-3.5" strokeWidth={2.2} />
                        {deliveryTimeMinutes} min
                    </span>
                </div>

                <p className="mt-1 truncate text-sm text-ink-400">
                    {cuisineLabel(cuisines)}
                </p>
                <p className="mt-0.5 truncate text-sm text-ink-400">
                    {area} <Dot /> {currency.format(priceForTwo)} for two
                </p>
            </div>
        </Link>
    )
}
