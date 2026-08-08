import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

/**
 * v2 JWTs.
 *
 * Payload is exactly { sub, role } — nothing else, and never anything sensitive.
 * The v1 helper in utils/generateToken.js signs a different shape ({ id, role })
 * and is left alone so v1 keeps working.
 */

export const signAccessToken = ({ userId, role }) =>
    jwt.sign({ sub: String(userId), role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })

/**
 * Verifies a token and returns { id, role }.
 * Throws jsonwebtoken's TokenExpiredError / JsonWebTokenError, which the auth
 * middleware translates into user-facing messages.
 */
export const verifyAccessToken = (token) => {
    const decoded = jwt.verify(token, env.jwtSecret)
    return { id: decoded.sub, role: decoded.role }
}
