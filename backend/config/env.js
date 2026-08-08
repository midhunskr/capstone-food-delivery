/**
 * Central place to read environment variables.
 *
 * Everything the app needs is resolved once, here, so no other module reaches
 * into process.env directly. Required values are checked at startup so a missing
 * secret fails loudly instead of surfacing as a confusing runtime error later.
 *
 * Legacy v1 integrations (Cloudinary, Razorpay) are read but NOT required, so
 * local development on v2 works without them configured.
 */

const REQUIRED = ['MONGO_URI', 'JWT_SECRET_KEY']

const missing = REQUIRED.filter((key) => !process.env[key] || !process.env[key].trim())

if (missing.length > 0) {
    console.error(
        `\nMissing required environment variable(s): ${missing.join(', ')}\n` +
        `Copy backend/.env.example to backend/.env and fill them in.\n`
    )
    process.exit(1)
}

const parseOrigins = (value) => {
    if (!value) return []
    return value.split(',').map((origin) => origin.trim()).filter(Boolean)
}

// Sensible defaults keep the legacy Vite app (5173) and the Next.js app (3100)
// working locally even when ALLOWED_ORIGINS is not set. 3000 stays listed for
// anyone running the web app on Next's default port.
const DEFAULT_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3100',
]

const configuredOrigins = parseOrigins(process.env.ALLOWED_ORIGINS)

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    port: Number(process.env.PORT) || 3000,

    mongoUri: process.env.MONGO_URI,

    jwtSecret: process.env.JWT_SECRET_KEY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',

    // Applied to the discounted item total at checkout. Configurable rather
    // than hardcoded — the demo default is not a compliance statement.
    taxPercent: Number.isFinite(Number(process.env.TAX_RATE)) && process.env.TAX_RATE !== ''
        ? Number(process.env.TAX_RATE)
        : 5,

    allowedOrigins: configuredOrigins.length > 0
        ? [...new Set([...configuredOrigins, ...DEFAULT_ORIGINS])]
        : DEFAULT_ORIGINS,

    // Optional — legacy v1 features. Absent values are tolerated so v2 work is
    // not blocked on having third-party accounts configured.
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
        get configured() {
            return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
        },
    },

    /**
     * Demo order progression. On, an order walks confirmed → delivered inside
     * DEMO_ORDER_WINDOW_MINUTES so a reviewer can watch it. Off, it tracks the
     * restaurant's real quoted delivery time. Either way the ETA shown to the
     * customer stays realistic — only the state machine is compressed.
     */
    demoOrderAcceleration: process.env.DEMO_ORDER_ACCELERATION !== 'false',
    demoOrderWindowMinutes: Number(process.env.DEMO_ORDER_WINDOW_MINUTES) || 3,
}
