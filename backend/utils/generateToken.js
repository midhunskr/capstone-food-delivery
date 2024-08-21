import jwt from 'jsonwebtoken'

export const generateUserToken =(id, role, name) => {
    const token = jwt.sign({ id, role, name }, process.env.JWT_SECRET_KEY)
    return token
}