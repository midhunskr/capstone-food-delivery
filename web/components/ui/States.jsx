import { cn } from '@/lib/cn'
import { Button } from './Button'

/** Skeletons deliberately mirror the real card so nothing jumps when data lands. */
export function RestaurantCardSkeleton() {
    return (
        <div className="w-full">
            <div className="skeleton aspect-[4/3] w-full rounded-card" />
            <div className="mt-3 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
            </div>
        </div>
    )
}

export function DishRowSkeleton() {
    return (
        <div className="flex gap-4 py-5">
            <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-2/5 rounded" />
                <div className="skeleton h-3 w-1/4 rounded" />
                <div className="skeleton h-3 w-4/5 rounded" />
            </div>
            <div className="skeleton size-28 shrink-0 rounded-card" />
        </div>
    )
}

export function RailSkeleton({ count = 4 }) {
    return (
        <div className="rail gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="w-[260px] max-w-[72vw]">
                    <RestaurantCardSkeleton />
                </div>
            ))}
        </div>
    )
}

export function GridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
        </div>
    )
}

export function EmptyState({ icon: Icon, title, message, action, className }) {
    return (
        <div className={cn('flex flex-col items-center px-6 py-16 text-center', className)}>
            {Icon && (
                <div className="mb-4 grid size-14 place-items-center rounded-full bg-sand-100 text-ink-400">
                    <Icon className="size-7" strokeWidth={1.75} />
                </div>
            )}
            <h3 className="text-lg font-bold text-ink-900">{title}</h3>
            {message && <p className="mt-1.5 max-w-sm text-[0.95rem] text-ink-500">{message}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    )
}

/** Error copy is written for a person, never echoing an HTTP status. */
export function ErrorState({ title = "That didn't load", message, onRetry, retryHref }) {
    return (
        <EmptyState
            title={title}
            message={message || 'Something went wrong on our side. Give it another go.'}
            action={
                retryHref
                    ? <Button as="a" href={retryHref} variant="secondary">Try again</Button>
                    : onRetry
                        ? <Button onClick={onRetry} variant="secondary">Try again</Button>
                        : null
            }
        />
    )
}
