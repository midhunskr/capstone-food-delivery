import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ReceiptText } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { getCurrentUser } from '@/lib/session'
import { OrderCard } from '@/components/order/OrderCard'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'

export const metadata = { title: 'Your orders' }

export default async function OrdersPage() {
    if (!(await getCurrentUser())) redirect('/login?next=/orders')

    const result = await apiFetch('/orders', { auth: true })

    if (!result.ok) {
        return (
            <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
                <h1 className="pt-8 text-[1.6rem] font-extrabold tracking-tight sm:text-3xl">Your orders</h1>
                <ErrorState
                    title="We couldn't load your orders"
                    message="Something went wrong on our side. Try again in a moment."
                    retryHref="/orders"
                />
            </div>
        )
    }

    const { active, past } = result.data
    const isEmpty = active.length === 0 && past.length === 0

    return (
        <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
            <h1 className="pt-8 text-[1.6rem] font-extrabold tracking-tight sm:text-3xl">Your orders</h1>

            {isEmpty ? (
                <EmptyState
                    icon={ReceiptText}
                    title="No orders yet"
                    message="Your first order will show up here."
                    action={<Button as={Link} href="/restaurants">Find food</Button>}
                />
            ) : (
                <div className="mt-6 space-y-8 pb-4">
                    {active.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">
                                {active.length === 1 ? 'Active order' : 'Active orders'}
                            </h2>
                            <div className="grid gap-3 lg:grid-cols-2">
                                {active.map((order) => (
                                    <OrderCard key={order.orderNumber} order={order} showReorder={false} />
                                ))}
                            </div>
                        </section>
                    )}

                    {past.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">
                                Past orders
                            </h2>
                            <div className="grid gap-3 lg:grid-cols-2">
                                {past.map((order) => <OrderCard key={order.orderNumber} order={order} />)}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    )
}
