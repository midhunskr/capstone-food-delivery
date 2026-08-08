import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForm'
import { getCurrentUser } from '@/lib/session'
import { product } from '@/config/product'

export const metadata = { title: 'Create account' }

export default async function RegisterPage() {
    // Redirect only when the session is genuinely valid. Checking merely for
    // the cookie's presence means a stale or expired one bounces the user
    // straight back to the home page, leaving them unable to sign in at all.
    if (await getCurrentUser()) redirect('/')

    return (
        <div className="mx-auto w-full max-w-md px-5 py-10 sm:py-16">
            <h1 className="text-[1.75rem] font-extrabold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-[0.95rem] text-ink-500">
                Save your addresses and reorder in a couple of taps.
            </p>

            <div className="mt-8">
                <Suspense>
                    <AuthForm mode="register" />
                </Suspense>
            </div>

            <p className="mt-8 text-center text-xs leading-relaxed text-ink-400">
                By creating an account you agree to {product.name}&apos;s terms and privacy policy.
            </p>
        </div>
    )
}
