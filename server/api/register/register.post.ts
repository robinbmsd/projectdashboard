import pool from '~~/server/api/utils/connection'
import { setCookie, setResponseStatus } from 'h3' // Bersih dari fungsi parser H3 yang error
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface RegisterBody {
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  try {
    let body: RegisterBody = {}
    
    // 1. JURUS BYPASS: Kita pastikan 'node' ada agar TypeScript tidak ngomel "undefined"
    if (event.node && event.node.req) {
      body = await new Promise((resolve) => {
        let rawData = ''
        // Tanda seru (!) memastikan ke TS bahwa objek ini tidak mungkin kosong
        event.node!.req.on('data', (chunk: any) => { rawData += chunk.toString() })
        event.node!.req.on('end', () => {
          try { resolve(JSON.parse(rawData || '{}')) }
          catch { resolve({}) }
        })
      })
    }

    const { email, password } = body

    // 2. Validasi Input
    if (!email || !password) {
      setResponseStatus(event, 400)
      return { success: false, message: 'Email dan password wajib diisi' }
    }

    // 3. Cek Database
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

    // 4. Hash Password & Simpan
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await pool.execute(
      'INSERT INTO useraccount (email, password, delete_flag) VALUES (?, ?, ?)',
      [email, hashedPassword, 0]
    )

    // 5. Buat Token JWT
    const secret = process.env.JWT_SECRET || 'KODE_RAHASIA_DUMMY_123'
    const token = jwt.sign({ email }, secret, { expiresIn: '1d' })

    // 6. Set Cookie untuk Auto-Login
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