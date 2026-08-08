'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { ArrowUpDown, Check, SlidersHorizontal, X } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const SORTS = [
    { value: 'relevance', label: 'Recommended' },
    { value: 'rating', label: 'Rating' },
    { value: 'deliveryTime', label: 'Delivery time' },
    { value: 'priceLow', label: 'Cost: low to high' },
    { value: 'priceHigh', label: 'Cost: high to low' },
]

const RATINGS = [
    { value: '4.5', label: '4.5+' },
    { value: '4', label: '4.0+' },
    { value: '3.5', label: '3.5+' },
]

const TIMES = [
    { value: '25', label: 'Under 25 min' },
    { value: '30', label: 'Under 30 min' },
    { value: '40', label: 'Under 40 min' },
]

const PRICES = [
    { value: '300', label: 'Under ₹300' },
    { value: '500', label: 'Under ₹500' },
    { value: '700', label: 'Under ₹700' },
]

/**
 * Filters live in the URL, not component state. That gets shareable links,
 * a working back button and correct refresh behaviour for free.
 *
 * Quick chips inline for the common filters; everything else in a sheet on
 * mobile and a dialog on desktop. Same state drives both.
 */
export function FilterBar({ cuisines = [], total }) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [sheet, setSheet] = useState(null)

    const push = useCallback((next) => {
        const search = new URLSearchParams(params.toString())
        for (const [key, value] of Object.entries(next)) {
            if (value === null || value === undefined || value === '') search.delete(key)
            else search.set(key, value)
        }
        search.delete('page')
        startTransition(() => router.push(`${pathname}?${search.toString()}`, { scroll: false }))
    }, [params, pathname, router])

    const get = (key) => params.get(key)
    const toggle = (key, value) => push({ [key]: get(key) === value ? null : value })

    const activeCuisines = (get('cuisine') || '').split(',').filter(Boolean)
    const toggleCuisine = (slug) => {
        const next = activeCuisines.includes(slug)
            ? activeCuisines.filter((c) => c !== slug)
            : [...activeCuisines, slug]
        push({ cuisine: next.join(',') || null })
    }

    const activeCount = ['veg', 'rating', 'maxDeliveryTime', 'maxPrice', 'offers', 'freeDelivery']
        .filter((k) => get(k)).length + activeCuisines.length

    const clearAll = () => {
        const search = new URLSearchParams(params.toString())
        for (const key of ['veg', 'rating', 'maxDeliveryTime', 'maxPrice', 'offers', 'freeDelivery', 'cuisine', 'page']) {
            search.delete(key)
        }
        startTransition(() => router.push(`${pathname}?${search.toString()}`, { scroll: false }))
    }

    const sortLabel = SORTS.find((s) => s.value === (get('sort') || 'relevance'))?.label

    return (
        <>
            <div className={cn('transition-opacity', isPending && 'opacity-60')}>
                <div className="rail gap-2 px-4 py-3 sm:px-6">
                    <Chip onClick={() => setSheet('sort')} icon={ArrowUpDown} active={!!get('sort')}>
                        {sortLabel}
                    </Chip>

                    <Chip onClick={() => setSheet('filters')} icon={SlidersHorizontal} active={activeCount > 0}>
                        Filters{activeCount > 0 ? ` (${activeCount})` : ''}
                    </Chip>

                    <span className="mx-1 my-1.5 w-px shrink-0 bg-sand-200" aria-hidden />

                    <Chip onClick={() => toggle('veg', '1')} active={get('veg') === '1'}>Pure veg</Chip>
                    <Chip onClick={() => toggle('offers', '1')} active={get('offers') === '1'}>Offers</Chip>
                    <Chip onClick={() => toggle('rating', '4')} active={get('rating') === '4'}>Rating 4.0+</Chip>
                    <Chip onClick={() => toggle('maxDeliveryTime', '30')} active={get('maxDeliveryTime') === '30'}>
                        Under 30 min
                    </Chip>
                    <Chip onClick={() => toggle('freeDelivery', '1')} active={get('freeDelivery') === '1'}>
                        Free delivery
                    </Chip>

                    {activeCount > 0 && (
                        <button
                            onClick={clearAll}
                            className="press ml-1 flex shrink-0 items-center gap-1 rounded-pill px-3 py-2 text-sm font-bold text-paprika-600 hover:bg-paprika-50"
                        >
                            <X className="size-3.5" strokeWidth={3} /> Clear
                        </button>
                    )}
                </div>
            </div>

            <Sheet open={sheet === 'sort'} onClose={() => setSheet(null)} title="Sort by">
                <ul className="-my-1">
                    {SORTS.map((option) => {
                        const selected = (get('sort') || 'relevance') === option.value
                        return (
                            <li key={option.value}>
                                <button
                                    onClick={() => {
                                        push({ sort: option.value === 'relevance' ? null : option.value })
                                        setSheet(null)
                                    }}
                                    className="press flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-[0.98rem] font-semibold hover:bg-sand-50"
                                >
                                    {option.label}
                                    {selected && <Check className="size-5 text-paprika-500" strokeWidth={3} />}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </Sheet>

            <Sheet
                open={sheet === 'filters'}
                onClose={() => setSheet(null)}
                title="Filters"
                footer={
                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={clearAll}>Clear all</Button>
                        <Button className="flex-1" onClick={() => setSheet(null)}>
                            {total === undefined ? 'Show results' : `Show ${total} places`}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-7">
                    <Group label="Rating">
                        {RATINGS.map((o) => (
                            <Pill key={o.value} active={get('rating') === o.value}
                                onClick={() => toggle('rating', o.value)}>{o.label}</Pill>
                        ))}
                    </Group>

                    <Group label="Delivery time">
                        {TIMES.map((o) => (
                            <Pill key={o.value} active={get('maxDeliveryTime') === o.value}
                                onClick={() => toggle('maxDeliveryTime', o.value)}>{o.label}</Pill>
                        ))}
                    </Group>

                    <Group label="Cost for two">
                        {PRICES.map((o) => (
                            <Pill key={o.value} active={get('maxPrice') === o.value}
                                onClick={() => toggle('maxPrice', o.value)}>{o.label}</Pill>
                        ))}
                    </Group>

                    <Group label="More">
                        <Pill active={get('veg') === '1'} onClick={() => toggle('veg', '1')}>Pure veg</Pill>
                        <Pill active={get('offers') === '1'} onClick={() => toggle('offers', '1')}>Has offers</Pill>
                        <Pill active={get('freeDelivery') === '1'} onClick={() => toggle('freeDelivery', '1')}>
                            Free delivery
                        </Pill>
                    </Group>

                    {cuisines.length > 0 && (
                        <Group label="Cuisine">
                            {cuisines.map((c) => (
                                <Pill key={c.slug} active={activeCuisines.includes(c.slug)}
                                    onClick={() => toggleCuisine(c.slug)}>{c.name}</Pill>
                            ))}
                        </Group>
                    )}
                </div>
            </Sheet>
        </>
    )
}

function Chip({ children, onClick, active, icon: Icon }) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'press flex shrink-0 items-center gap-1.5 rounded-pill border px-3.5 py-2 text-sm font-semibold',
                active
                    ? 'border-paprika-300 bg-paprika-50 text-paprika-700'
                    : 'border-sand-200 bg-surface text-ink-600 hover:border-sand-300 hover:bg-sand-50',
            )}
        >
            {Icon && <Icon className="size-4" strokeWidth={2.2} />}
            {children}
        </button>
    )
}

function Group({ label, children }) {
    return (
        <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">{label}</h3>
            <div className="flex flex-wrap gap-2">{children}</div>
        </div>
    )
}

function Pill({ children, active, onClick }) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'press rounded-pill border px-3.5 py-2 text-sm font-semibold',
                active
                    ? 'border-paprika-400 bg-paprika-50 text-paprika-700'
                    : 'border-sand-200 text-ink-600 hover:border-sand-300 hover:bg-sand-50',
            )}
        >
            {children}
        </button>
    )
}
