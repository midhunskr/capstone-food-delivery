import { env } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'
import { createApp } from './app.js'

const app = createApp()

const start = async () => {
    await connectDB()

    const server = app.listen(env.port, () => {
        console.log(`Server listening on port ${env.port} (${env.nodeEnv})`)
    })

    // A port collision is one of the most common local failures and Node's
    // default output for it is a bare stack trace. Say what actually happened.
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(
                `\nPort ${env.port} is already in use, so the API did not start.\n` +
                `Something else is listening there. Either stop it, or set a different\n` +
                `PORT in backend/.env — and update API_URL in web/.env.local to match.\n`
            )
        } else {
            console.error('Server failed to start:', error)
        }
        process.exit(1)
    })

    const shutdown = async (signal) => {
        console.log(`\n${signal} received, shutting down.`)
        server.close(async () => {
            await disconnectDB()
            process.exit(0)
        })
        // Don't hang forever if a connection refuses to close.
        setTimeout(() => process.exit(1), 10_000).unref()
    }

    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start().catch((error) => {
    console.error('Failed to start server:', error)
    process.exit(1)
})

export default app
