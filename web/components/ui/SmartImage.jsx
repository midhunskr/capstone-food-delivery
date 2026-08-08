'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * Every photograph in the product goes through here.
 *
 * Callers decide *whether* there is an image (see lib/foodImages.js) — this
 * only handles rendering one: the load transition, the crop, and the rare case
 * of a file failing to load, which degrades to a warm tinted block rather than
 * a torn-image icon.
 *
 * `focus` maps to object-position, for the few masters where a centre crop
 * would cut the defining part of the dish.
 */
export function SmartImage({ src, alt, fill = true, sizes, className, rounded = '', priority, focus }) {
    const [state, setState] = useState(src ? 'loading' : 'error')

    const initial = (alt || '?').trim().charAt(0).toUpperCase()

    if (state === 'error') {
        return (
            <div
                className={cn(
                    'absolute inset-0 grid place-items-center bg-gradient-to-br from-sand-100 to-sand-200',
                    rounded, className,
                )}
                aria-hidden
            >
                <span className="text-2xl font-bold text-ink-400/70">{initial}</span>
            </div>
        )
    }

    return (
        <>
            {state === 'loading' && (
                <div className={cn('absolute inset-0 skeleton', rounded)} aria-hidden />
            )}
            <Image
                src={src}
                alt={alt}
                fill={fill}
                sizes={sizes}
                priority={priority}
                loading={priority ? undefined : 'lazy'}
                style={focus ? { objectPosition: focus } : undefined}
                onLoad={() => setState('loaded')}
                onError={() => setState('error')}
                className={cn(
                    'object-cover transition-opacity duration-300',
                    state === 'loading' ? 'opacity-0' : 'opacity-100',
                    rounded, className,
                )}
            />
        </>
    )
}
