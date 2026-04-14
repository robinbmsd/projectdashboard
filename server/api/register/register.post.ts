import pool from '~~/server/api/utils/connection'
import { readBody, setResponseStatus, createError } from 'h3'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      setResponseStatus(event, 400)
      return { 
        success: false,
        message: 'Email dan password wajib diisi' 
      }
    }

    const checkQuery = 'SELECT * FROM users WHERE email = ?'
    const [existingUsers]: any = await pool.execute(checkQuery, [email])
    
    if (existingUsers.length > 0) {
      setResponseStatus(event, 400)
      return {
        field: 'email',
        message: 'Email ini sudah terdaftar, silakan login.'
      }
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    const insertQuery = 'INSERT INTO users (email, password, delete_flag) VALUES (?, ?, ?)'
    await pool.execute(insertQuery, [email, hashedPassword, 0])
    
    return {
      success: true,
      message: 'Pendaftaran berhasil',
      user: email
    }

  } catch (err: any) {
    console.error('MYSQL/SERVER ERROR:', err)
    
    // Gunakan setResponseStatus untuk error 500 agar format JSON tetap rapi
    setResponseStatus(event, 500)
    return {
      success: false,
      message: err.message || 'Terjadi kesalahan pada server'
    }
  }
})