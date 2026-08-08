export default function Loading() {
    return (
        <div className="mx-auto max-w-(--container-page) px-4 pt-8 sm:px-6">
            <div className="skeleton h-8 w-44 rounded" />
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-sand-200 bg-surface p-4">
                        <div className="flex gap-3">
                            <div className="skeleton size-12 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <div className="skeleton h-4 w-1/2 rounded" />
                                <div className="skeleton h-3 w-3/4 rounded" />
                                <div className="skeleton h-3 w-2/5 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
