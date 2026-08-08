import Link from 'next/link'
import { BadgePercent, Bike, Ticket } from 'lucide-react'
import { currency } from '@/config/product'

const iconFor = (type) => (type === 'free_delivery' ? Bike : type === 'flat' ? Ticket : BadgePercent)

/**
 * Offers as useful information, not banner advertising: what you get, what it
 * takes to qualify, and where it applies.
 */
export function OfferRail({ offers }) {
    return (
        <div className="rail gap-3.5 px-4 pb-2 sm:px-6">
            {offers.map((offer) => {
                const Icon = iconFor(offer.type)
                const href = offer.restaurant?.slug
                    ? `/restaurants/${offer.restaurant.slug}`
                    : '/restaurants?offers=1'

                return (
                    <Link
                        key={offer.id}
                        href={href}
                        className="press group w-[262px] max-w-[80vw] rounded-card border border-sand-200 bg-surface p-4 shadow-card transition-shadow hover:shadow-lift"
                    >
                        <div className="flex items-start gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paprika-50 text-paprika-600 transition-transform duration-300 group-hover:scale-110">
                                <Icon className="size-5" strokeWidth={2.2} />
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-[1.02rem] font-extrabold leading-tight text-ink-900">
                                    {offer.title}
                                </p>
                                <p className="mt-1 truncate text-sm text-ink-500">
                                    {offer.restaurant?.name ?? 'All restaurants'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-sand-200 pt-3">
                            <span className="text-xs font-medium text-ink-400">
                                {offer.minimumOrder > 0
                                    ? `Above ${currency.format(offer.minimumOrder)}`
                                    : 'No minimum'}
                            </span>
                            {offer.code && (
                                <span className="rounded-md bg-sand-100 px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-ink-600">
                                    {offer.code}
                                </span>
                            )}
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
