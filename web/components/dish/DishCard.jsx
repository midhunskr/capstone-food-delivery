import Link from 'next/link'
import { SmartImage } from '@/components/ui/SmartImage'
import { Rating, VegMark } from '@/components/ui/Bits'
import { currency } from '@/config/product'
import { dishImage } from '@/lib/foodImages'
import { AddControl } from './AddControl'
import { cn } from '@/lib/cn'

/**
 * Dish shown away from its own menu (home rails, search results), so it names
 * the restaurant and links there.
 *
 * Without a photograph the card keeps its footprint but leads with the dish
 * name on a warm tinted panel — deliberate, and still scannable in a rail
 * alongside cards that do have photography.
 */
export function DishCard({ dish, className }) {
    const { name, price, isVeg, isAvailable, rating, restaurant } = dish
    const photo = dishImage(name)

    return (
        <article className={cn('group', className)}>
            <div className="relative aspect-square overflow-hidden rounded-card bg-sand-100 shadow-card">
                {photo.src ? (
                    <SmartImage
                        src={photo.src}
                        alt={photo.alt}
                        focus={photo.focus}
                        sizes="(max-width: 640px) 68vw, 330px"
                        className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-br from-sand-100 to-sand-200 p-3">
                        <p className="line-clamp-3 text-[0.95rem] font-extrabold leading-snug text-ink-600">
                            {name}
                        </p>
                    </div>
                )}

                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                    <AddControl dish={dish} restaurant={restaurant} disabled={!isAvailable} size="sm" />
                </div>
            </div>

            <div className="mt-5 px-0.5">
                <div className="flex items-start gap-1.5">
                    <VegMark isVeg={isVeg} className="mt-0.5" />
                    <h3 className="line-clamp-1 flex-1 text-[0.95rem] font-bold leading-snug">{name}</h3>
                </div>

                <p className="mt-1 font-semibold tabular-nums text-ink-700">{currency.format(price)}</p>

                {restaurant && (
                    <Link
                        href={`/restaurants/${restaurant.slug}`}
                        className="press mt-0.5 flex min-h-6 items-center truncate py-1 text-sm text-ink-400 hover:text-paprika-600"
                    >
                        {restaurant.name}
                    </Link>
                )}

                {rating.count >= 5 && (
                    <div className="mt-1.5">
                        <Rating average={rating.average} count={rating.count} showCount={false} />
                    </div>
                )}
            </div>
        </article>
    )
}
