import { DishRowSkeleton } from '@/components/ui/States'

export default function Loading() {
    return (
        <div>
            <div className="skeleton h-44 w-full sm:h-60 lg:h-72" />
            <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
                <div className="-mt-10 rounded-3xl bg-surface p-5 shadow-lift sm:-mt-14 sm:p-6">
                    <div className="skeleton h-7 w-52 rounded" />
                    <div className="skeleton mt-2 h-4 w-40 rounded" />
                    <div className="skeleton mt-5 h-16 w-full rounded-2xl" />
                </div>
                <div className="mt-8 divide-y divide-sand-200">
                    {Array.from({ length: 5 }).map((_, i) => <DishRowSkeleton key={i} />)}
                </div>
            </div>
        </div>
    )
}
