import Link from 'next/link'
import { MapPin, Search, Tag } from 'lucide-react'
import { product } from '@/config/product'
import { getCurrentUser } from '@/lib/session'
import { AccountMenu } from './AccountMenu'
import { Logo } from './Logo'
import { HeaderCartButton } from '@/components/cart/HeaderCartButton'

/**
 * Desktop header. On mobile it collapses to brand + location + a search icon;
 * the real navigation down there is the bottom bar.
 */
export async function Header() {
    const user = await getCurrentUser()

    return (
        <header className="sticky top-0 z-40 border-b border-sand-200 bg-paper/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-(--container-page) items-center gap-3 px-4 sm:px-6">
                <Link href="/" className="press flex h-10 shrink-0 items-center" aria-label={`${product.name} home`}>
                    <Logo />
                </Link>

                <button
                    type="button"
                    className="press ml-1 flex h-10 min-w-0 items-center gap-1.5 rounded-pill px-2.5 text-left hover:bg-sand-100"
                    title="Delivery location"
                >
                    <MapPin className="size-4 shrink-0 text-paprika-500" />
                    <span className="truncate text-sm font-semibold">{product.city}</span>
                </button>

                <div className="flex-1" />

                <nav className="hidden items-center gap-1 md:flex">
                    <Link
                        href="/search"
                        className="press flex items-center gap-2 rounded-pill px-3.5 py-2 text-[0.95rem] font-semibold text-ink-600 hover:bg-sand-100 hover:text-ink-900"
                    >
                        <Search className="size-[1.05rem]" /> Search
                    </Link>
                    <Link
                        href="/restaurants?offers=1"
                        className="press flex items-center gap-2 rounded-pill px-3.5 py-2 text-[0.95rem] font-semibold text-ink-600 hover:bg-sand-100 hover:text-ink-900"
                    >
                        <Tag className="size-[1.05rem]" /> Offers
                    </Link>
                </nav>

                <Link
                    href="/search"
                    aria-label="Search"
                    className="press grid size-10 shrink-0 place-items-center rounded-full text-ink-600 hover:bg-sand-100 md:hidden"
                >
                    <Search className="size-5" />
                </Link>

                <HeaderCartButton />
                <AccountMenu user={user} />
            </div>
        </header>
    )
}
