import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import { api, startTestServer, stopTestServer } from './helpers.js'

/**
 * Phase A regression cover. Block B must not have broken auth, v1 mounting,
 * CORS or the error envelope.
 */

before(async () => { await startTestServer() })
after(async () => { await stopTestServer() })

const account = { name: 'Aarti Menon', email: 'aarti@example.com', password: 'goodpassword1', phone: '+91 98470 12345' }

describe('v2 auth', () => {
    let token

    it('registers a valid user', async () => {
        const res = await api('/api/v2/auth/register', { method: 'POST', body: account })
        assert.equal(res.status, 201)
        assert.equal(res.body.ok, true)
        assert.equal(res.body.data.user.email, 'aarti@example.com')
        assert.equal(res.body.data.user.role, 'user')
        assert.ok(res.body.data.token)
        assert.ok(!JSON.stringify(res.body).match(/\$2[aby]\$/), 'no hash may leak')
        token = res.body.data.token
    })

    it('rejects a duplicate email', async () => {
        const res = await api('/api/v2/auth/register', { method: 'POST', body: account })
        assert.equal(res.status, 409)
        assert.equal(res.body.error.code, 'EMAIL_TAKEN')
    })

    it('rejects an invalid payload with field details', async () => {
        const res = await api('/api/v2/auth/register', {
            method: 'POST', body: { name: 'A', email: 'nope', password: 'short' },
        })
        assert.equal(res.status, 400)
        assert.equal(res.body.error.code, 'VALIDATION_FAILED')
        assert.ok(res.body.error.details.name && res.body.error.details.email)
    })

    // Regression: an optional field sent as null must not fail validation.
    it('accepts an omitted, empty or null phone on register', async () => {
        for (const [label, phone] of [['omitted', undefined], ['empty', ''], ['null', null]]) {
            const res = await api('/api/v2/auth/register', {
                method: 'POST',
                body: {
                    name: 'Phone Case',
                    email: `phone-${label}@example.com`,
                    password: 'goodpassword1',
                    ...(phone === undefined ? {} : { phone }),
                },
            })
            assert.equal(res.status, 201, `${label}: ${JSON.stringify(res.body)}`)
            assert.equal(res.body.data.user.phone, null, label)
        }
    })

    it('logs in with correct credentials', async () => {
        const res = await api('/api/v2/auth/login', {
            method: 'POST', body: { email: account.email, password: account.password },
        })
        assert.equal(res.status, 200)
        assert.ok(res.body.data.token)
    })

    it('rejects a wrong password without revealing which field was wrong', async () => {
        const wrongPassword = await api('/api/v2/auth/login', {
            method: 'POST', body: { email: account.email, password: 'nope12345' },
        })
        const unknownEmail = await api('/api/v2/auth/login', {
            method: 'POST', body: { email: 'ghost@example.com', password: 'nope12345' },
        })
        assert.equal(wrongPassword.status, 401)
        assert.equal(unknownEmail.status, 401)
        assert.equal(wrongPassword.body.error.message, unknownEmail.body.error.message)
    })

    it('returns the current user for a valid Bearer token', async () => {
        const res = await api('/api/v2/auth/me', { token })
        assert.equal(res.status, 200)
        assert.equal(res.body.data.user.email, account.email)
        assert.ok(!JSON.stringify(res.body).match(/password/i))
    })

    it('rejects a missing token', async () => {
        const res = await api('/api/v2/auth/me')
        assert.equal(res.status, 401)
        assert.equal(res.body.error.code, 'AUTH_REQUIRED')
    })

    it('rejects an expired token', async () => {
        const expired = jwt.sign({ sub: '507f1f77bcf86cd799439011', role: 'user' },
            process.env.JWT_SECRET_KEY, { expiresIn: '-1s' })
        const res = await api('/api/v2/auth/me', { token: expired })
        assert.equal(res.body.error.code, 'AUTH_EXPIRED')
    })

    it('issues a JWT carrying only { sub, role }', async () => {
        const decoded = jwt.decode(token)
        assert.deepEqual(Object.keys(decoded).sort(), ['exp', 'iat', 'role', 'sub'])
    })
})

describe('routing and envelope', () => {
    it('404s an unknown v2 route with the v2 envelope', async () => {
        const res = await api('/api/v2/nothing-here')
        assert.equal(res.status, 404)
        assert.equal(res.body.ok, false)
        assert.equal(res.body.error.code, 'ROUTE_NOT_FOUND')
    })

    it('still mounts legacy /api/v1', async () => {
        const res = await api('/api/v1/user/check-user')
        assert.equal(res.status, 400)
        assert.equal(res.body.message, 'Token missing, user not authenticated')
    })

    it('leaves the v1 response shape alone', async () => {
        const res = await api('/api/v1/user/login', { method: 'POST', body: {} })
        assert.equal(res.status, 400)
        assert.equal(res.body.success, false)
        assert.equal(res.body.ok, undefined)
    })

    it('sets security headers and honours the CORS allowlist', async () => {
        const allowed = await api('/api/v2/health', { origin: 'http://localhost:3000' })
        assert.equal(allowed.headers.get('x-content-type-options'), 'nosniff')
        assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:3000')

        const blocked = await api('/api/v2/health', { origin: 'http://evil.example.com' })
        assert.equal(blocked.status, 200)
        assert.equal(blocked.headers.get('access-control-allow-origin'), null)
    })

    it('never returns a stack trace', async () => {
        const res = await api('/api/v2/restaurants/definitely-missing')
        assert.ok(!JSON.stringify(res.body).includes('\n    at '))
    })
})
