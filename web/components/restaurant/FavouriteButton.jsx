'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { toggleFavourite } from '@/lib/client'
import { cn } from '@/lib/cn'

/**
 * Favourite toggle.
 *
 * Flips optimistically so the tap feels instant, and reverts if the server
 * disagrees. Signed-out visitors are sent to sign in and returned here.
 */
export function FavouriteButton({ restaurantId, slug, initialIsFavourite, isSignedIn }) {
    const router = useRouter()
    const [isFavourite, setIsFavourite] = useState(initialIsFavourite)
    const [busy, setBusy] = useState(false)

    const toggle = async () => {
        if (!isSignedIn) {
            router.push(`/login?next=/restaurants/${slug}`)
            return
        }
        if (busy) return

        const next = !isFavourite
        setIsFavourite(next)
        setBusy(true)

        const result = await toggleFavourite(restaurantId)
        if (!result.ok) setIsFavourite(!next)
        else setIsFavourite(result.data.isFavourite)

        setBusy(false)
        router.refresh()
    }

    return (
        <motion.button
            type="button"
            onClick={toggle}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 420, damping: 17 }}
            aria-pressed={isFavourite}
            aria-label={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
            className={cn(
                'grid size-10 shrink-0 place-items-center rounded-full border transition-colors',
                isFavourite
                    ? 'border-paprika-200 bg-paprika-50 text-paprika-600'
                    : 'border-sand-200 bg-surface text-ink-400 hover:text-paprika-500',
            )}
        >
            <motion.span
                key={String(isFavourite)}
                initial={{ scale: isFavourite ? 0.6 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
                <Heart className={cn('size-5', isFavourite && 'fill-current')} strokeWidth={2.2} />
            </motion.span>
        </motion.button>
    )
}
