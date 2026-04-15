import pool from '~~/server/api/utils/connection'
import { setResponseStatus } from 'h3'
import bcrypt from 'bcryptjs'

interface LoginBody {
    email?: string
    password?: string
}

export default defineEventHandler(async (event) => {
    try {
        let body: LoginBody = {}
        
        if (event.node && event.node.req) {
            body = await new Promise((resolve) => {
                let rawData = ''
                event.node!.req.on('data', (chunk: any) => { rawData += chunk.toString() })
                event.node!.req.on('end', () => {
                    try { resolve(JSON.parse(rawData || '{}')) }
                    catch { resolve({}) }
                })
            })
        }

        const { email, password } = body

        if (!email || !password) {
            setResponseStatus(event, 400)
            return { success: false, message: 'Email and password required' }
        }

        const [rows]: any = await pool.execute('SELECT * FROM useraccount WHERE email = ?', [email])
        const user = rows[0]

        if (!user) {
            setResponseStatus(event, 400)
            return {
                success: false,
                field: 'email',
                message: 'This email was not found in the database'
            }
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            setResponseStatus(event, 400)
            return {
                success: false,
                field: 'password',
                message: 'Wrong password, please check again'
            }
        }

        if (user.otp_secret) {
            return {
                success: true,
                needsOTP: true,
                isNewOTP: false,
                message: 'Masukkan kode Google Authenticator'
            }
        } else {
            return {
                success: true,
                needsOTP: true,
                isNewOTP: true,
                message: 'Silakan setup Google Authenticator terlebih dahulu'
            }
        }

    } catch (err: any) {
        console.error('API ERROR DETAIL:', err)
        setResponseStatus(event, 500)
        return { 
            success: false, 
            message: 'Server error: ' + (err.message || 'Unknown Error') 
        }
    }
})