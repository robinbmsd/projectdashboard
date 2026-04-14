import pool from '~~/server/api/utils/connection'
import { readBody, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface RegisterBody {
    email?: string
    password?: string
}

const jsonResponse = (data: object, status: number) =>
    new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })

const readNodeBody = (event: any): Promise<RegisterBody> =>
    new Promise((resolve) => {
        let raw = ''
        event.node.req.on('data', (chunk: any) => raw += chunk)
        event.node.req.on('end', () => {
        try { resolve(JSON.parse(raw)) }
        catch { resolve({}) }
        })
    })

export default defineEventHandler(async (event) => {
    const body = await readBody<RegisterBody>(event) || {}
    const { email, password } = body

    if (!email || !password) {
        return jsonResponse({ success: false, message: 'Email dan password wajib diisi' }, 400)
    }

    const [existingUsers]: any = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
    )
    if (existingUsers.length > 0) {
        return jsonResponse({ success: false, field: 'email', message: 'Email ini sudah terdaftar.' }, 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.execute(
        'INSERT INTO users (email, password, delete_flag) VALUES (?, ?, ?)',
        [email, hashedPassword, 0]
    )

    const token = jwt.sign(
        { email: email },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    )
    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
    })

    return jsonResponse({ success: true, message: 'Pendaftaran berhasil' }, 200)
})