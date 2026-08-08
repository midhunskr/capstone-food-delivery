import { RailSkeleton } from '@/components/ui/States'

/**
 * Route-level loading. Mirrors the home layout so the page doesn't jump when
 * real content arrives.
 */
export default function Loading() {
    return (
        <div className="mx-auto max-w-(--container-page)">
            <div className="px-4 pb-2 pt-6 sm:px-6 sm:pt-10">
                <div className="skeleton h-4 w-28 rounded" />
                <div className="skeleton mt-3 h-8 w-64 max-w-full rounded" />
                <div className="skeleton mt-5 h-14 w-full max-w-2xl rounded-2xl" />
            </div>

            <div className="px-4 pt-8 sm:px-6">
                <div className="skeleton h-6 w-44 rounded" />
            </div>
            <div className="rail mt-4 gap-4 px-4 sm:px-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-[84px] shrink-0 sm:w-[104px]">
                        <div className="skeleton size-[76px] rounded-full sm:size-24" />
                        <div className="skeleton mx-auto mt-2 h-3 w-14 rounded" />
                    </div>
                ))}
            </div>

            <div className="px-4 pt-10 sm:px-6">
                <div className="skeleton h-6 w-52 rounded" />
            </div>
            <div className="mt-4 px-4 sm:px-6">
                <RailSkeleton />
            </div>
        </div>
    )
}
