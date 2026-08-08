'use client'

import { useMemo, useState } from 'react'
import { Search, SearchX, X } from 'lucide-react'
import { DishRow } from '@/components/dish/DishRow'
import { EmptyState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

/**
 * Menu browsing.
 *
 * Section order comes from the API and is deliberate (signatures first, drinks
 * last) — it is never re-sorted here. Veg and in-menu search filter the
 * already-loaded sections client-side, which is instant and avoids a round trip
 * for a menu that is only ~15 items.
 */
export function Menu({ sections, categories, restaurant }) {
    const [veg, setVeg] = useState(false)
    const [query, setQuery] = useState('')

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()

        return sections
            .map((section) => ({
                ...section,
                items: section.items.filter((item) => {
                    if (veg && !item.isVeg) return false
                    if (!q) return true
                    return item.name.toLowerCase().includes(q) ||
                        (item.description || '').toLowerCase().includes(q)
                }),
            }))
            .filter((section) => section.items.length > 0)
    }, [sections, veg, query])

    const total = filtered.reduce((n, s) => n + s.items.length, 0)
    const jumpTo = (name) => {
        document.getElementById(`section-${slug(name)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
            <div className="sticky top-16 z-20 -mx-4 bg-paper/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
                <div className="flex items-center gap-2.5">
                    <div className="relative flex-1">
                        <label htmlFor="menu-search" className="sr-only">Search this menu</label>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-ink-400" />
                        <input
                            id="menu-search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search this menu"
                            autoComplete="off"
                            className="h-11 w-full rounded-xl border border-sand-200 bg-surface pl-11 pr-10 text-[0.95rem] font-medium outline-none transition-colors focus:border-paprika-300"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                aria-label="Clear menu search"
                                className="press absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-400 hover:bg-sand-100"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setVeg((v) => !v)}
                        aria-pressed={veg}
                        className={cn(
                            'press flex h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-sm font-bold',
                            veg
                                ? 'border-veg bg-veg/8 text-veg'
                                : 'border-sand-200 bg-surface text-ink-600 hover:bg-sand-50',
                        )}
                    >
                        <span className={cn(
                            'grid size-4 place-items-center rounded-[3px] border-[1.5px]',
                            veg ? 'border-veg' : 'border-ink-400',
                        )}>
                            <span className={cn('size-2 rounded-full', veg ? 'bg-veg' : 'bg-ink-400')} />
                        </span>
                        Veg
                    </button>
                </div>

                {categories.length > 1 && !query && (
                    <div className="rail mt-2.5 gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => jumpTo(category.name)}
                                className="press shrink-0 rounded-pill border border-sand-200 bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink-600 hover:border-paprika-300 hover:bg-paprika-50 hover:text-paprika-700"
                            >
                                {category.name}
                                <span className="ml-1.5 text-ink-400">{category.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {total === 0 ? (
                <EmptyState
                    icon={SearchX}
                    title={veg && query ? 'Nothing veg matched that' : veg ? 'No veg dishes here' : `Nothing matched "${query}"`}
                    message="Try a different search, or clear the filters."
                    action={
                        <Button variant="secondary" onClick={() => { setQuery(''); setVeg(false) }}>
                            Clear filters
                        </Button>
                    }
                />
            ) : (
                <div className="pb-8">
                    {filtered.map((section) => (
                        <section key={section.category} id={`section-${slug(section.category)}`} className="scroll-mt-36 pt-8">
                            <h2 className="flex items-baseline gap-2 text-xl font-extrabold tracking-tight">
                                {section.category}
                                <span className="text-sm font-semibold text-ink-400">{section.items.length}</span>
                            </h2>

                            <div className="mt-1 divide-y divide-sand-200">
                                {section.items.map((dish) => (
                                    <DishRow key={dish.id} dish={dish} restaurant={restaurant} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    )
}

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
