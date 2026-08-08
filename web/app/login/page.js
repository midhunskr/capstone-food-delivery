import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForm'
import { getCurrentUser } from '@/lib/session'

export const metadata = { title: 'Sign in' }

export default async function LoginPage() {
    // Redirect only when the session is genuinely valid. Checking merely for
    // the cookie's presence means a stale or expired one bounces the user
    // straight back to the home page, leaving them unable to sign in at all.
    if (await getCurrentUser()) redirect('/')

    return (
        <div className="mx-auto w-full max-w-md px-5 py-10 sm:py-16">
            <h1 className="text-[1.75rem] font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-[0.95rem] text-ink-500">
                Sign in to pick up where you left off.
            </p>

            <div className="mt-8">
                <Suspense>
                    <AuthForm mode="login" />
                </Suspense>
            </div>
        </div>
    )
}
