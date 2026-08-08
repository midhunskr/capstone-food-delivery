import { cn } from '@/lib/cn'

const variants = {
    primary: 'bg-paprika-500 text-white hover:bg-paprika-600 shadow-[0_1px_2px_rgb(28_23_20/0.10)]',
    secondary: 'bg-white text-ink-900 border border-sand-200 hover:border-sand-300 hover:bg-sand-50',
    ghost: 'text-ink-600 hover:bg-sand-100 hover:text-ink-900',
    danger: 'bg-danger text-white hover:brightness-95',
}

const sizes = {
    sm: 'h-9 px-3.5 text-sm gap-1.5',
    md: 'h-11 px-5 text-[0.95rem] gap-2',
    lg: 'h-12 px-6 text-base gap-2',
}

export function Button({
    as: Tag = 'button', variant = 'primary', size = 'md', className, loading, children, ...props
}) {
    return (
        <Tag
            className={cn(
                'press inline-flex items-center justify-center rounded-pill font-semibold',
                'disabled:opacity-55 disabled:pointer-events-none select-none',
                variants[variant], sizes[size], className,
            )}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading && (
                <span
                    aria-hidden
                    className="size-4 rounded-full border-2 border-current border-r-transparent animate-spin"
                />
            )}
            {children}
        </Tag>
    )
}
