import { redirect } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { getCurrentUser } from '@/lib/session'
import { AddressManager } from '@/components/address/AddressManager'
import { ErrorState } from '@/components/ui/States'

export const metadata = { title: 'Saved addresses' }

export default async function AddressesPage() {
    if (!(await getCurrentUser())) redirect('/login?next=/account/addresses')

    const result = await apiFetch('/addresses', { auth: true })

    return (
        <div className="mx-auto max-w-(--container-page) px-4 pt-8 sm:px-6">
            {result.ok ? (
                <AddressManager initialAddresses={result.data} />
            ) : (
                <ErrorState
                    title="We couldn't load your addresses"
                    message="Something went wrong on our side. Try again in a moment."
                    retryHref="/account/addresses"
                />
            )}
        </div>
    )
}
