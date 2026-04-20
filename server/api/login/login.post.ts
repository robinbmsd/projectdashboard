
import { getPool } from '~~/server/utils/connection'
import { setResponseStatus, setResponseHeader } from 'h3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

    const pool = await getPool()
    const [rows]: any = await pool.query('SELECT * FROM useraccount WHERE email = ?', [email])
    const users = rows as any[]

    if (users.length === 0) {
      setResponseStatus(event, 401)
      return { success: false, message: 'Email tidak ditemukan dalam database' }
    }

    const dbUser = users[0]
    const isPasswordValid = await bcrypt.compare(password, dbUser.password)

    if (!isPasswordValid) {
      setResponseStatus(event, 401)
      return { success: false, message: 'Password salah, silakan periksa kembali' }
    }

    const config = useRuntimeConfig()
    const secretServer = config.jwtSecret

    if (!secretServer) {
      setResponseStatus(event, 500)
      return { success: false, message: 'Terjadi kesalahan sistem (JWT Missing)' }
    }

    const token = jwt.sign({ userEmail: email }, secretServer, { expiresIn: '1h' })

const cookieOptions = [
  `auth_token=${token}`,
  'Path=/',
  'Max-Age=7200',
  'SameSite=Lax',
  process.env.NODE_ENV === 'production' ? 'Secure' : ''
].filter(Boolean).join('; ')

    if (event.node && event.node.res) {
      event.node.res['setHeader']('Set-Cookie', cookieOptions)
    }

    return { success: true, message: 'Login Berhasil!' }

  } catch (err: any) {
    console.error('API ERROR DETAIL:', err)
    setResponseStatus(event, 500)
    return { 
      success: false, 
      message: 'Server error: ' + (err.message || 'Unknown Error') 
    }
  }
})