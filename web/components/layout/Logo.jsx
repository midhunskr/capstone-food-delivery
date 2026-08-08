import { product } from '@/config/product'

/**
 * Typographic wordmark. No icon — MORO is short enough to be its own mark, and
 * a confident wordmark reads better at every size than a small illustration.
 * The dot is the only flourish: warm, a little energetic, and it doubles as a
 * full stop after the name.
 */
export function Logo({ className = '' }) {
    return (
        <span
            className={`inline-flex select-none items-baseline text-[1.35rem] font-extrabold leading-none tracking-[-0.03em] text-ink-900 ${className}`}
        >
            {product.name}
            <span className="ml-[0.09em] size-[0.28em] shrink-0 self-end rounded-full bg-paprika-500" aria-hidden />
        </span>
    )
}
