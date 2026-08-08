'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MapPin, Plus } from 'lucide-react'
import { AddressCard, addressTitle } from './AddressCard'
import { AddressForm } from './AddressForm'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { deleteAddress, listAddresses, makeAddressDefault } from '@/lib/client'

/**
 * Saved addresses: add, edit, delete, set default.
 *
 * The list is refetched after every mutation rather than patched locally — the
 * server owns the "exactly one default" rule, so it is also the only thing that
 * knows the correct state after a change.
 */
export function AddressManager({ initialAddresses }) {
    const [addresses, setAddresses] = useState(initialAddresses)
    const [editing, setEditing] = useState(null)   // address object, or 'new'
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [busyId, setBusyId] = useState(null)
    const [error, setError] = useState('')

    const refresh = async () => {
        const result = await listAddresses()
        if (result.ok) setAddresses(result.data)
    }

    const handleSaved = async () => {
        setEditing(null)
        await refresh()
    }

    const handleDelete = async () => {
        const target = confirmDelete
        setConfirmDelete(null)
        setBusyId(target.id)
        setError('')

        const result = await deleteAddress(target.id)
        if (!result.ok) setError(result.error?.message || "We couldn't remove that address. Try again.")
        await refresh()
        setBusyId(null)
    }

    const handleDefault = async (address) => {
        setBusyId(address.id)
        setError('')
        const result = await makeAddressDefault(address.id)
        if (!result.ok) setError(result.error?.message || "We couldn't update that. Try again.")
        await refresh()
        setBusyId(null)
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-[1.6rem] font-extrabold tracking-tight sm:text-3xl">Saved addresses</h1>
                {addresses.length > 0 && (
                    <Button size="sm" onClick={() => setEditing('new')}>
                        <Plus className="size-4" strokeWidth={2.6} /> Add
                    </Button>
                )}
            </div>

            {error && (
                <p role="alert" className="mt-4 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
                    {error}
                </p>
            )}

            {addresses.length === 0 ? (
                <EmptyState
                    icon={MapPin}
                    title="No addresses yet"
                    message="Add one and checkout gets a lot quicker next time."
                    action={<Button onClick={() => setEditing('new')}>Add an address</Button>}
                />
            ) : (
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    <AnimatePresence initial={false}>
                        {addresses.map((address) => (
                            <motion.li
                                key={address.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className={busyId === address.id ? 'pointer-events-none opacity-60' : ''}
                            >
                                <AddressCard
                                    address={address}
                                    actions={
                                        <>
                                            <TextAction onClick={() => setEditing(address)}>Edit</TextAction>
                                            <Dot />
                                            <TextAction onClick={() => setConfirmDelete(address)}>Delete</TextAction>
                                            {!address.isDefault && (
                                                <>
                                                    <Dot />
                                                    <TextAction onClick={() => handleDefault(address)}>
                                                        Set as default
                                                    </TextAction>
                                                </>
                                            )}
                                        </>
                                    }
                                />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}

            <Sheet
                open={editing !== null}
                onClose={() => setEditing(null)}
                title={editing && editing !== 'new' ? 'Edit address' : 'Add an address'}
            >
                {editing !== null && (
                    <AddressForm
                        address={editing === 'new' ? null : editing}
                        onSaved={handleSaved}
                        onCancel={() => setEditing(null)}
                    />
                )}
            </Sheet>

            <Sheet
                open={confirmDelete !== null}
                onClose={() => setConfirmDelete(null)}
                title="Remove this address?"
                footer={
                    <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
                        <Button variant="secondary" className="flex-1" onClick={() => setConfirmDelete(null)}>
                            Keep it
                        </Button>
                        <Button variant="danger" className="flex-1" onClick={handleDelete}>
                            Remove
                        </Button>
                    </div>
                }
            >
                <p className="py-1 text-[0.98rem] text-ink-600">
                    {confirmDelete && `Your ${addressTitle(confirmDelete).toLowerCase()} address will be removed from your account.`}
                </p>
            </Sheet>
        </div>
    )
}

function TextAction({ onClick, children }) {
    return (
        <button
            onClick={onClick}
            className="press inline-flex h-8 items-center rounded-lg px-2 text-sm font-bold text-paprika-600 hover:bg-paprika-50"
        >
            {children}
        </button>
    )
}

function Dot() {
    return <span className="text-sand-300" aria-hidden>·</span>
}
