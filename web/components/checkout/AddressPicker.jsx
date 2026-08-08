'use client'

import { useState } from 'react'
import { Check, MapPin, Plus } from 'lucide-react'
import { AddressCard, addressTitle, formatAddress, formatRegion } from '@/components/address/AddressCard'
import { AddressForm } from '@/components/address/AddressForm'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { listAddresses } from '@/lib/client'
import { cn } from '@/lib/cn'

/**
 * Delivery address at checkout.
 *
 * Shows the chosen address inline; changing or adding happens in a sheet. If
 * there are no addresses at all, this asks for one up front rather than letting
 * the user get to the payment button and fail there.
 */
export function AddressPicker({ addresses, selectedId, onSelect, onAddressesChanged }) {
    const [picking, setPicking] = useState(false)
    const [adding, setAdding] = useState(false)

    const selected = addresses.find((a) => a.id === selectedId)

    /**
     * The address saved. Select it immediately so checkout can price against it,
     * then reconcile with the server list (which knows the real default).
     * If that refetch fails we still keep the new address on screen rather than
     * dropping the user back to "where should we deliver?".
     */
    const handleSaved = async (created) => {
        setAdding(false)
        setPicking(false)

        onAddressesChanged([...addresses, created])
        onSelect(created.id)

        const result = await listAddresses()
        if (result.ok) onAddressesChanged(result.data)
    }

    if (addresses.length === 0) {
        return (
            <>
                <div className="rounded-2xl border border-dashed border-sand-300 bg-surface p-5 text-center">
                    <span className="mx-auto grid size-11 place-items-center rounded-full bg-sand-100 text-ink-400">
                        <MapPin className="size-5" />
                    </span>
                    <p className="mt-3 font-bold">Where should we deliver?</p>
                    <p className="mt-1 text-sm text-ink-500">Add an address to carry on.</p>
                    <Button className="mt-4" onClick={() => setAdding(true)}>Add an address</Button>
                </div>

                <Sheet open={adding} onClose={() => setAdding(false)} title="Add an address">
                    <AddressForm onSaved={handleSaved} onCancel={() => setAdding(false)} />
                </Sheet>
            </>
        )
    }

    return (
        <>
            <div className="rounded-2xl border border-sand-200 bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
                            Delivering to
                        </p>
                        {selected ? (
                            <>
                                <p className="mt-1 font-extrabold">{addressTitle(selected)}</p>
                                <p className="mt-0.5 text-[0.95rem] leading-relaxed text-ink-600">
                                    {formatAddress(selected)}
                                </p>
                                <p className="text-[0.95rem] text-ink-500">{formatRegion(selected)}</p>
                            </>
                        ) : (
                            <p className="mt-1 text-[0.95rem] text-ink-500">Choose a delivery address</p>
                        )}
                    </div>

                    <Button size="sm" variant="secondary" onClick={() => setPicking(true)}>
                        {selected ? 'Change' : 'Choose'}
                    </Button>
                </div>
            </div>

            <Sheet
                open={picking}
                onClose={() => setPicking(false)}
                title="Choose a delivery address"
                footer={
                    <Button variant="secondary" className="w-full" onClick={() => { setPicking(false); setAdding(true) }}>
                        <Plus className="size-4" strokeWidth={2.6} /> Add a new address
                    </Button>
                }
            >
                <ul className="space-y-2.5">
                    {addresses.map((address) => (
                        <li key={address.id}>
                            <button
                                onClick={() => { onSelect(address.id); setPicking(false) }}
                                className={cn(
                                    'press w-full rounded-2xl text-left',
                                    address.id === selectedId && 'ring-2 ring-paprika-400',
                                )}
                                aria-pressed={address.id === selectedId}
                            >
                                <AddressCard
                                    address={address}
                                    selected={address.id === selectedId}
                                    actions={address.id === selectedId ? (
                                        <span className="inline-flex items-center gap-1 text-sm font-bold text-paprika-600">
                                            <Check className="size-4" strokeWidth={3} /> Selected
                                        </span>
                                    ) : null}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            </Sheet>

            <Sheet open={adding} onClose={() => setAdding(false)} title="Add an address">
                <AddressForm onSaved={handleSaved} onCancel={() => setAdding(false)} />
            </Sheet>
        </>
    )
}
