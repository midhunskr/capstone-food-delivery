import { getCurrentUser } from '@/lib/session'
import { CartView } from '@/components/cart/CartView'

export const metadata = { title: 'Your cart' }

export default async function CartPage() {
    // The cart itself is client-owned; the server only needs to know whether to
    // send the user to sign in or straight to checkout.
    return <CartView isSignedIn={Boolean(await getCurrentUser())} />
}
