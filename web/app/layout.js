import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { product } from '@/config/product'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { CartBar } from '@/components/cart/CartBar'

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
})

export const metadata = {
    title: { default: `${product.name} — ${product.description}`, template: `%s · ${product.name}` },
    description: product.description,
}

export const viewport = {
    themeColor: '#fdfaf6',
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={jakarta.variable}>
            <body className="font-[family-name:var(--font-sans)] antialiased">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lift"
                >
                    Skip to content
                </a>

                <Header />

                {/* Bottom padding clears the mobile nav bar. */}
                {/* Bottom padding clears the mobile nav and the cart bar above it. */}
                <main id="main" className="pb-40 md:pb-24">{children}</main>

                <CartBar />
                <BottomNav />
            </body>
        </html>
    )
}
