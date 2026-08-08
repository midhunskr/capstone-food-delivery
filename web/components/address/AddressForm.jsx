'use client'

import { useState } from 'react'
import { Briefcase, Home, LocateFixed, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createAddress, updateAddress } from '@/lib/client'
import { cn } from '@/lib/cn'

const LABELS = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'work', label: 'Work', icon: Briefcase },
    { value: 'other', label: 'Other', icon: MapPin },
]

const EMPTY = {
    label: 'home', customLabel: '', recipientName: '', phone: '',
    addressLine1: '', addressLine2: '', area: '', city: 'Kochi',
    state: 'Kerala', postalCode: '', landmark: '',
}

/**
 * Address form.
 *
 * Every field is typed by hand. "Use my current location" only fills the
 * coordinates and never blocks or replaces manual entry — Indian addresses
 * frequently don't geocode cleanly, and "3rd floor, above the medical shop"
 * has to remain possible.
 */
export function AddressForm({ address, onSaved, onCancel }) {
    const [values, setValues] = useState(address ? { ...EMPTY, ...stripNulls(address) } : EMPTY)
    const [coords, setCoords] = useState(
        address?.latitude ? { latitude: address.latitude, longitude: address.longitude } : null)
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState('')
    const [busy, setBusy] = useState(false)
    const [locating, setLocating] = useState(false)

    const set = (key) => (event) => {
        setValues((v) => ({ ...v, [key]: event.target.value }))
        setErrors((e) => ({ ...e, [key]: undefined }))
        setFormError('')
    }

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setFormError("Your browser can't share a location. Type the address instead.")
            return
        }
        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    latitude: Number(position.coords.latitude.toFixed(6)),
                    longitude: Number(position.coords.longitude.toFixed(6)),
                })
                setLocating(false)
            },
            () => {
                setLocating(false)
                setFormError("We couldn't get your location. Type the address instead.")
            },
            { timeout: 8000 },
        )
    }

    const submit = async (event) => {
        event.preventDefault()
        setBusy(true)
        setErrors({})
        setFormError('')

        const payload = { ...trimmed(values), ...(coords ?? {}) }
        if (payload.label !== 'other') delete payload.customLabel

        const result = address
            ? await updateAddress(address.id, payload)
            : await createAddress(payload)

        if (!result.ok) {
            if (result.error?.details) setErrors(result.error.details)
            else setFormError(result.error?.message || "We couldn't save that address. Try again.")
            setBusy(false)
            return
        }

        onSaved(result.data)
    }

    return (
        <form onSubmit={submit} noValidate className="space-y-4">
            {formError && (
                <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
                    {formError}
                </p>
            )}

            <fieldset>
                <legend className="mb-2 text-sm font-bold text-ink-700">Save as</legend>
                <div className="flex gap-2">
                    {LABELS.map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={values.label === value}
                            onClick={() => setValues((v) => ({ ...v, label: value }))}
                            className={cn(
                                'press flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border text-sm font-bold',
                                values.label === value
                                    ? 'border-paprika-400 bg-paprika-50 text-paprika-700'
                                    : 'border-sand-200 text-ink-600 hover:bg-sand-50',
                            )}
                        >
                            <Icon className="size-4" /> {label}
                        </button>
                    ))}
                </div>
            </fieldset>

            {values.label === 'other' && (
                <Field label="Name this address" id="customLabel" error={errors.customLabel}>
                    <input id="customLabel" value={values.customLabel} onChange={set('customLabel')}
                        placeholder="Mum's place" className={inputClass(errors.customLabel)} />
                </Field>
            )}

            <Field label="Flat / house / building" id="addressLine1" error={errors.addressLine1}>
                <input id="addressLine1" value={values.addressLine1} onChange={set('addressLine1')}
                    placeholder="Flat 4B, Palm Grove Apartments" className={inputClass(errors.addressLine1)} />
            </Field>

            <Field label="Street" id="addressLine2" error={errors.addressLine2} hint="Optional">
                <input id="addressLine2" value={values.addressLine2} onChange={set('addressLine2')}
                    placeholder="Chittoor Road" className={inputClass(errors.addressLine2)} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Area" id="area" error={errors.area}>
                    <input id="area" value={values.area} onChange={set('area')}
                        placeholder="Panampilly Nagar" className={inputClass(errors.area)} />
                </Field>
                <Field label="PIN code" id="postalCode" error={errors.postalCode}>
                    <input id="postalCode" value={values.postalCode} onChange={set('postalCode')}
                        inputMode="numeric" maxLength={6} placeholder="682036"
                        className={inputClass(errors.postalCode)} />
                </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" id="city" error={errors.city}>
                    <input id="city" value={values.city} onChange={set('city')} className={inputClass(errors.city)} />
                </Field>
                <Field label="State" id="state" error={errors.state}>
                    <input id="state" value={values.state} onChange={set('state')} className={inputClass(errors.state)} />
                </Field>
            </div>

            <Field label="Landmark" id="landmark" error={errors.landmark} hint="Optional">
                <input id="landmark" value={values.landmark} onChange={set('landmark')}
                    placeholder="Opposite the temple" className={inputClass(errors.landmark)} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Who's receiving" id="recipientName" error={errors.recipientName} hint="Optional">
                    <input id="recipientName" value={values.recipientName} onChange={set('recipientName')}
                        autoComplete="name" className={inputClass(errors.recipientName)} />
                </Field>
                <Field label="Phone" id="phone" error={errors.phone} hint="Optional">
                    <input id="phone" type="tel" value={values.phone} onChange={set('phone')}
                        autoComplete="tel" placeholder="98470 12345" className={inputClass(errors.phone)} />
                </Field>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-sand-50 px-3 py-2.5">
                <button
                    type="button"
                    onClick={useMyLocation}
                    disabled={locating}
                    className="press flex h-9 shrink-0 items-center gap-1.5 rounded-pill bg-surface px-3 text-sm font-bold text-paprika-600 shadow-card disabled:opacity-60"
                >
                    <LocateFixed className={cn('size-4', locating && 'animate-pulse')} />
                    {locating ? 'Finding you…' : 'Use my location'}
                </button>
                <p className="text-xs text-ink-400">
                    {coords ? 'Location pinned to help the rider find you.' : 'Optional — helps the rider find you.'}
                </p>
            </div>

            <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row">
                {onCancel && (
                    <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" className="flex-1" loading={busy} disabled={busy}>
                    {busy ? 'Saving' : address ? 'Save changes' : 'Save address'}
                </Button>
            </div>
        </form>
    )
}

const stripNulls = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined))

const trimmed = (values) =>
    Object.fromEntries(Object.entries(values).map(([k, v]) =>
        [k, typeof v === 'string' ? v.trim() : v]))

const inputClass = (error) => cn(
    'h-12 w-full rounded-xl border bg-surface px-4 font-medium outline-none transition-colors',
    'placeholder:text-ink-400/70',
    error ? 'border-danger focus:border-danger' : 'border-sand-200 focus:border-paprika-400',
)

function Field({ label, id, error, hint, children }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink-700">
                {label}
                {hint && <span className="ml-1.5 font-medium text-ink-400">{hint}</span>}
            </label>
            {children}
            {error && <p className="mt-1.5 text-sm font-medium text-danger">{error}</p>}
        </div>
    )
}
