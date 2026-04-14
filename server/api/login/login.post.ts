import pool from '~~/server/api/utils/connection'
import { readBody, setResponseStatus, createError } from 'h3'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      setResponseStatus(event, 400)
      return { message: 'Email dan password wajib diisi' }
    }

    const sql = 'SELECT * FROM users WHERE email = ?'
    const [rows]: any = await pool.execute(sql, [email])
    
    const user = rows[0]

    if (!user) {
      setResponseStatus(event, 400)
      return {
        field: 'email',
        message: 'Email ini tidak ditemukan di database'
      }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      setResponseStatus(event, 400)
      return {
        field: 'password',
        message: 'Password salah, coba cek lagi'
      }
    }

    return { 
      success: true, 
      message: 'Login berhasil' 
    }

  } catch (err: any) {
    console.error('MYSQL/SERVER ERROR:', err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    })
  }
})