import mongoose from 'mongoose'
import { env } from './env.js'

/**
 * Mongoose connection.
 *
 * The previous version awaited this at startup and exited the process on
 * failure, so a Mongo outage — however brief — took the whole API down with
 * it, and Render would restart into the same failing connection. Now the
 * server starts listening without waiting on this (see index.js), and a
 * failed attempt retries on a fixed delay forever rather than exiting. Mongo
 * being temporarily unreachable is a transient condition, not a reason to
 * kill a healthy Node process.
 *
 * Once the first connection succeeds, the MongoDB driver's own topology
 * monitoring handles reconnection after later drops — the retry loop here
 * only covers getting connected in the first place.
 *
 * strictQuery is set explicitly so behaviour doesn't shift between Mongoose
 * versions. No custom pool tuning — the defaults are right for a single Render
 * instance.
 */

mongoose.set('strictQuery', true)

const RETRY_DELAY_MS = 5_000

let retryAttempt = 0
let retryTimer = null
let isShuttingDown = false

const attemptConnect = async () => {
    if (isShuttingDown) return

    try {
        await mongoose.connect(env.mongoUri, {
            serverSelectionTimeoutMS: 10_000,
        })
        retryAttempt = 0
        // Success is logged by the 'connected' event listener below, so it
        // reads the same way whether this was the first try or a retry.
    } catch (error) {
        retryAttempt += 1
        console.error(
            `MongoDB connection attempt ${retryAttempt} failed: ${error.message} ` +
            `— retrying in ${RETRY_DELAY_MS / 1000}s.`
        )
        retryTimer = setTimeout(attemptConnect, RETRY_DELAY_MS)
    }
}

/** True once Mongoose has an active connection. Used by /health, /ready and requireDb. */
export const isDbConnected = () => mongoose.connection.readyState === 1

/**
 * Starts connecting to MongoDB in the background.
 *
 * Does not wait for the connection and never throws — the caller can start
 * accepting HTTP requests immediately. Routes that need the database check
 * isDbConnected() (see middlewares/v2/requireDb.js) instead of assuming it's
 * ready.
 */
export const connectDB = () => {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected.')
    })

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected.')
    })

    mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected.')
    })

    mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error.message)
    })

    attemptConnect()
}

export const disconnectDB = async () => {
    isShuttingDown = true
    if (retryTimer) clearTimeout(retryTimer)

    try {
        await mongoose.connection.close()
        console.log('Database connection closed.')
    } catch (error) {
        console.error('Error closing database connection:', error.message)
    }
}
