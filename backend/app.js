import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import cookieParser from 'cookie-parser'

import { env } from './config/env.js'
import apiRouter from './routes/index.js'
import { errorHandler, notFoundHandler } from './middlewares/v2/errorHandler.js'

/**
 * Builds the Express app without connecting to a database or listening on a
 * port, so tests can mount it against an in-memory MongoDB. index.js owns
 * startup; this file owns wiring.
 */
export const createApp = () => {
    const app = express()

    // Render terminates TLS in front of us, so trust the proxy for correct client
    // IPs (rate limiting depends on this) and secure-cookie behaviour.
    app.set('trust proxy', 1)

    //Security headers
    app.use(helmet())

    /**
     * CORS — one coherent configuration.
     *
     * The previous setup combined cors({ origin: true }) with a hand-written
     * middleware that overwrote Access-Control-Allow-Origin with a single
     * hardcoded URL, which broke local development. That middleware is gone;
     * origins now come from ALLOWED_ORIGINS, with localhost defaults so both the
     * legacy Vite app and the future Next.js app work out of the box.
     *
     * credentials:true stays because v1 authenticates with a cookie. v2 uses a
     * Bearer token from the Next.js BFF and does not rely on it.
     */
    app.use(cors({
        origin(origin, callback) {
            // Same-origin, curl, server-to-server calls (including the Next.js BFF)
            // send no Origin header.
            if (!origin) return callback(null, true)
            // Disallowed origins simply get no Access-Control-Allow-Origin header,
            // which is what actually blocks the browser. Throwing here instead would
            // turn a routine cross-origin probe into a 500 with a stack trace.
            return callback(null, env.allowedOrigins.includes(origin))
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }))

    //Parsing incoming JSON requests and puts the parsed data in req.body
    app.use(express.json({ limit: '1mb' }))
    app.use(express.urlencoded({ extended: true, limit: '1mb' }))
    //Parsing incoming cookie
    app.use(cookieParser())

    //Mount the API: /api/v1 (legacy) and /api/v2 (new)
    app.use('/api', apiRouter)

    //Unknown API routes, then the global error handler. Order matters.
    app.use(notFoundHandler)
    app.use(errorHandler)

    return app
}
