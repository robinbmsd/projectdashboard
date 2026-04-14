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
        return { success: false, message: 'Email dan password wajib diisi' }
        }

        const sql = 'SELECT * FROM useraccount WHERE email = ?'
        const [rows]: any = await pool.execute(sql, [email])
        
        const user = rows[0]

        if (!user) {
        setResponseStatus(event, 400)
        return {
            success: false,
            field: 'email',
            message: 'Email ini tidak ditemukan di database'
        }
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
        setResponseStatus(event, 400)
        return {
            success: false,
            field: 'password',
            message: 'Password salah, coba cek lagi'
        }
        }


        return { 
        success: true, 
        message: 'Login berhasil' 
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