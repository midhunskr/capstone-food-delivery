import { Briefcase, Home, MapPin } from 'lucide-react'
import { cn } from '@/lib/cn'

const ICONS = { home: Home, work: Briefcase, other: MapPin }

export const formatAddress = (a) =>
    [a.addressLine1, a.addressLine2, a.area].filter(Boolean).join(', ')

export const formatRegion = (a) =>
    `${[a.city, a.state].filter(Boolean).join(', ')} ${a.postalCode}`.trim()

export const addressTitle = (a) =>
    a.label === 'other' ? (a.customLabel || 'Other') : a.label === 'work' ? 'Work' : 'Home'

/**
 * Address card. The address itself is the headline; the label and metadata sit
 * around it. Actions are passed in so the same card works on the account page
 * and inside the checkout picker.
 */
export function AddressCard({ address, selected, className, actions }) {
    const Icon = ICONS[address.label] ?? MapPin

    return (
        <div className={cn(
            'rounded-2xl border bg-surface p-4 transition-colors',
            selected ? 'border-paprika-400 ring-1 ring-paprika-200' : 'border-sand-200',
            className,
        )}>
            <div className="flex items-start gap-3">
                <span className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-xl',
                    selected ? 'bg-paprika-50 text-paprika-600' : 'bg-sand-100 text-ink-500',
                )}>
                    <Icon className="size-[1.05rem]" strokeWidth={2.1} />
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-extrabold">{addressTitle(address)}</p>
                        {address.isDefault && (
                            <span className="rounded-md bg-sand-100 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink-500">
                                Default
                            </span>
                        )}
                    </div>

                    {address.recipientName && (
                        <p className="mt-1 text-sm font-semibold text-ink-600">{address.recipientName}</p>
                    )}

                    <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-600">
                        {formatAddress(address)}
                    </p>
                    <p className="text-[0.95rem] text-ink-500">{formatRegion(address)}</p>

                    {address.landmark && (
                        <p className="mt-1 text-sm text-ink-400">Near {address.landmark}</p>
                    )}
                    {address.phone && (
                        <p className="mt-1 text-sm text-ink-400">{address.phone}</p>
                    )}
                </div>
            </div>

            {actions && <div className="mt-3 flex flex-wrap items-center gap-1 pl-12">{actions}</div>}
        </div>
    )
}
