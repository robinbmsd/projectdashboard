import pool from '~~/server/api/utils/connection'
import { setCookie, setResponseStatus } from 'h3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface RegisterBody {
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  try {
    let body: RegisterBody = {}
    
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

    const [existingUsers]: any = await pool.execute(
      'SELECT email FROM useraccount WHERE email = ?',
      [email]
    )

    if (existingUsers.length > 0) {
      setResponseStatus(event, 400)
      return { 
        success: false, 
        field: 'email', 
        message: 'Email ini sudah terdaftar.' 
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    await pool.execute(
      'INSERT INTO useraccount (email, password, delete_flag) VALUES (?, ?, ?)',
      [email, hashedPassword, 0]
    )

    const secret = process.env.JWT_SECRET || 'KODE_RAHASIA_DUMMY_123'
    const token = jwt.sign({ email }, secret, { expiresIn: '1d' })

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return { 
      success: true, 
      message: 'Pendaftaran berhasil' 
    }

  } catch (err: any) {
    console.error('API ERROR:', err)
    setResponseStatus(event, 500)
    return { 
      success: false, 
      message: 'Terjadi kesalahan sistem: ' + (err.message || 'Unknown Error') 
    }
  }
})