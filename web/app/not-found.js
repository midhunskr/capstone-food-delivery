import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
    return (
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
            <p className="text-5xl">🍽️</p>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
                We couldn&apos;t find that page
            </h1>
            <p className="mt-2 text-[0.95rem] text-ink-500">
                It might have moved, or the link might be off. Let&apos;s get you back to the food.
            </p>
            <div className="mt-7 flex gap-3">
                <Button as={Link} href="/">Go home</Button>
                <Button as={Link} href="/restaurants" variant="secondary">Browse restaurants</Button>
            </div>
        </div>
    )
}
