import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Rating pill. Fewer than 5 ratings shows "New" — a 5.0 from one review is noise. */
export function Rating({ average, count, size = 'sm', showCount = true }) {
    if (!count || count < 5) {
        return (
            <span className="inline-flex items-center rounded-md bg-sand-100 px-1.5 py-0.5 text-xs font-semibold text-ink-500">
                New
            </span>
        )
    }

    const tone = average >= 4.0 ? 'bg-veg text-white' : 'bg-gold-500 text-white'

    return (
        <span className="inline-flex items-center gap-1">
            <span className={cn(
                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-bold tabular-nums',
                tone, size === 'sm' ? 'text-xs' : 'text-sm',
            )}>
                <Star className="size-3 fill-current" strokeWidth={0} />
                {average.toFixed(1)}
            </span>
            {showCount && (
                <span className="text-xs text-ink-400">
                    ({count > 999 ? `${(count / 1000).toFixed(1)}k` : count})
                </span>
            )}
        </span>
    )
}

/** The square veg/non-veg mark used across Indian menus. Instantly recognised. */
export function VegMark({ isVeg, className }) {
    const color = isVeg ? 'border-veg' : 'border-nonveg'
    const dot = isVeg ? 'bg-veg' : 'bg-nonveg'
    return (
        <span
            className={cn('inline-grid size-4 shrink-0 place-items-center rounded-[3px] border-[1.5px]', color, className)}
            role="img"
            aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
        >
            <span className={cn('size-2 rounded-full', dot)} />
        </span>
    )
}

export function Badge({ children, tone = 'neutral', className }) {
    const tones = {
        neutral: 'bg-sand-100 text-ink-600',
        gold: 'bg-gold-100 text-gold-700',
        brand: 'bg-paprika-50 text-paprika-700',
    }
    return (
        <span className={cn(
            'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide',
            tones[tone], className,
        )}>
            {children}
        </span>
    )
}

export function Dot() {
    return <span className="text-ink-300" aria-hidden>·</span>
}
