'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

/**
 * Login and register share this form — the only differences are the fields and
 * the endpoint. Field errors come from the backend's validation details, so the
 * messages the user reads are the same ones the API enforces.
 */
export function AuthForm({ mode }) {
    const isRegister = mode === 'register'
    const router = useRouter()
    const params = useSearchParams()
    const next = params.get('next') || '/'

    const [values, setValues] = useState({ name: '', email: '', phone: '', password: '' })
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState('')
    const [busy, setBusy] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const set = (key) => (event) => {
        setValues((v) => ({ ...v, [key]: event.target.value }))
        setErrors((e) => ({ ...e, [key]: undefined }))
        setFormError('')
    }

    const submit = async (event) => {
        event.preventDefault()
        setBusy(true)
        setErrors({})
        setFormError('')

        const body = isRegister
            ? {
                name: values.name,
                email: values.email,
                password: values.password,
                ...(values.phone.trim() ? { phone: values.phone } : {}),
            }
            : { email: values.email, password: values.password }

        try {
            const res = await fetch(`/api/auth/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            const json = await res.json()

            if (!json.ok) {
                if (json.error?.details) setErrors(json.error.details)
                else setFormError(json.error?.message || 'Something went wrong. Please try again.')
                setBusy(false)
                return
            }

            router.push(next)
            router.refresh()
        } catch {
            setFormError("We couldn't reach the kitchen. Check your connection and try again.")
            setBusy(false)
        }
    }

    return (
        <form onSubmit={submit} noValidate className="space-y-4">
            {formError && (
                <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
                    {formError}
                </p>
            )}

            {isRegister && (
                <Field label="Your name" id="name" error={errors.name}>
                    <input
                        id="name" value={values.name} onChange={set('name')}
                        autoComplete="name" placeholder="Aarti Menon"
                        className={inputClass(errors.name)}
                    />
                </Field>
            )}

            <Field label="Email" id="email" error={errors.email}>
                <input
                    id="email" type="email" value={values.email} onChange={set('email')}
                    autoComplete="email" placeholder="you@example.com"
                    className={inputClass(errors.email)}
                />
            </Field>

            {isRegister && (
                <Field label="Phone" id="phone" error={errors.phone} hint="Optional — for delivery updates">
                    <input
                        id="phone" type="tel" value={values.phone} onChange={set('phone')}
                        autoComplete="tel" placeholder="98470 12345"
                        className={inputClass(errors.phone)}
                    />
                </Field>
            )}

            <Field label="Password" id="password" error={errors.password}>
                <div className="relative">
                    <input
                        id="password" type={showPassword ? 'text' : 'password'}
                        value={values.password} onChange={set('password')}
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        placeholder={isRegister ? 'At least 8 characters' : 'Your password'}
                        className={cn(inputClass(errors.password), 'pr-12')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="press absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-ink-400 hover:bg-sand-100"
                    >
                        {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                </div>
            </Field>

            <Button type="submit" size="lg" loading={busy} disabled={busy} className="w-full">
                {busy ? 'One moment' : isRegister ? 'Create account' : 'Sign in'}
            </Button>

            <p className="pt-1 text-center text-[0.95rem] text-ink-500">
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <Link
                    href={isRegister ? '/login' : '/register'}
                    className="press font-bold text-paprika-600 hover:underline"
                >
                    {isRegister ? 'Sign in' : 'Sign up'}
                </Link>
            </p>
        </form>
    )
}

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
