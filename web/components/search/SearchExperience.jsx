'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Search, SearchX, Store, UtensilsCrossed, X } from 'lucide-react'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { DishCard } from '@/components/dish/DishCard'
import { EmptyState, GridSkeleton } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const POPULAR = ['Biryani', 'Kerala parotta', 'Shawarma', 'Pizza', 'Dosa', 'Burger', 'Fried rice']

/**
 * The search screen owns three states: idle (suggestions to get started),
 * typing (debounced suggestions under the input), and results.
 *
 * Suggestions and results both come from the backend; nothing is matched
 * client-side. The query lives in the URL so a search can be shared or
 * revisited with the back button.
 */
export function SearchExperience({ initialQuery, initialResults, cuisines }) {
    const router = useRouter()
    const params = useSearchParams()

    const [value, setValue] = useState(initialQuery)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [loading, setLoading] = useState(false)
    const results = initialResults
    const inputRef = useRef(null)
    const boxRef = useRef(null)

    // No effect syncs props into state: the page mounts this with key={query}, so
    // a new search remounts the component and initial state is always correct.

    // Debounced suggestions. 220ms is short enough to feel instant while still
    // collapsing a burst of keystrokes into one request.
    useEffect(() => {
        const q = value.trim()

        const timer = setTimeout(async () => {
            if (q.length < 2) {
                setSuggestions([])
                return
            }
            try {
                const res = await fetch(`/api/proxy/search/suggest?q=${encodeURIComponent(q)}`)
                const json = await res.json()
                if (json.ok) setSuggestions(json.data.suggestions)
            } catch {
                setSuggestions([])
            }
        }, 220)

        return () => clearTimeout(timer)
    }, [value])

    useEffect(() => {
        const onClick = (e) => { if (!boxRef.current?.contains(e.target)) setShowSuggestions(false) }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    const runSearch = (q) => {
        setShowSuggestions(false)
        inputRef.current?.blur()
        if (!q.trim()) return
        setLoading(true)
        router.push(`/search?q=${encodeURIComponent(q.trim())}`)
    }

    const pickSuggestion = (suggestion) => {
        if (suggestion.type === 'restaurant') {
            setShowSuggestions(false)
            router.push(`/restaurants/${suggestion.slug}`)
            return
        }
        if (suggestion.type === 'cuisine') {
            setShowSuggestions(false)
            router.push(`/restaurants?cuisine=${suggestion.slug}`)
            return
        }
        setValue(suggestion.label)
        runSearch(suggestion.label)
    }

    const query = params.get('q') ?? ''
    const hasResults = results &&
        (results.restaurants.length > 0 || results.dishes.length > 0 || results.cuisines.length > 0)

    return (
        <div className="mx-auto max-w-(--container-page)">
            <div className="sticky top-16 z-30 border-b border-sand-200 bg-paper/95 px-4 py-3 backdrop-blur-md sm:px-6">
                <div ref={boxRef} className="relative flex items-center gap-2">
                    <Link
                        href="/"
                        aria-label="Back to home"
                        className="press grid size-10 shrink-0 place-items-center rounded-full text-ink-600 hover:bg-sand-100 md:hidden"
                    >
                        <ArrowLeft className="size-5" />
                    </Link>

                    <form
                        role="search"
                        onSubmit={(e) => { e.preventDefault(); runSearch(value) }}
                        className="relative flex-1"
                    >
                        <label htmlFor="search-input" className="sr-only">Search restaurants and dishes</label>
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-400" />
                        <input
                            id="search-input"
                            ref={inputRef}
                            value={value}
                            autoFocus={!initialQuery}
                            autoComplete="off"
                            onChange={(e) => { setValue(e.target.value); setShowSuggestions(true) }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Search for a dish or restaurant"
                            className="h-12 w-full rounded-2xl border border-sand-200 bg-surface pl-12 pr-11 text-base font-medium shadow-card outline-none transition-colors focus:border-paprika-300"
                        />
                        {value && (
                            <button
                                type="button"
                                onClick={() => { setValue(''); inputRef.current?.focus() }}
                                aria-label="Clear search"
                                className="press absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-400 hover:bg-sand-100"
                            >
                                <X className="size-4.5" />
                            </button>
                        )}
                    </form>

                    <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                            <motion.ul
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-10 overflow-hidden rounded-2xl border border-sand-200 bg-surface py-1.5 shadow-lift"
                            >
                                {suggestions.map((suggestion, i) => (
                                    <li key={`${suggestion.type}-${suggestion.label}-${i}`}>
                                        <button
                                            onClick={() => pickSuggestion(suggestion)}
                                            className="press flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-sand-50"
                                        >
                                            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sand-100 text-ink-500">
                                                {suggestion.type === 'restaurant'
                                                    ? <Store className="size-4" />
                                                    : suggestion.type === 'cuisine'
                                                        ? <UtensilsCrossed className="size-4" />
                                                        : <Search className="size-4" />}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate font-semibold">{suggestion.label}</span>
                                                <span className="text-xs capitalize text-ink-400">{suggestion.type}</span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="px-4 py-6 sm:px-6">
                {loading ? (
                    <GridSkeleton count={6} />
                ) : !query ? (
                    <IdleState cuisines={cuisines} onPick={(term) => { setValue(term); runSearch(term) }} />
                ) : !hasResults ? (
                    <EmptyState
                        icon={SearchX}
                        title={`No matches for "${query}"`}
                        message="Try another dish or restaurant — or check the spelling."
                        action={<Button as={Link} href="/restaurants" variant="secondary">Browse all restaurants</Button>}
                    />
                ) : (
                    <div className="space-y-10">
                        {results.cuisines.length > 0 && (
                            <section>
                                <SectionHeading>Cuisines</SectionHeading>
                                <div className="flex flex-wrap gap-2">
                                    {results.cuisines.map((c) => (
                                        <Link
                                            key={c.id}
                                            href={`/restaurants?cuisine=${c.slug}`}
                                            className="press rounded-pill border border-sand-200 bg-surface px-4 py-2 text-sm font-bold hover:border-paprika-300 hover:bg-paprika-50 hover:text-paprika-700"
                                        >
                                            {c.name}
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.restaurants.length > 0 && (
                            <section>
                                <SectionHeading count={results.restaurants.length}>Restaurants</SectionHeading>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
                                    {results.restaurants.map((r) => (
                                        <RestaurantCard key={r.id} restaurant={r} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.dishes.length > 0 && (
                            <section>
                                <SectionHeading count={results.dishes.length}>Dishes</SectionHeading>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
                                    {results.dishes.map((d) => <DishCard key={d.id} dish={d} />)}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function SectionHeading({ children, count }) {
    return (
        <h2 className="mb-4 flex items-baseline gap-2 text-lg font-extrabold tracking-tight">
            {children}
            {count !== undefined && <span className="text-sm font-semibold text-ink-400">{count}</span>}
        </h2>
    )
}

function IdleState({ cuisines, onPick }) {
    return (
        <div className="space-y-9">
            <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">Popular searches</h2>
                <div className="flex flex-wrap gap-2">
                    {POPULAR.map((term) => (
                        <button
                            key={term}
                            onClick={() => onPick(term)}
                            className={cn(
                                'press rounded-pill border border-sand-200 bg-surface px-4 py-2 text-sm font-semibold',
                                'hover:border-paprika-300 hover:bg-paprika-50 hover:text-paprika-700',
                            )}
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </section>

            {cuisines.length > 0 && (
                <section>
                    <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">Browse by cuisine</h2>
                    <div className="flex flex-wrap gap-2">
                        {cuisines.map((c) => (
                            <Link
                                key={c.id}
                                href={`/restaurants?cuisine=${c.slug}`}
                                className="press rounded-pill border border-sand-200 bg-surface px-4 py-2 text-sm font-semibold hover:border-paprika-300 hover:bg-paprika-50 hover:text-paprika-700"
                            >
                                {c.name}
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
