import pool from '~~/server/api/utils/connection'
import { encrypt } from '~~/server/api/utils/otp.encrypt'
import { setResponseStatus } from 'h3'
import * as QRCode from 'qrcode'

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

        const { email } = body

        if (!email) {
            setResponseStatus(event, 400)
            return { success: false, message: 'Email is required' }
        }

        const secret = authenticator.generateSecret()
        const encryptedSecret = encrypt(secret)

        await pool.execute(
            'UPDATE useraccount SET otp_secret = ? WHERE email = ?',
            [encryptedSecret, email]
        )

        const issuer = 'ProjectDashboard'
        const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`

        const qrCodeImageUrl = await QRCode.toDataURL(otpauthUrl, {
            width: 280,
            margin: 2,
            errorCorrectionLevel: 'M'
        })

        return {
            success: true,
            message: 'Setup successful!',
            qrImage: qrCodeImageUrl,
            secretCode: secret
        }

    } catch (err: any) {
        console.error('SETUP OTP ERROR:', err.message)
        setResponseStatus(event, 500)
        return { 
            success: false, 
            message: 'Failed to create QR Code:' + (err.message || 'Unknown error')
        }
    }
})