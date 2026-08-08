import mongoose from 'mongoose'
import { env } from './env.js'

/**
 * Mongoose connection.
 *
 * The previous version swallowed connection errors with console.log and let the
 * server start anyway, so a bad MONGO_URI showed up as every request failing
 * instead of a clear startup failure. Now a failed connection stops the process.
 *
 * strictQuery is set explicitly so behaviour doesn't shift between Mongoose
 * versions. No custom pool tuning — the defaults are right for a single Render
 * instance.
 */

mongoose.set('strictQuery', true)

export const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUri, {
            serverSelectionTimeoutMS: 10_000,
        })
        console.log('Database connected successfully!')
    } catch (error) {
        console.error('Could not connect to MongoDB:', error.message)
        process.exit(1)
    }

    mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error.message)
    })

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected.')
    })
}

export const disconnectDB = async () => {
    try {
        await mongoose.connection.close()
        console.log('Database connection closed.')
    } catch (error) {
        console.error('Error closing database connection:', error.message)
    }
}
