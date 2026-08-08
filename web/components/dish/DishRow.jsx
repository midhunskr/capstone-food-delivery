import { SmartImage } from '@/components/ui/SmartImage'
import { Rating, VegMark, Badge } from '@/components/ui/Bits'
import { currency } from '@/config/product'
import { dishImage } from '@/lib/foodImages'
import { AddControl } from './AddControl'
import { cn } from '@/lib/cn'

/**
 * Menu row.
 *
 * The row is always information-left, action-right. The action column holds a
 * photograph with Add anchored to it when we have one, and just Add when we
 * don't — the control stays the same compact size either way.
 *
 * Not every dish has an honest photograph, and inventing one would be worse
 * than going without. So the image-free row is a designed state: same rhythm,
 * same action position, no empty slot where a picture used to be.
 */
export function DishRow({ dish, restaurant }) {
    const { name, description, price, isVeg, isAvailable, isBestseller, isPopular, rating } = dish
    const photo = dishImage(name)

    return (
        <article className={cn('flex items-start gap-4 py-5 sm:gap-6', !isAvailable && 'opacity-60')}>
            <div className="min-w-0 flex-1">
                <VegMark isVeg={isVeg} />

                {(isBestseller || isPopular) && (
                    <div className="mt-1.5">
                        <Badge tone="gold">{isBestseller ? '★ Bestseller' : 'Popular'}</Badge>
                    </div>
                )}

                <h3 className="mt-1.5 text-[1.02rem] font-bold leading-snug text-ink-900">{name}</h3>

                <p className="mt-1 font-semibold tabular-nums text-ink-700">{currency.format(price)}</p>

                {rating.count >= 5 && (
                    <div className="mt-1.5">
                        <Rating average={rating.average} count={rating.count} />
                    </div>
                )}

                {description && (
                    <p className="mt-2 line-clamp-2 max-w-prose text-sm leading-relaxed text-ink-500">
                        {description}
                    </p>
                )}
            </div>

            {/* One action column of a fixed width for both states, so every Add
                button lines up in the same place down the whole menu. */}
            <div className="relative flex w-28 shrink-0 justify-center sm:w-32">
                {photo.src ? (
                    <>
                        <div className="relative size-28 overflow-hidden rounded-card bg-sand-100 sm:size-32">
                            <SmartImage
                                src={photo.src}
                                alt={photo.alt}
                                focus={photo.focus}
                                sizes="(max-width: 640px) 168px, 192px"
                            />
                        </div>
                        {/* Overlaps the image bottom edge — the familiar pattern, and it keeps
                            the action visually tied to the dish it belongs to. */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                            <AddControl dish={dish} restaurant={restaurant} disabled={!isAvailable} size="sm" />
                        </div>
                    </>
                ) : (
                    <AddControl dish={dish} restaurant={restaurant} disabled={!isAvailable} size="sm" />
                )}
            </div>
        </article>
    )
}
