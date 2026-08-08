import Link from 'next/link'
import { SmartImage } from '@/components/ui/SmartImage'
import { cuisineImage } from '@/lib/foodImages'

/**
 * Cuisine discovery. Tapping one goes straight into filtered browsing.
 *
 * Photography inside the circle, name below it — never text burned into the
 * image. Rendered at 76–96px, so `sizes` keeps the browser from pulling the
 * 1536px master for a thumbnail.
 */
export function CuisineRail({ cuisines }) {
    return (
        <div className="rail gap-4 px-4 pb-2 sm:gap-6 sm:px-6">
            {cuisines.map((cuisine, index) => {
                const photo = cuisineImage(cuisine.slug)

                return (
                    <Link
                        key={cuisine.id}
                        href={`/restaurants?cuisine=${cuisine.slug}`}
                        className="press group flex w-[84px] flex-col items-center gap-2 sm:w-[104px]"
                    >
                        <div className="relative size-[76px] overflow-hidden rounded-full bg-sand-100 ring-1 ring-sand-200 transition-all duration-300 group-hover:ring-2 group-hover:ring-paprika-300 sm:size-24">
                            <SmartImage
                                src={photo.src}
                                alt={photo.alt || cuisine.name}
                                focus={photo.focus}
                                sizes="(max-width: 640px) 114px, 144px"
                                rounded="rounded-full"
                                // Only the first few are above the fold on any viewport.
                                priority={index < 4}
                                className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                            />
                        </div>
                        <span className="line-clamp-2 text-center text-[0.82rem] font-bold leading-tight text-ink-700 group-hover:text-paprika-600 sm:text-sm">
                            {cuisine.name}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}
