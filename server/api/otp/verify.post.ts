import pool from '~~/server/api/utils/connection'
import { decrypt } from '~~/server/api/utils/otp.decrypt'
import { setResponseStatus } from 'h3'
import jwt from 'jsonwebtoken'

import { createRequire } from 'module'
const _require = createRequire(import.meta.url)
const otplib = _require('otplib') as any

const authenticator = otplib.authenticator || otplib.default?.authenticator || otplib

export default defineEventHandler(async (event) => {
    try {
        let body: any = {}
        if (event.node && event.node.req) {
            body = await new Promise((resolve) => {
                let rawData = ''
                event.node!.req.on('data', (chunk: any) => { rawData += chunk.toString() })
                event.node!.req.on('end', () => {
                    try { resolve(JSON.parse(rawData || '{}')) } catch { resolve({}) }
                })
            })
        }

        const { email, code } = body

        if (!email || !code) {
            setResponseStatus(event, 400)
            return { success: false, message: 'Email and OTP Code are required.' }
        }

        const [rows]: any = await pool.execute('SELECT * FROM useraccount WHERE email = ?', [email])
        const user = rows[0]

        if (!user || !user.otp_secret) {
            setResponseStatus(event, 400)
            return { success: false, message: '2FA data not found' }
        }

        const decryptedSecret = decrypt(user.otp_secret)

        const isValid = authenticator.verify({
            token: code,
            secret: decryptedSecret
        })

        if (!isValid) {
            setResponseStatus(event, 400)
            return { success: false, message: 'OTP code is incorrect or expired!' }
        }

        if (user.is_otp_enabled === 0) {
            await pool.execute('UPDATE useraccount SET is_otp_enabled = 1 WHERE email = ?', [email])
        }

        const secretKey = process.env.JWT_SECRET as string
        if (!secretKey) {
            throw new Error('JWT_SECRET di file .env tidak ditemukan atau kosong!')
        }

        const token = jwt.sign({ email: user.email, id: user.id }, secretKey, { expiresIn: '1d' })

        await pool.execute('UPDATE useraccount SET token = ? WHERE email = ?', [token, email])

        if (event.node && event.node.res) {
            event.node.res.setHeader('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`)
        }

        return { success: true, message: 'Verification successful! Welcome'}

    } catch (err: any) {
        console.error('API VERIFY ERROR:', err)
        setResponseStatus(event, 500)
        return { success: false, message: 'Server error: ' + err.message }
    }
})