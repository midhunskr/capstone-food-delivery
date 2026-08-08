import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Section({ title, subtitle, href, linkLabel = 'See all', children, className }) {
    return (
        <section className={cn('py-6 sm:py-8', className)}>
            <div className="mb-4 flex items-end justify-between gap-4 px-4 sm:px-6">
                <div className="min-w-0">
                    <h2 className="text-[1.35rem] font-extrabold tracking-tight sm:text-2xl">{title}</h2>
                    {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
                </div>
                {href && (
                    <Link
                        href={href}
                        className="press flex h-9 shrink-0 items-center gap-0.5 rounded-pill pl-3 pr-2 text-sm font-bold text-paprika-600 hover:bg-paprika-50"
                    >
                        {linkLabel}
                        <ChevronRight className="size-4" />
                    </Link>
                )}
            </div>
            {children}
        </section>
    )
}

/**
 * Horizontal rail with edge padding that matches the page gutter, so the first
 * card lines up with headings and the last one can scroll clear of the edge.
 */
export function Rail({ children, itemClassName = 'w-[248px] max-w-[70vw]' }) {
    return (
        <div className="rail gap-4 px-4 pb-2 sm:gap-5 sm:px-6">
            {children.map?.((child, i) => (
                <div key={i} className={itemClassName}>{child}</div>
            )) ?? children}
        </div>
    )
}
