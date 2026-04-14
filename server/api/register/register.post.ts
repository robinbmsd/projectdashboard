import pool from '~~/server/api/utils/connection'
import { readRawBody, setCookie } from 'h3' // HAPUS setResponseStatus dari sini!
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface RegisterBody {
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  try {
    // 1. Baca data mentah (lebih stabil di Nuxt 4)
    const rawBody = await readRawBody(event)
    const body: RegisterBody = rawBody ? JSON.parse(rawBody) : {}
    
    const { email, password } = body

    // 2. Validasi Input
    if (!email || !password) {
      // Panggil langsung, JANGAN di-import di atas. Garis merah & coretan pasti hilang!
      setResponseStatus(event, 400)
      return { success: false, message: 'Email dan password wajib diisi' }
    }

    // 3. Cek Database
    const [existingUsers]: any = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
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

    // 4. Proses Simpan
    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.execute(
      'INSERT INTO users (email, password, delete_flag) VALUES (?, ?, ?)',
      [email, hashedPassword, 0]
    )

    // 5. JWT & Cookies
    const secret = process.env.JWT_SECRET || 'KODE_RAHASIA_DUMMY_123'
    const token = jwt.sign({ email }, secret, { expiresIn: '1d' })

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return { success: true, message: 'Pendaftaran berhasil' }

  } catch (err: any) {
    console.error('API ERROR:', err)
    setResponseStatus(event, 500)
    return { success: false, message: 'Terjadi kesalahan sistem' }
  }
})