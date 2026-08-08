import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

/**
 * Runs the API against a throwaway in-memory MongoDB, seeded with demo data.
 *
 * For frontend development when Atlas isn't reachable. Data lives only as long
 * as the process — restart and you get the same seed back, which is exactly
 * what you want while building UI.
 *
 * Not for production: `npm start` is the real entry point.
 */
const mongo = await MongoMemoryServer.create()

process.env.MONGO_URI = mongo.getUri('devdb')
process.env.JWT_SECRET_KEY ||= 'local-dev-only-secret-not-for-production'
process.env.JWT_EXPIRES_IN ||= '30d'
process.env.NODE_ENV ||= 'development'
process.env.PORT ||= '3000'
process.env.ALLOWED_ORIGINS ||= 'http://localhost:3000,http://localhost:3001,http://localhost:5173'

const { createApp } = await import('../app.js')
const { seedDatabase } = await import('../seed/index.js')

await mongoose.connect(process.env.MONGO_URI)
const summary = await seedDatabase()

const app = createApp()
app.listen(Number(process.env.PORT), () => {
    console.log(`\nAPI (in-memory DB) on http://localhost:${process.env.PORT}`)
    console.log('Seeded:', summary)
    console.log('Data resets when this process stops.\n')
})

const shutdown = async () => {
    await mongoose.connection.close()
    await mongo.stop()
    process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
