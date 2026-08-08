import mongoose from 'mongoose'

/**
 * Shared test setup. Boots an in-memory MongoDB and the real Express app on an
 * ephemeral port, so tests exercise the actual HTTP stack (helmet, CORS,
 * validation, error handler) rather than calling controllers directly.
 *
 * Used because Atlas is unreachable from this machine; it also keeps tests fast
 * and independent of any live database.
 */

let mongo
let server
let baseUrl

export const startTestServer = async () => {
    if (baseUrl) return baseUrl

    // The default 10s startup budget is not enough on a cold or contended
    // machine (e.g. when a dev server is already running its own instance).
    // mongodb-memory-server reads this at import time, so set it first and
    // import dynamically.
    process.env.MONGOMS_STARTUP_TIMEOUT ||= '90000'
    const { MongoMemoryServer } = await import('mongodb-memory-server')

    mongo = await MongoMemoryServer.create()

    process.env.MONGO_URI = mongo.getUri('blockb')
    process.env.JWT_SECRET_KEY = 'test-only-secret-not-a-real-credential'
    process.env.JWT_EXPIRES_IN = '30d'
    process.env.NODE_ENV = 'test'
    process.env.ALLOWED_ORIGINS = 'http://localhost:5173,http://localhost:3000'

    const { createApp } = await import('../app.js')
    await mongoose.connect(process.env.MONGO_URI)

    const app = createApp()
    server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))

    baseUrl = `http://127.0.0.1:${server.address().port}`
    return baseUrl
}

export const stopTestServer = async () => {
    if (server) await new Promise((resolve) => server.close(resolve))
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close()
    if (mongo) await mongo.stop()
    baseUrl = undefined
}

export const api = async (path, { method = 'GET', body, token, origin } = {}) => {
    const headers = {}
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    if (token) headers.Authorization = `Bearer ${token}`
    if (origin) headers.Origin = origin

    const res = await fetch(baseUrl + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    })

    let json = null
    try { json = await res.json() } catch { /* non-JSON body */ }
    return { status: res.status, body: json, headers: res.headers }
}
