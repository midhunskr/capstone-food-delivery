import { GridSkeleton } from '@/components/ui/States'

export default function Loading() {
    return (
        <div className="mx-auto max-w-(--container-page) px-4 py-8 sm:px-6">
            <div className="skeleton h-8 w-56 rounded" />
            <div className="skeleton mt-2 h-4 w-32 rounded" />
            <div className="mt-6 flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton h-9 w-24 rounded-pill" />
                ))}
            </div>
            <div className="mt-8">
                <GridSkeleton count={8} />
            </div>
        </div>
    )
}
