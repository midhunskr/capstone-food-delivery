'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

const rotating = ['biryani', 'Kerala parotta', 'shawarma', 'filter coffee', 'pizza']

/**
 * Home search entry. It is a real input on desktop and a large tap target on
 * mobile; submitting hands off to /search, which owns the actual search UI.
 * The rotating placeholder hints at what is worth typing without shouting.
 */
export function SearchLauncher() {
    const router = useRouter()
    const [value, setValue] = useState('')
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (media.matches) return
        const timer = setInterval(() => setIndex((i) => (i + 1) % rotating.length), 2800)
        return () => clearInterval(timer)
    }, [])

    const submit = (event) => {
        event.preventDefault()
        const q = value.trim()
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
    }

    return (
        <form onSubmit={submit} role="search" className="relative">
            <label htmlFor="home-search" className="sr-only">Search for a dish or restaurant</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-400" />
            <input
                id="home-search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Search "${rotating[index]}"`}
                autoComplete="off"
                className="h-14 w-full rounded-2xl border border-sand-200 bg-surface pl-12 pr-24 text-base font-medium shadow-card outline-none transition-all duration-200 placeholder:text-ink-400 focus:border-paprika-300 focus:shadow-lift"
            />
            <button
                type="submit"
                className="press absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl bg-paprika-500 px-4 text-sm font-bold text-white hover:bg-paprika-600"
            >
                Search
            </button>
        </form>
    )
}
