import { redirect } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { getCurrentUser } from '@/lib/session'
import { CheckoutView } from '@/components/checkout/CheckoutView'

export const metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
    // Checkout is the point where an account becomes necessary. Browsing and
    // building a cart stay open to everyone.
    // Validate the session rather than just looking for the cookie: a stale one
    // would otherwise sail past this guard and fail as a 401 further in.
    if (!(await getCurrentUser())) redirect('/login?next=/checkout')

    const result = await apiFetch('/addresses', { auth: true })

    return <CheckoutView initialAddresses={result.ok ? result.data : []} />
}
