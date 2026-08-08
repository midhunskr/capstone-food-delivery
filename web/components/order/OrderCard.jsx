import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { currency } from '@/config/product'
import { SmartImage } from '@/components/ui/SmartImage'
import { restaurantImage } from '@/lib/foodImages'
import { StatusBadge } from './OrderStatus'
import { ReorderButton } from './ReorderButton'

const formatWhen = (iso) => {
    const date = new Date(iso)
    const today = new Date()
    const sameDay = date.toDateString() === today.toDateString()
    const time = date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
    if (sameDay) return `Today, ${time}`
    return `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${time}`
}

/**
 * One order in the history list — enough to recognise it at a glance, not a
 * transaction row.
 */
export function OrderCard({ order, showReorder = true }) {
    // Same identity the restaurant carries everywhere else.
    const photo = restaurantImage(order.restaurant.slug)

    return (
        <article className="rounded-2xl border border-sand-200 bg-surface">
            <Link
                href={`/orders/${order.orderNumber}`}
                className="press flex items-start gap-3 p-4 hover:bg-sand-50/60"
            >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-sand-100">
                    <SmartImage
                        src={photo.src}
                        alt={photo.alt || order.restaurant.name}
                        focus={photo.focus}
                        sizes="72px"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-extrabold">{order.restaurant.name}</h3>
                        <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-sm text-ink-500">{order.itemsSummary}</p>
                    <p className="mt-1 text-sm text-ink-400">
                        #{order.orderNumber} · {formatWhen(order.placedAt)} ·{' '}
                        <span className="font-semibold text-ink-600">{currency.format(order.total)}</span>
                    </p>
                </div>

                <ChevronRight className="mt-1 size-5 shrink-0 text-ink-400" />
            </Link>

            {showReorder && (
                <div className="border-t border-sand-200 px-4 py-2.5">
                    <ReorderButton
                        orderNumber={order.orderNumber}
                        variant="ghost"
                        className="h-9 px-3 text-sm"
                    />
                </div>
            )}
        </article>
    )
}
