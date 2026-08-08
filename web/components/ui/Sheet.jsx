'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Bottom sheet on mobile, centred dialog from md up. Used for filters and sort.
 *
 * Handles the things a hand-rolled modal usually gets wrong: Escape to close,
 * focus moved in and restored on close, background scroll locked, and a
 * labelled dialog role.
 */
export function Sheet({ open, onClose, title, children, footer }) {
    const panelRef = useRef(null)
    const restoreRef = useRef(null)

    useEffect(() => {
        if (!open) return

        restoreRef.current = document.activeElement
        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'

        const onKey = (event) => {
            if (event.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKey)

        const focusTimer = setTimeout(() => {
            panelRef.current?.querySelector('button, [href], input, select, textarea')?.focus()
        }, 60)

        return () => {
            document.body.style.overflow = overflow
            document.removeEventListener('keydown', onKey)
            clearTimeout(focusTimer)
            restoreRef.current?.focus?.()
        }
    }, [open, onClose])

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
                    <motion.div
                        className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                        className={cn(
                            'relative flex max-h-[88vh] w-full flex-col bg-surface',
                            'rounded-t-3xl md:max-w-lg md:rounded-3xl',
                        )}
                        initial={{ y: '100%', opacity: 1, scale: 1 }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                    >
                        <div className="flex items-center justify-between border-b border-sand-200 px-5 py-4">
                            <h2 className="text-lg font-bold">{title}</h2>
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                className="press grid size-9 place-items-center rounded-full text-ink-500 hover:bg-sand-100"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                            {children}
                        </div>

                        {footer && (
                            <div className="safe-bottom border-t border-sand-200 px-5 py-3">{footer}</div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
