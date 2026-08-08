import { notFound, redirect } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { getCurrentUser } from '@/lib/session'
import { OrderDetailView } from '@/components/order/OrderDetailView'

export async function generateMetadata({ params }) {
    const { orderNumber } = await params
    return { title: `Order #${orderNumber.toUpperCase()}` }
}

export default async function OrderPage({ params }) {
    const { orderNumber } = await params

    if (!(await getCurrentUser())) redirect(`/login?next=/orders/${orderNumber}`)

    const result = await apiFetch(`/orders/${orderNumber}`, { auth: true })

    // A 404 here covers both "no such order" and "not yours" — the API returns
    // the same response for each on purpose.
    if (!result.ok) notFound()

    return <OrderDetailView initialOrder={result.data} />
}
